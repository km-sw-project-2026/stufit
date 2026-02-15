export const onRequestGet = async (context: { request: Request; env: any }) => {
  const { env } = context;
  try {
    if (!env.D1_DB) {
      return Response.json({ success: false, error: 'DB not configured' }, { status: 500 });
    }

    // Select username and score (if exists) from users + user_profiles
    const rows = await env.D1_DB.prepare(
      `SELECT u.user_id as userId, u.username as username, COALESCE(up.score, 0) as score
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.user_id
       ORDER BY score DESC, username ASC`
    ).all();

    const results = Array.isArray(rows?.results) ? rows.results.map((r: any) => ({ username: r.username, score: Number(r.score) || 0, userId: Number(r.userId) || null })) : [];

    return Response.json({ success: true, users: results });
  } catch (err) {
    console.error('users list error', err);
    return Response.json({ success: false, error: String((err as any)?.message || err) }, { status: 500 });
  }
};
