# Backend Additions — Task #11 산출물

**작업자:** backend-engineer
**상태:** 코드 완료, Supabase 연결 정보 수령 후 실행 가능

## 추가된 파일

```
winobeauty-website/
├── prisma/
│   ├── schema.prisma          # Prisma 스키마 (Supabase Postgres)
│   └── seed.ts                # 시드 데이터 (영업시간, 서비스 7개, 관리자 1)
├── lib/
│   ├── prisma.ts              # PrismaClient 싱글톤
│   ├── api.ts                 # 응답 헬퍼, 에러 핸들러, 전화번호 유틸
│   ├── schemas.ts             # Zod 검증 스키마
│   ├── availability.ts        # 슬롯 계산 + 동시 예약 충돌 검사
│   └── email.ts               # Resend 기반 이메일 알림
└── app/api/
    ├── services/
    │   ├── route.ts                  # GET /api/services
    │   └── [slug]/route.ts           # GET /api/services/:slug
    ├── availability/route.ts         # GET /api/availability
    └── bookings/
        ├── route.ts                  # POST 예약 생성, GET 조회(phone+code)
        └── [id]/route.ts             # GET/PATCH/DELETE 단일 예약
```

## 의존성 (Next.js 프로젝트 init 후 추가 필요)

```bash
npm i @prisma/client zod bcryptjs
npm i -D prisma @types/bcryptjs tsx
```

## package.json scripts 추가

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## tsconfig path alias 확인

`@/lib/*` 사용 — Next.js 기본 tsconfig 의 `"paths": { "@/*": ["./*"] }` 가 필요.

## 환경변수 필수 (.env.local)

```
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"   # Supabase Pooled
DIRECT_URL="postgresql://..."                                         # Supabase Direct (마이그레이션용)
EMAIL_PROVIDER="resend"
EMAIL_API_KEY="re_..."
EMAIL_FROM="reservations@winobeauty.com"
EMAIL_ADMIN_TO="owner@winobeauty.com"
SEED_ADMIN_EMAIL="owner@winobeauty.com"
SEED_ADMIN_PASSWORD="<강력한 임시 비밀번호>"
```

## 실행 순서 (Supabase URL 수령 후)

```bash
# 1) Next.js 프로젝트 (Task #10 완료 가정)
cd C:\Users\user\winobeauty-website

# 2) 의존성 설치
npm install

# 3) Prisma client 생성 + 마이그레이션
npx prisma generate
npx prisma migrate dev --name init

# 4) 시드 데이터 적재
npm run db:seed

# 5) 개발 서버
npm run dev

# 6) 검증: Prisma Studio
npm run db:studio
```

## API 검증 (Postman/Thunder Client)

```http
### 서비스 목록
GET http://localhost:3000/api/services

### 가용 슬롯
GET http://localhost:3000/api/availability?serviceId=<id>&date=2026-05-25

### 예약 생성
POST http://localhost:3000/api/bookings
Content-Type: application/json

{
  "serviceId": "<id>",
  "startAt": "2026-05-25T05:00:00Z",
  "customer": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "test@example.com",
    "marketingOk": false
  },
  "notes": "처음 방문"
}

### 예약 조회 (전화 + 단축코드)
GET http://localhost:3000/api/bookings?phone=010-1234-5678&code=AB12CD34

### 예약 취소
DELETE http://localhost:3000/api/bookings/AB12CD34
Content-Type: application/json

{ "phone": "010-1234-5678", "reason": "일정 변경" }
```

## 알려진 제약 / 후속 작업

- **관리자 API 미구현** (Task #11 범위 외): `/api/admin/*` Phase 2 후반에 별도 작업
- **Rate limiting 미적용**: Upstash 셋업 완료 후 미들웨어 추가 예정 (devops 협업)
- **트랜잭션 잠금**: `isSlotAvailable` 는 일반 read — 극도로 동시 부하 시 race 가능. 운영 부하 모니터링 후 advisory lock 추가 검토
- **이메일 발송 실패 처리**: 현재 fire-and-forget. 큐 도입은 Phase 3
- **테스트**: qa-validator 와 테스트 케이스 합의 필요 (E2E 시나리오)

## 차단 사항

1. **Supabase 연결 URL** (devops-engineer 대기)
2. **Resend API 키 + 도메인 검증** (devops-engineer 대기)
3. **Next.js 프로젝트 초기화** (Task #10 — web-designer 대기)

Task #10/#12 완료 후 `npm install` → `prisma migrate` → `seed` 실행으로 즉시 동작 가능 상태.
