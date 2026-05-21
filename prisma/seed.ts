import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 영업시간 (월~금 10:00-20:00, 토 10:00-18:00, 일 휴무)
  const hours = [
    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },  // 일
    { dayOfWeek: 1, openTime: '10:00', closeTime: '20:00', isClosed: false }, // 월
    { dayOfWeek: 2, openTime: '10:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 3, openTime: '10:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 4, openTime: '10:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 5, openTime: '10:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 6, openTime: '10:00', closeTime: '18:00', isClosed: false }, // 토
  ];
  for (const h of hours) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      create: h,
      update: h,
    });
  }

  // 서비스 시드
  const services = [
    { slug: 'lash-classic', name: '속눈썹 연장 - 클래식', category: 'EYELASH' as const, durationMinutes: 90, priceKrw: 70000, description: '한 가닥씩 자연스럽게 연장', displayOrder: 10 },
    { slug: 'lash-volume', name: '속눈썹 연장 - 볼륨', category: 'EYELASH' as const, durationMinutes: 120, priceKrw: 100000, description: '풍성한 볼륨 연출', displayOrder: 11 },
    { slug: 'lash-perm', name: '속눈썹 펌', category: 'EYELASH' as const, durationMinutes: 60, priceKrw: 50000, description: '자연스러운 컬링', displayOrder: 12 },
    { slug: 'nail-gel', name: '젤 네일', category: 'NAIL' as const, durationMinutes: 90, priceKrw: 55000, description: '기본 젤 컬러', displayOrder: 20 },
    { slug: 'nail-art', name: '네일 아트', category: 'NAIL' as const, durationMinutes: 120, priceKrw: 80000, description: '디자인 네일', displayOrder: 21 },
    { slug: 'skin-care', name: '기본 피부 관리', category: 'SKIN' as const, durationMinutes: 60, priceKrw: 60000, description: '클렌징 + 마사지 + 팩', displayOrder: 30 },
    { slug: 'waxing-brazilian', name: '브라질리언 왁싱', category: 'WAXING' as const, durationMinutes: 60, priceKrw: 70000, description: null, displayOrder: 40 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: s,
      update: s,
    });
  }

  // 관리자 계정 (1인 사장님)
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'owner@winobeauty.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'change-me-on-first-login';
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash, name: '사장님', role: 'OWNER' },
    update: { passwordHash, name: '사장님' },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
