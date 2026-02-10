export default async function handler(request: Request, { env, params }: any) {
  try {
    if (!env?.D1_DB) return new Response(JSON.stringify({ success: false, message: 'DB not configured' }), { status: 500 });

    const id = Number(params.id);
    if (Number.isNaN(id)) return new Response(JSON.stringify({ success: false, message: 'Invalid challenge id' }), { status: 400 });

    // detect status column
    const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
    const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');
    let members;
    if (hasStatus) {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(id)
        .all();
    } else {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(id)
        .all();
      members.results = (members.results || []).map((r: any) => ({ ...r, status: 'not_submitted' }));
    }

    return new Response(JSON.stringify({ success: true, members: members.results || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, message: 'Failed to fetch members', error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
