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
      console.log("📝 Host leaving - transferring ownership");
      
      // 다른 멤버 찾기 (방장 제외)
      const nextOwner = await env.D1_DB.prepare(
        "SELECT user_id FROM challenge_members WHERE challenge_id = ? AND user_id != ? LIMIT 1"
      ).bind(challengeId, userId).first();

      if (nextOwner) {
        console.log("📝 Transferring ownership to user:", nextOwner.user_id);
        // 방장 권한 이전
        await env.D1_DB.prepare(
          "UPDATE challenges SET created_by_user_id = ? WHERE challenge_id = ?"
        ).bind(nextOwner.user_id, challengeId).run();
        
        // 현재 방장 멤버 목록에서 제거
        await env.D1_DB.prepare(
          "DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?"
        ).bind(challengeId, userId).run();
        
        // 진행도 확인 (날짜를 다 채웠는지)
        const progressCount = await env.D1_DB.prepare(
          "SELECT COUNT(*) as count FROM challenge_daily_progress WHERE challenge_id = ? AND user_id = ?"
        ).bind(challengeId, userId).first();
        
        // 챌린지 총 기간 계산
        const challengeInfo = await env.D1_DB.prepare(
          "SELECT created_at, end_date FROM challenges WHERE challenge_id = ?"
        ).bind(challengeId).first();
        
        const totalDays = Math.ceil(
          (new Date(challengeInfo.end_date).getTime() - new Date(challengeInfo.created_at).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        
        console.log("Progress:", progressCount?.count, "Total days:", totalDays);
        
        // 날짜를 다 채우지 않았으면 100점 차감
        if ((progressCount?.count || 0) < totalDays) {
          console.log("📝 Reducing score (incomplete challenge) for userId:", userId);
          
          // user_profiles 레코드 확인
          let currentProfile = await env.D1_DB.prepare(
            "SELECT score FROM user_profiles WHERE user_id = ?"
          ).bind(userId).first();
          
          console.log("📝 Current profile before insert:", currentProfile);
          
          // user_profiles 레코드가 없으면 생성
          if (!currentProfile) {
            await env.D1_DB.prepare(
              "INSERT INTO user_profiles (user_id, tier, score, points) VALUES (?, 'bronze', 0, 0)"
            ).bind(userId).run();
            
            console.log("📝 Profile created for userId:", userId);
            
            // 다시 조회
            currentProfile = await env.D1_DB.prepare(
              "SELECT score FROM user_profiles WHERE user_id = ?"
            ).bind(userId).first();
          }
          
          const oldScore = currentProfile?.score || 0;
          const newScore = Math.max(0, oldScore - 100);
          
          console.log("📝 Score change:", oldScore, "->", newScore);
          
          // 점수 차감
          const updateResult = await env.D1_DB.prepare(
            "UPDATE user_profiles SET score = ? WHERE user_id = ?"
          ).bind(newScore, userId).run();
          
          console.log("📝 Update result:", updateResult);
          
          // 포인트 로그 기록
          const logResult = await env.D1_DB.prepare(
            "INSERT INTO point_logs (user_id, point, reason) VALUES (?, ?, ?)"
          ).bind(userId, -100, "챌린지 중도 포기").run();
          
          console.log("📝 Point log result:", logResult);
        }
      } else {
        console.log("📝 No other members - deleting challenge");
        // 멤버가 없으면 챌린지 삭제
        await env.D1_DB.prepare("DELETE FROM challenge_results WHERE challenge_id = ?")
          .bind(challengeId).run();
        await env.D1_DB.prepare("DELETE FROM challenge_daily_progress WHERE challenge_id = ?")
          .bind(challengeId).run();
        await env.D1_DB.prepare("DELETE FROM challenge_members WHERE challenge_id = ?")
          .bind(challengeId).run();
        await env.D1_DB.prepare("DELETE FROM challenges WHERE challenge_id = ?")
          .bind(challengeId).run();
      }
    } else {
      console.log("📝 Removing member from challenge");
      try {
        await env.D1_DB.prepare(
          "DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?"
        ).bind(challengeId, userId).run();
      } catch (deleteErr) {
        console.log("⚠️ Member delete failed:", deleteErr?.message);
      }

      console.log("📝 Reducing score (100 points) for userId:", userId);
      try {
        // user_profiles 레코드 확인
        let currentProfile = await env.D1_DB.prepare(
          "SELECT score FROM user_profiles WHERE user_id = ?"
        ).bind(userId).first();
        
        console.log("📝 Current profile before insert:", currentProfile);
        
        // user_profiles 레코드가 없으면 생성
        if (!currentProfile) {
          await env.D1_DB.prepare(
            "INSERT INTO user_profiles (user_id, tier, score, points) VALUES (?, 'bronze', 0, 0)"
          ).bind(userId).run();
          
          console.log("📝 Profile created for userId:", userId);
          
          // 다시 조회
          currentProfile = await env.D1_DB.prepare(
            "SELECT score FROM user_profiles WHERE user_id = ?"
          ).bind(userId).first();
        }
        
        const oldScore = currentProfile?.score || 0;
        const newScore = Math.max(0, oldScore - 100);
        
        console.log("📝 Score change:", oldScore, "->", newScore);
        
        // 점수 차감
        const updateResult = await env.D1_DB.prepare(
          "UPDATE user_profiles SET score = ? WHERE user_id = ?"
        ).bind(newScore, userId).run();
        
        console.log("📝 Update result:", updateResult);
        
        // 포인트 로그 기록
        const logResult = await env.D1_DB.prepare(
          "INSERT INTO point_logs (user_id, point, reason) VALUES (?, ?, ?)"
        ).bind(userId, -100, "챌린지 포기").run();
        
        console.log("📝 Point log result:", logResult);
      } catch (scoreErr) {
        console.log("⚠️ Score update failed:", scoreErr?.message);
        console.error("⚠️ Full error:", scoreErr);
      }
    }

    console.log("✅ Success");
    // return updated members list and challenge info
    const pragma = await env.D1_DB.prepare("PRAGMA table_info('challenge_members')").all();
    const hasStatus = (pragma.results || []).some((c: any) => c.name === 'status');
    let members;
    if (hasStatus) {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
    } else {
      members = await env.D1_DB
        .prepare('SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?')
        .bind(challengeId)
        .all();
      members.results = (members.results || []).map((r: any) => ({ ...r, status: 'not_submitted' }));
    }

    // 업데이트된 챌린지 정보 가져오기
    const updatedChallenge = await env.D1_DB.prepare(
      'SELECT * FROM challenges WHERE challenge_id = ?'
    ).bind(challengeId).first();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully left challenge', 
        members: members.results || [],
        challenge: updatedChallenge
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
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
