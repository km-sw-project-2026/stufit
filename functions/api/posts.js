// -------------------원래 쓰던거

// export async function onRequestGet({ env, userId }) {
//     try {
//         if (!env?.D1_DB) {
//             return new Response(
//                 JSON.stringify({ message: '서버 설정 오류입니다.' }),
//                 { status: 500, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         const likerId = userId || -1;
//         const result = await env.D1_DB
//             .prepare(
//                 `SELECT p.*, u.username,
//                         (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count,
//                         (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.post_id) AS like_count,
//                         CASE WHEN pl.user_id IS NULL THEN 0 ELSE 1 END AS user_liked
//                  FROM posts p
//                  LEFT JOIN users u ON p.user_id = u.user_id
//                  LEFT JOIN post_likes pl ON pl.post_id = p.post_id AND pl.user_id = ?
//                  WHERE p.deleted_at IS NULL
//                  ORDER BY p.created_at DESC`
//             )
//             .bind(likerId)
//             .all();

//         const posts = (result.results || []).map(post => ({
//             ...post,
//             id: post.post_id, // frontend expects 'id'
//             date: new Date(post.created_at).toLocaleString('ko-KR')
//         }));

//         return new Response(
//             JSON.stringify({ success: true, data: posts }),
//             { status: 200, headers: { "Content-Type": "application/json" } }
//         );
//     } catch (err) {
//         console.error("❌ POSTS ERROR:", err?.message);
//         return new Response(
//             JSON.stringify({ success: false, message: '게시글을 불러올 수 없습니다.' }),
//             { status: 500, headers: { "Content-Type": "application/json" } }
//         );
//     }
// }

// export async function onRequestPost({ request, env, userId }) {
//     try {

//         if (!env?.D1_DB) {
//             return new Response(
//                 JSON.stringify({ message: '서버 설정 오류입니다.' }),
//                 { status: 500, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         if (!userId) {
//             return new Response(
//                 JSON.stringify({ success: false, message: '로그인이 필요합니다.' }),
//                 { status: 401, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         const body = await request.json().catch(() => null) || {};
//         const title = typeof body.title === 'string' ? body.title.trim() : '';
//         const content = typeof body.content === 'string' ? body.content.trim() : '';
//         const category = typeof body.category === 'string' ? body.category.trim() : 'data';

//         if (!title || !content) {
//             return new Response(
//                 JSON.stringify({ success: false, message: '제목과 내용을 입력해주세요.' }),
//                 { status: 400, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         const now = new Date().toISOString();
//         const insertResult = await env.D1_DB
//             .prepare('INSERT INTO posts (user_id, title, content, category, created_at) VALUES (?, ?, ?, ?, ?)')
//             .bind(userId, title, content, category, now)
//             .run();

//         const postId = insertResult.meta?.last_row_id || insertResult.lastInsertRowid;
//         if (!postId) {
//             throw new Error('게시글 ID를 가져올 수 없습니다.');
//         }

//         const created = await env.D1_DB
//             .prepare('SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.user_id WHERE p.post_id = ?')
//             .bind(postId)
//             .first();

//         return new Response(
//             JSON.stringify({ success: true, data: created }),
//             { status: 201, headers: { "Content-Type": "application/json" } }
//         );
//     } catch (err) {
//         console.error('❌ POSTS CREATE ERROR:', err?.message);
//         return new Response(
//             JSON.stringify({ success: false, message: '게시글 생성에 실패했습니다.' }),
//             { status: 500, headers: { "Content-Type": "application/json" } }
//         );
//     }
// }


// --------------------------------------밑에는 수정 코드


export async function onRequestGet({ env, userId }) {
    try {
        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const likerId = userId || -1;
        // u.username을 가져오기 위해 테이블 존재 여부를 고려하여 LEFT JOIN 합니다.
        // 만약 에러가 계속된다면 u.username 부분을 제거하고 테스트해야 합니다.
        const result = await env.D1_DB
            .prepare(
                `SELECT p.*, 
                        (SELECT username FROM user_profiles WHERE user_id = p.user_id) AS username,
                        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count,
                        (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.post_id) AS like_count,
                        CASE WHEN pl.user_id IS NULL THEN 0 ELSE 1 END AS user_liked
                 FROM posts p
                 LEFT JOIN post_likes pl ON pl.post_id = p.post_id AND pl.user_id = ?
                 WHERE p.deleted_at IS NULL
                 ORDER BY p.created_at DESC`
            )
            .bind(likerId)
            .all();

        const posts = (result.results || []).map(post => ({
            ...post,
            id: post.post_id,
            date: new Date(post.created_at).toLocaleString('ko-KR')
        }));

        return new Response(
            JSON.stringify({ success: true, data: posts }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("❌ POSTS ERROR:", err?.message);
        return new Response(
            JSON.stringify({ success: false, message: '게시글을 불러올 수 없습니다.' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function onRequestPost({ request, env, userId }) {
    try {
        if (!env?.D1_DB) {
            return new Response(
                JSON.stringify({ message: '서버 설정 오류입니다.' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: '로그인이 필요합니다.' }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await request.json().catch(() => null) || {};
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const content = typeof body.content === 'string' ? body.content.trim() : '';
        const category = typeof body.category === 'string' ? body.category.trim() : 'data';

        if (!title || !content) {
            return new Response(
                JSON.stringify({ success: false, message: '제목과 내용을 입력해주세요.' }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const now = new Date().toISOString();
        // 게시글 삽입 로직 (가장 핵심적인 부분입니다)
        const insertResult = await env.D1_DB
            .prepare('INSERT INTO posts (user_id, title, content, category, created_at) VALUES (?, ?, ?, ?, ?)')
            .bind(userId, title, content, category, now)
            .run();

        const postId = insertResult.meta?.last_row_id || insertResult.lastInsertRowid;
        
        if (!postId) {
            throw new Error('게시글 ID 생성 실패');
        }

        // 생성된 글 정보를 가져올 때 서브쿼리를 사용하여 테이블 충돌을 방지합니다.
        const created = await env.D1_DB
            .prepare(`
                SELECT p.*, 
                (SELECT username FROM user_profiles WHERE user_id = p.user_id) as username 
                FROM posts p 
                WHERE p.post_id = ?
            `)
            .bind(postId)
            .first();

        return new Response(
            JSON.stringify({ success: true, data: created }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error('❌ POSTS CREATE ERROR:', err?.message);
        return new Response(
            JSON.stringify({ success: false, message: '게시글 생성에 실패했습니다.' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}