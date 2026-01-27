// functions/api/utils/jwt.ts

// 모듈 타입이 없기 때문에, TS에게 모듈 존재만 알려주기
import { create, verify, getNumericDate } from "@tsndr/cloudflare-worker-jwt";

// 실제 서비스에서는 env.SECRET 사용
const SECRET: string = "your-secret-key";

// 토큰 생성 함수
export async function generateToken(userId: number): Promise<string> {
  // 1시간 만료
  return await create({ userId, exp: getNumericDate(60 * 60) }, SECRET);
}

// 토큰 검증 함수
export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const payload = await verify(token, SECRET);
    // payload 타입이 any이므로 안전하게 any 처리
    return payload as { userId: number };
  } catch {
    return null;
  }
}
