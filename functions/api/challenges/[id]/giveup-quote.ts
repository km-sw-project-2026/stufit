export default async function handler(request: Request) {
  const method = request.method;
  return new Response(
    JSON.stringify({ ok: true, route: '/api/challenges/[id]/giveup-quote', method }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
