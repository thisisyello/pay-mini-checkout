# 💳 Pay Mini Checkout

**"실제 결제는 어떻게 이루어질까?"** 라는 궁금증에서 시작한 미니 결제 프로젝트입니다.

토스 페이먼츠(Toss Payments) API를 연동하여, 클라이언트에서 결제를 요청하고 서버에서 최종 승인하는 **안전한 결제 흐름**을 직접 구현해 보았습니다.

## 배운점

### 1. 클라이언트와 서버의 역할 분리

결제는 클라이언트(브라우저)에서 끝나는 것이 아니라, **서버 검증**이 필수입니다.

- **브라우저**: `TossPayments` SDK를 통해 카드 인증을 받습니다.
- **서버**: 인증 결과를 받아 토스 API에 최종 승인 요청을 보내고, **결제 금액 위변조**를 방지합니다.

### 2. 데이터 무결성 보장

- 주문 생성 시점의 금액과 최종 결제 승인 시점의 금액이 일치하는지 서버에서 검증합니다.
- 결제 승인이 완료된 후에만 DB 상태를 `PAID`로 업데이트합니다.

## 기술 스택

| 분류      | 기술                           |
| --------- | ------------------------------ |
| Framework | Next.js 16 (App Router)        |
| Database  | PostgreSQL (Neon) + Prisma ORM |
| Payment   | Toss Payments API (v1)         |
| Styling   | Tailwind CSS                   |
| Language  | TypeScript                     |

## 결제 흐름

1. **주문 생성**: 사용자가 금액을 입력하면 `CREATED` 상태의 주문 생성
2. **결제 요청**: 토스 결제창에서 카드 인증 진행
3. **인증 성공**: `successUrl`(`/api/payments/confirm`)로 리다이렉트
4. **최종 승인**: 서버에서 토스 승인 API 호출 + 금액 검증
5. **결과 저장**: DB 상태를 `PAID`로 변경, 결과 페이지로 이동

## 실행 방법

[토스 페이먼츠 개발자센터](https://developers.tosspayments.com/)에서 테스트 키를 발급받으세요.

```bash
# 1. 설치
git clone https://github.com/thisisyello/pay-mini-checkout.git
npm install

# 2. 환경 변수 설정 (.env 파일 생성)
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TOSS_CLIENT_KEY="test_ck_..."
TOSS_SECRET_KEY="test_sk_..."

# 3. DB 마이그레이션 및 실행
npx prisma migrate dev --name init
npm run dev
```

## 마치며

처음에는 단순히 "결제 버튼 누르면 끝"인 줄 알았는데, **안전한 거래를 위해 클라이언트와 서버가 어떻게 데이터를 주고받아야 하는지** 깊게 고민해볼 수 있었습니다.
