export const BUSINESS = {
  name: '위노뷰티',
  brand: 'WITH NOA',
  location: 'CHEONGJU',
  tagline: '정직함으로, 실력으로.\n당신의 아름다움을 함께합니다.',
  // TODO(team-lead): 실제 정보로 교체 필요
  address: '충청북도 청주시 (정확한 주소 확인 중)',
  phone: '010-0000-0000',
  phoneTel: 'tel:010-0000-0000',
  kakaoChannel: 'https://pf.kakao.com/_xxxxxxx',
  hours: [
    { day: '평일', time: '10:00 - 20:00' },
    { day: '주말', time: '10:00 - 18:00' },
    { day: '휴무', time: '추후 안내' },
  ],
  businessNumber: '000-00-00000',
  representative: '대표자명 확인 중',
} as const;

export const NAV = [
  { href: '/', label: '홈' },
  { href: '/services', label: '서비스' },
  { href: '/gallery', label: '갤러리' },
  { href: '/booking', label: '예약' },
  { href: '/contact', label: '오시는 길' },
] as const;
