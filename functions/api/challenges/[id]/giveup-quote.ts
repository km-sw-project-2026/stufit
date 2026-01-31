const GIVE_UP_QUOTES = [
  "지금 포기하면, 여기까지 온 이유도 사라져요.",
  "조금 느려도 괜찮아요. 멈추지만 않으면 돼요.",
  "오늘의 포기는 내일의 후회가 될 수도 있어요.",
  "지금까지 버틴 당신, 생각보다 훨씬 대단해요.",
  "완벽하지 않아도 끝까지 가는 사람이 이겨요.",
  "지금 힘든 건, 제대로 하고 있다는 증거예요.",
  "포기하고 싶다는 건, 진지하게 임하고 있다는 뜻이에요.",
  "오늘 하루만 더 가볼까요?",
  "여기서 한 걸음만 더 가면, 어제의 나를 이길 수 있어요.",
  "당신은 이미 시작했고, 그건 아무나 못 해요."
];

export default async function handler(
  request: Request,
  context: { params: { id: string } }
) {
  const method = request.method;
  const challengeId = context.params.id;

  // GET만 허용
  if (method !== "GET") {
    return new Response(
      JSON.stringify({ ok: false, message: "Method Not Allowed" }),
      { status: 405 }
    );
  }

  // 랜덤 명언 선택
  const randomIndex = Math.floor(Math.random() * GIVE_UP_QUOTES.length);
  const quote = GIVE_UP_QUOTES[randomIndex];

  return new Response(
    JSON.stringify({
      ok: true,
      challenge_id: challengeId,
      quote,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
