// 이메일 알림 — Phase 1-2 확정 채널
// 프로바이더: Resend 권장. EMAIL_PROVIDER 환경변수로 분기.

type BookingEmailPayload = {
  to: string;
  customerName: string;
  serviceName: string;
  startAtKst: string;
  shortCode: string;
};

async function sendViaResend(opts: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM ?? 'reservations@winobeauty.com';
  if (!apiKey) {
    console.warn('[email] EMAIL_API_KEY missing — skipping send', opts.subject);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error('[email] resend failed', res.status, body);
  }
}

export async function sendBookingConfirmationToCustomer(p: BookingEmailPayload) {
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>위노뷰티 예약이 접수되었습니다</h2>
      <p>${p.customerName} 고객님, 예약 신청이 접수되었습니다. 사장님 확인 후 확정 알림을 드립니다.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>시술</b></td><td style="padding:8px;border-bottom:1px solid #eee">${p.serviceName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>일시</b></td><td style="padding:8px;border-bottom:1px solid #eee">${p.startAtKst}</td></tr>
        <tr><td style="padding:8px"><b>예약 번호</b></td><td style="padding:8px"><code>${p.shortCode}</code></td></tr>
      </table>
      <p style="font-size:13px;color:#666">예약 조회/취소 시 전화번호와 예약 번호가 필요합니다. 변경/취소는 예약 시작 24시간 전까지 가능합니다.</p>
    </div>`;
  await sendViaResend({
    to: p.to,
    subject: `[위노뷰티] 예약 접수 안내 — ${p.shortCode}`,
    html,
  });
}

export async function sendBookingNotificationToAdmin(p: BookingEmailPayload) {
  const adminTo = process.env.EMAIL_ADMIN_TO;
  if (!adminTo) return;
  const html = `
    <div style="font-family:sans-serif">
      <h3>새 예약 신청</h3>
      <p>고객: ${p.customerName}<br/>시술: ${p.serviceName}<br/>일시: ${p.startAtKst}<br/>예약번호: ${p.shortCode}</p>
    </div>`;
  await sendViaResend({
    to: adminTo,
    subject: `[위노뷰티 관리] 새 예약 — ${p.customerName} / ${p.startAtKst}`,
    html,
  });
}
