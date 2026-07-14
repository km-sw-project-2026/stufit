export default async function onRequestPost(
  request: Request,
  { env, params, userId }: any,
) {
  try {
    if (!env?.D1_DB) {
      return Response.json(
        { success: false, message: "데이터베이스 연결 오류" },
        { status: 500 },
      );
    }

    if (!userId) {
      return Response.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const id = Number(params.id);
    if (Number.isNaN(id))
      return Response.json(
        { success: false, message: "Invalid challenge id" },
        { status: 400 },
      );

    const hasColumn = async (tableName: string, columnName: string) => {
      const pragma = await env.D1_DB.prepare(
        `PRAGMA table_info('${tableName}')`,
      ).all();
      return (pragma.results || []).some((c: any) => c.name === columnName);
    };

    const hasBetPointsColumn = await hasColumn("challenges", "bet_points");

    const challenge = await env.D1_DB.prepare(
      hasBetPointsColumn
        ? "SELECT challenge_id, max_members, deleted_at, bet_points FROM challenges WHERE challenge_id = ?"
        : "SELECT challenge_id, max_members, deleted_at FROM challenges WHERE challenge_id = ?",
    )
      .bind(id)
      .first();

    if (!challenge || (challenge as any).deleted_at) {
      return Response.json(
        { success: false, message: "존재하지 않는 챌린지입니다." },
        { status: 404 },
      );
    }

    const maxMembers = Number((challenge as any).max_members || 0);
    let challengeBetPoints = hasBetPointsColumn
      ? Number((challenge as any).bet_points || 0)
      : 0;
    if (!hasBetPointsColumn) {
      try {
        await env.D1_DB.prepare(
          `CREATE TABLE IF NOT EXISTS challenge_bets (
          challenge_id INTEGER PRIMARY KEY,
          bet_points INTEGER NOT NULL
        )`,
        ).run();
        const betRow = await env.D1_DB.prepare(
          "SELECT bet_points FROM challenge_bets WHERE challenge_id = ?",
        )
          .bind(id)
          .first();
        challengeBetPoints = Number((betRow as any)?.bet_points || 0);
      } catch (err) {
        console.warn("challenge_bets 조회 실패:", err);
      }
    }
    if (!maxMembers || maxMembers < 1) {
      return Response.json(
        { success: false, message: "챌린지 정원 정보가 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const hasIsStartedColumn = (() => {
      // keep as a lazy promise for reuse below
      let cache: Promise<boolean> | null = null;
      return () => {
        if (!cache) {
          cache = env.D1_DB.prepare("PRAGMA table_info('challenges')")
            .all()
            .then((r: any) =>
              (r.results || []).some((c: any) => c.name === "is_started"),
            );
        }
        return cache;
      };
    })();

    await env.D1_DB.prepare(
      `CREATE TABLE IF NOT EXISTS challenge_started_flags (
      challenge_id INTEGER PRIMARY KEY,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    ).run();

    // 이미 참가했는지 확인
    const exists = await env.D1_DB.prepare(
      "SELECT 1 FROM challenge_members WHERE challenge_id = ? AND user_id = ?",
    )
      .bind(id, userId)
      .first();

    if (exists) {
      // 반환시 현재 멤버 목록도 함께 반환
      // members 쿼리: 일부 DB에는 cm.status 컬럼이 없을 수 있어 PRAGMA로 확인
      const cols = await env.D1_DB.prepare(
        "PRAGMA table_info('challenge_members')",
      ).all();
      const hasStatus =
        Array.isArray(cols.results) &&
        cols.results.some((c: any) => c.name === "status");
      const membersQuery = hasStatus
        ? "SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?"
        : "SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?";
      const members = await env.D1_DB.prepare(membersQuery).bind(id).all();
      return Response.json({
        success: true,
        message: "이미 참가중입니다.",
        members: members.results || [],
      });
    }

    const memberCountBefore = await env.D1_DB.prepare(
      "SELECT COUNT(*) AS count FROM challenge_members WHERE challenge_id = ?",
    )
      .bind(id)
      .first();
    const currentMembers = Number((memberCountBefore as any)?.count || 0);

    if (currentMembers >= maxMembers) {
      return Response.json(
        { success: false, message: "정원이 가득 차 참가할 수 없습니다." },
        { status: 409 },
      );
    }

    if (challengeBetPoints > 0) {
      await env.D1_DB.prepare(
        "INSERT OR IGNORE INTO user_profiles (user_id, tier, score, points) VALUES (?, 'bronze', 0, 0)",
      )
        .bind(userId)
        .run();

      const profile = await env.D1_DB.prepare(
        "SELECT points, score FROM user_profiles WHERE user_id = ?",
      )
        .bind(userId)
        .first();

      const currentScore = Number((profile as any)?.score || 0);
      if (currentScore < challengeBetPoints) {
        return Response.json(
          { success: false, message: "score가 부족합니다." },
          { status: 400 },
        );
      }
    }

    // 참가자 추가
    await env.D1_DB.prepare(
      "INSERT INTO challenge_members (challenge_id, user_id, joined_at) VALUES (?, ?, datetime('now'))",
    )
      .bind(id, userId)
      .run();

    if (challengeBetPoints > 0) {
      try {
        const pointLogInfo = await env.D1_DB.prepare(
          "PRAGMA table_info('point_logs')",
        ).all();
        const pointLogColumns = Array.isArray(pointLogInfo?.results)
          ? pointLogInfo.results
          : [];
        const pointLogColumn = pointLogColumns.some(
          (col: any) => col.name === "point",
        )
          ? "point"
          : pointLogColumns.some((col: any) => col.name === "points")
            ? "points"
            : null;

        const profile = await env.D1_DB.prepare(
          "SELECT score FROM user_profiles WHERE user_id = ?",
        )
          .bind(userId)
          .first();
        const currentScore = Number((profile as any)?.score || 0);

        if (currentScore >= challengeBetPoints) {
          await env.D1_DB.prepare(
            "UPDATE user_profiles SET score = score - ? WHERE user_id = ?",
          )
            .bind(challengeBetPoints, userId)
            .run();

          if (pointLogColumn) {
            await env.D1_DB.prepare(
              `INSERT INTO point_logs (user_id, ${pointLogColumn}, reason, created_at) VALUES (?, ?, ?, ?)`,
            )
              .bind(
                userId,
                -challengeBetPoints,
                `challenge_bet:${id}:join`,
                new Date().toISOString(),
              )
              .run();
          }
        } else {
          throw new Error("INSUFFICIENT_BALANCE");
        }
      } catch (betErr: any) {
        try {
          await env.D1_DB.prepare(
            "DELETE FROM challenge_members WHERE challenge_id = ? AND user_id = ?",
          )
            .bind(id, userId)
            .run();
        } catch (rollbackErr) {
          console.error("베팅 포인트 차감 롤백 실패:", rollbackErr);
        }
        if ((betErr?.message || "").includes("INSUFFICIENT_BALANCE")) {
          return Response.json(
            { success: false, message: "베팅 포인트/점수가 부족합니다." },
            { status: 400 },
          );
        }
        return Response.json(
          { success: false, message: "베팅 포인트 차감에 실패했습니다." },
          { status: 500 },
        );
      }
    }

    const memberCountAfter = await env.D1_DB.prepare(
      "SELECT COUNT(*) AS count FROM challenge_members WHERE challenge_id = ?",
    )
      .bind(id)
      .first();
    const joinedMembers = Number((memberCountAfter as any)?.count || 0);

    if (await hasIsStartedColumn()) {
      if (joinedMembers >= maxMembers) {
        await env.D1_DB.prepare(
          "UPDATE challenges SET is_started = 1 WHERE challenge_id = ?",
        )
          .bind(id)
          .run();
      }
    } else if (joinedMembers >= maxMembers) {
      await env.D1_DB.prepare(
        "INSERT OR REPLACE INTO challenge_started_flags (challenge_id, started_at) VALUES (?, datetime('now'))",
      )
        .bind(id)
        .run();
    }

    // 멤버 목록 조회 (status 컬럼 유무에 따라 쿼리 조정)
    const cols2 = await env.D1_DB.prepare(
      "PRAGMA table_info('challenge_members')",
    ).all();
    const hasStatus2 =
      Array.isArray(cols2.results) &&
      cols2.results.some((c: any) => c.name === "status");
    const membersQuery2 = hasStatus2
      ? "SELECT u.user_id, u.username, cm.status FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?"
      : "SELECT u.user_id, u.username FROM challenge_members cm JOIN users u ON cm.user_id = u.user_id WHERE cm.challenge_id = ?";
    const members = await env.D1_DB.prepare(membersQuery2).bind(id).all();

    const startedNow = joinedMembers >= maxMembers;
    return Response.json(
      {
        success: true,
        message: startedNow
          ? "참가 완료! 정원이 채워져 챌린지가 시작되었습니다."
          : "참가 완료",
        members: members.results || [],
        started: startedNow,
        memberCount: joinedMembers,
        maxMembers,
      },
      { status: 201 },
    );
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, message: "참가 처리 실패", error: message },
      { status: 500 },
    );
  }
}
