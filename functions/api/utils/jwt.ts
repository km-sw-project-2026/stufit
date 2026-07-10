// 간단한 JWT 구현 (실제 환경에서는 @tsndr/cloudflare-worker-jwt 사용)
// 지금은 타입만 정의하고 실제 검증은 worker/index.ts에서 처리

interface JWTPayload {
  userId: number;
  exp?: number;
}

// 토큰 생성 함수
export async function generateToken(userId: number): Promise<string> {
  // 1시간 만료
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  const payload: JWTPayload = { userId, exp };
  // 실제 환경에서는 JWT 라이브러리 사용
  return btoa(JSON.stringify(payload));
}

// 토큰 검증 함수
export async function verifyToken(
  token: string,
): Promise<{ userId: number } | null> {
  try {
    // 실제 환경에서는 JWT 라이브러리의 verify 사용
    const decoded = JSON.parse(atob(token));
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}
