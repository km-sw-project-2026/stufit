export default async function handler(request: Request) {
  const method = request.method;
  return new Response(
    JSON.stringify({ ok: true, route: '/api/auth/register', method }),
    { headers: { 'Content-Type': 'application/json' } } 알랄라 연습연습
  
  );
}
