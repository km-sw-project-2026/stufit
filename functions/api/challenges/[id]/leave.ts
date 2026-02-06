export default async function handler(
  request: Request,
  { env, params, userId }: { env: any; params: { id: string }; userId: number }
) {
  console.log("=== LEAVE HANDLER START ===");
  console.log("Method:", request.method);
  console.log("Params:", params);
  console.log("UserId:", userId);
  console.log("DB:", !!env?.D1_DB);

  try {
    if (request.method !== "DELETE") {
      console.error("❌ Wrong method");
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!env?.D1_DB) {
      console.error("❌ D1_DB not found");
      return new Response(
        JSON.stringify({ success: false, message: "DB not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const challengeId = Number(params.id);
    console.log("Challenge ID:", challengeId, "Type:", typeof challengeId);

    // 챌린지 존재 확인
    const challenge = await env.D1_DB.prepare(
      "SELECT created_by_user_id FROM challenges WHERE challenge_id = ?"
    ).bind(challengeId).first();

    console.log("Challenge:", challenge);

    if (!challenge) {
      console.log("❌ Challenge not found");
      return new Response(
        JSON.stringify({ success: false, message: "Challenge not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isOwner = challenge.created_by_user_id === userId;
    console.log("Is owner:", isOwner);

    if (isOwner) {
      console.log("📝 Deleting challenge (owner) - cascade delete");
      // 관련된 모든 데이터 먼저 삭제
      await env.D1_DB.prepare("DELETE FROM challenge_results WHERE challenge_id = ?")
        .bind(challengeId).run();
      await env.D1_DB.prepare("DELETE FROM challenge_daily_progress WHERE challenge_id = ?")
        .bind(challengeId).run();
      await env.D1_DB.prepare("DELETE FROM challenge_members WHERE challenge_id = ?")
        .bind(challengeId).run();
      await env.D1_DB.prepare("DELETE FROM challenges WHERE challenge_id = ?")
        .bind(challengeId).run();
    } else {
      console.log("📝 Removing member from challenge");
      try {
        await env.D1_DB.prepare(
          "DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?"
        ).bind(challengeId, userId).run();
      } catch (deleteErr) {
        console.log("⚠️ Member delete failed:", deleteErr?.message);
      }

      console.log("📝 Reducing score");
      try {
        await env.D1_DB.prepare(
          "UPDATE user_profiles SET score = score - 100 WHERE user_id = ?"
        ).bind(userId).run();
      } catch (scoreErr) {
        console.log("⚠️ Score update failed (continuing anyway):", scoreErr?.message);
      }
    }

    console.log("✅ Success");
    return new Response(
      JSON.stringify({ success: true, message: "Successfully left challenge" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ ERROR:", err instanceof Error ? err.message : String(err));
    console.error("Stack:", err instanceof Error ? err.stack : "");
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Server error",
        error: err instanceof Error ? err.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
