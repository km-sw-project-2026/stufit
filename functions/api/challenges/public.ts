export default async function handler(request: Request, { env }: { env: any }) {
  console.log('=== Public Challenges API Handler ===');
  console.log('Method:', request.method);

  // GET만 허용
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // 코드가 없는 공개 챌린지만 조회
    const publicChallenges = await env.D1_DB
      .prepare(
        `SELECT c.*, 
            (SELECT COUNT(*) FROM challenge_members cm WHERE cm.challenge_id = c.challenge_id) AS member_count
         FROM challenges c
         WHERE (c.challenge_code IS NULL OR c.challenge_code = '')
         AND c.deleted_at IS NULL
         AND (SELECT COUNT(*) FROM challenge_members cm2 WHERE cm2.challenge_id = c.challenge_id) < c.max_members
         ORDER BY created_at DESC`
      )
      .all();

    console.log('Found public challenges:', publicChallenges.results?.length || 0);

    return Response.json({
      success: true,
      challenges: publicChallenges.results || []
    });

  } catch (err: unknown) {
    console.error('공개 챌린지 목록 조회 오류:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, message: '챌린지 목록을 불러올 수 없습니다.', error: errorMessage },
      { status: 500 }
    );
  }
}
