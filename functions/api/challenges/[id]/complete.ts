export default async function handler(request: Request) {
  const method = request.method;
  return new Response(
    JSON.stringify({ ok: true, route: '/api/challenges/[id]/complete', method }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
