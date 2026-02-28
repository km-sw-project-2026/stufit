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

    // 챌린지 존재 확인: 먼저 컬럼 유무를 확인해 안전하게 조회합니다.
    const challengePragma = await env.D1_DB.prepare("PRAGMA table_info('challenges')").all();
    const hasIsStartedCol = (challengePragma.results || []).some((c: any) => c.name === 'is_started');

    let challenge: any = null;
    if (hasIsStartedCol) {
      challenge = await env.D1_DB.prepare(
        "SELECT created_by_user_id, is_started, max_members FROM challenges WHERE challenge_id = ?"
      ).bind(challengeId).first();
    } else {
      challenge = await env.D1_DB.prepare(
        "SELECT created_by_user_id, max_members FROM challenges WHERE challenge_id = ?"
      ).bind(challengeId).first();
    }

    console.log("Challenge:", challenge, "hasIsStartedCol:", hasIsStartedCol);

    if (!challenge) {
      console.log("❌ Challenge not found");
      return new Response(
        JSON.stringify({ success: false, message: "Challenge not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isOwner = challenge.created_by_user_id === userId;
    const challengeIsStarted = hasIsStartedCol ? Boolean((challenge as any)?.is_started) : false;
    const maxMembers = Number((challenge as any)?.max_members || 0);
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

        // 시작 여부에 따라 환불 또는 페널티 처리
        // 배팅 환불: challenge_bets 테이블에서 bet_points 조회
        try {
          const betRow = await env.D1_DB.prepare('SELECT bet_points FROM challenge_bets WHERE challenge_id = ?')
            .bind(challengeId).first();
          const betPoints = betRow ? Number((betRow as any).bet_points || 0) : 0;
          if (!challengeIsStarted && betPoints > 0) {
            // 환불 처리: score 필드에 환불
            await env.D1_DB.prepare(
              "INSERT OR IGNORE INTO user_profiles (user_id, profile_image_item_id, profile_border_item_id, profile_background_item_id, tier, score, points) VALUES (?, NULL, NULL, NULL, 'bronze', 0, 0)"
            ).bind(userId).run();
            await env.D1_DB.prepare('UPDATE user_profiles SET score = COALESCE(score,0) + ? WHERE user_id = ?')
              .bind(betPoints, userId).run();
            await env.D1_DB.prepare('INSERT INTO point_logs (user_id, point, reason) VALUES (?, ?, ?)')
              .bind(userId, betPoints, '챌린지 이탈 환불 (배팅)').run();
            console.log(`✅ 방장 환불 완료: +${betPoints} score`);
          } else {
            // 기존 동작 유지: 방장 포인트 차감 (-100P)
            await env.D1_DB.prepare(
              "INSERT OR IGNORE INTO user_profiles (user_id, score, points) VALUES (?, 0, 0)"
            ).bind(userId).run();
            const currentProfile = await env.D1_DB.prepare(
              "SELECT points FROM user_profiles WHERE user_id = ?"
            ).bind(userId).first();
            const currentPoints = currentProfile?.points || 0;
            const newPoints = Math.max(0, currentPoints - 100);
            await env.D1_DB.prepare(
              "UPDATE user_profiles SET points = ? WHERE user_id = ?"
            ).bind(newPoints, userId).run();
            await env.D1_DB.prepare(
              "INSERT INTO point_logs (user_id, point, reason) VALUES (?, ?, ?)"
            ).bind(userId, -100, "챌린지 중도 포기 (방장)").run();
            console.log(`✅ 방장 페널티 처리 완료 (-100 points)`);
          }
        } catch (e) {
          console.error('방장 환불/페널티 처리 중 오류:', e instanceof Error ? e.message : String(e));
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

      // 배팅 정보 조회 (환불 대상인지 확인)
      try {
        const betRow = await env.D1_DB.prepare('SELECT bet_points FROM challenge_bets WHERE challenge_id = ?')
          .bind(challengeId).first();
        const betPoints = betRow ? Number((betRow as any).bet_points || 0) : 0;

        if (!challengeIsStarted && betPoints > 0) {
          // 시작 전 이탈: 환불 처리 (score에 반환)
          await env.D1_DB.prepare(
            "INSERT OR IGNORE INTO user_profiles (user_id, profile_image_item_id, profile_border_item_id, profile_background_item_id, tier, score, points) VALUES (?, NULL, NULL, NULL, 'bronze', 0, 0)"
          ).bind(userId).run();
          await env.D1_DB.prepare('UPDATE user_profiles SET score = COALESCE(score,0) + ? WHERE user_id = ?')
            .bind(betPoints, userId).run();
          await env.D1_DB.prepare('INSERT INTO point_logs (user_id, point, reason) VALUES (?, ?, ?)')
            .bind(userId, betPoints, '챌린지 이탈 환불 (배팅)').run();
          console.log(`✅ 환불 완료: +${betPoints} score`);
        } else {
          // 시작 후 이탈 또는 배팅이 없는 경우 기존 페널티(100 points 차감)
          await env.D1_DB.prepare(
            "INSERT OR IGNORE INTO user_profiles (user_id, score, points) VALUES (?, 0, 0)"
          ).bind(userId).run();
          const currentProfile = await env.D1_DB.prepare(
            "SELECT points FROM user_profiles WHERE user_id = ?"
          ).bind(userId).first();
          const currentPoints = currentProfile?.points || 0;
          const newPoints = Math.max(0, currentPoints - 100);
          await env.D1_DB.prepare(
            "UPDATE user_profiles SET points = ? WHERE user_id = ?"
          ).bind(newPoints, userId).run();
          await env.D1_DB.prepare(
            "INSERT INTO point_logs (user_id, point, reason) VALUES (?, ?, ?)"
          ).bind(userId, -100, "챌린지 포기").run();
          console.log(`✅ 페널티 처리 완료: -100 points`);
        }
      } catch (e) {
        console.error('멤버 환불/페널티 처리 중 오류:', e instanceof Error ? e.message : String(e));
      }

      // 멤버 삭제
      await env.D1_DB.prepare(
        "DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?"
      ).bind(challengeId, userId).run();

      console.log("✅ 멤버 삭제 완료");
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

    // 업데이트된 포인트/score 정보 가져오기
    const updatedProfile = await env.D1_DB.prepare(
      'SELECT points, score FROM user_profiles WHERE user_id = ?'
    ).bind(userId).first();

    console.log(`✅ 최종 응답 준비 - points: ${updatedProfile?.points}, score: ${updatedProfile?.score}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully left challenge', 
        members: members.results || [],
        challenge: updatedChallenge,
        points: updatedProfile?.points || 0,
        score: updatedProfile?.score || 0
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
