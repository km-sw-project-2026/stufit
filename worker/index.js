import * as challengesIndex from '../functions/api/challenges/index';
import * as challengeById from '../functions/api/challenges/[id]';
import * as verify from '../functions/api/challenges/[id]/verify';
import publicChallenges from '../functions/api/challenges/public';
import { verifyToken } from '../functions/api/utils/jwt';

// auth
import * as login from '../functions/api/auth/login';
import * as register from '../functions/api/auth/register';
import * as logout from '../functions/api/auth/logout';

import * as attendance from '../functions/api/attendance';

// posts
import * as posts from '../functions/api/posts';
import * as postById from '../functions/api/post/[[id]]';
import * as postLike from '../functions/api/post/[id]/like';
import * as postComments from '../functions/api/post/[id]/comments';

// comments
import * as commentById from '../functions/api/comment/[id]/index';
import * as commentLike from '../functions/api/comment/[id]/like';

// shop/user
import * as shopPurchase from '../functions/api/shop/purchase';
import * as userPoints from '../functions/api/user/points';
import * as userItems from '../functions/api/user/items';
import * as userStats from '../functions/api/user/stats';
import * as userResolve from '../functions/api/user/resolve';
import * as users from '../functions/api/users/index';

// challenges extra
import * as progress from '../functions/api/challenges/[id]/progress';
import * as complete from '../functions/api/challenges/[id]/complete';
import * as scores from '../functions/api/challenges/[id]/scores';
import * as rewards from '../functions/api/challenges/[id]/rewards';
import * as miniGame from '../functions/api/challenges/[id]/minigame';

import challengeEdit from '../functions/api/challenges/[id]/edit';
import challengeResult from '../functions/api/challenges/[id]/result';
import challengeGiveupQuote from '../functions/api/challenges/[id]/giveup-quote';
import challengeLeave from '../functions/api/challenges/[id]/leave';
import challengeJoin from '../functions/api/challenges/[id]/join';

export default {
  /**
   * @param {Request} request
   * @param {any} env
   */
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const { pathname } = url;
      console.log(`[Worker] ${request.method} ${pathname}`);
      // header getter that tolerates header name case/format variations
      const getHeader = (name) => request.headers.get(name) ?? request.headers.get(name.toLowerCase());

      // [DEBUG] Log all requests to ensure we are seeing traffic
      console.log(`[Worker] Incoming: ${request.method} ${pathname}`);

      // ===== 먼저 API가 아닌 경로는 정적 파일로 제공 =====
      if (!pathname.startsWith('/api/')) {
        console.log('[Worker] Non-API path, serving static assets');
        if (env.ASSETS) {
          try {
            // 정적 자산 요청 시도
            const assetResponse = await env.ASSETS.fetch(request);
            
            // 자산이 존재하면 반환
            if (assetResponse.status !== 404) {
              return assetResponse;
            }
            
            // 자산이 없으면 index.html 반환 (SPA 라우팅)
            const indexUrl = new URL(request.url);
            indexUrl.pathname = '/index.html';
            const indexRequest = new Request(indexUrl, request);
            return env.ASSETS.fetch(indexRequest);
          } catch (assetError) {
            console.error('[Worker] 정적 자산 제공 오류:', assetError);
          }
        }
        return new Response('Not Found', { status: 404 });
      }

      if (pathname.startsWith('/api/attendance')) {
        console.log('[Worker] Matched /api/attendance');
        
        if (request.method === 'OPTIONS') {
           return new Response(null, {
             status: 204,
             headers: {
                 'Access-Control-Allow-Origin': '*',
                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                 'Access-Control-Allow-Headers': 'Content-Type, X-Username, Authorization',
             }
           });
        }
        
        if (request.method === 'GET') {
          console.log('[Worker] Routing to attendance.onRequestGet');
          const response = await attendance.onRequestGet({ request, env });
          
          // Ensure response has CORS headers
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Access-Control-Allow-Origin', '*');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }
        
        if (request.method === 'POST') {
          console.log('[Worker] Routing to attendance.onRequestPost');
          const response = await attendance.onRequestPost({ request, env });
          
          // Ensure response has CORS headers
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Access-Control-Allow-Origin', '*');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }
      }
      
      // 빠른 공용 상세 조회 처리: X-Username 없이도 /api/challenges/:id GET 반환
      // Only match exact /api/challenges/:id (optional trailing slash), not subpaths like /edit
      const publicDetailMatch = pathname.match(/^\/api\/challenges\/(\d+)\/?$/);
      if (publicDetailMatch && request.method === 'GET') {
        return challengeById.default(request, {
          id: Number(publicDetailMatch[1]),
          env,
          userId: undefined
        });
      }

      // Allow unauthenticated code lookup: GET /api/challenges?code=... should work without X-Username
      if (pathname === '/api/challenges' && request.method === 'GET') {
        try {
          const u = new URL(request.url);
          if (u.searchParams.has('code')) {
            return challengesIndex.default(request, { env, userId: undefined });
          }
        } catch (e) {
          // ignore URL parse errors and continue
        }
      }
      
      /* =========================
         0️⃣ 인증 필요 없는 API
      ========================= */

      if (pathname === '/api/auth/register') {
        return register.onRequestPost({ request, env });
      }

      if (pathname === '/api/auth/login') {
        return login.onRequestPost({ request, env });
      }

      if (pathname === '/api/auth/logout') {
        return logout.onRequestPost({ request, env });
      }

      // Public Challenges API (인증 불필요)
      if (pathname === '/api/challenges/public') {
        return publicChallenges(request, { env });
      }

      // Posts API (인증 불필요)
      if (pathname === '/api/posts' && request.method === 'GET') {
        return posts.onRequestGet({ env });
      }

      // Public users list (unauthenticated)
      if (pathname === '/api/users' && request.method === 'GET') {
        try {
          const response = await users.onRequestGet({ request, env });
          const newHeaders = new Headers(response.headers || {});
          newHeaders.set('Access-Control-Allow-Origin', '*');
          return new Response(response.body, { status: response.status, headers: newHeaders });
        } catch (err) {
          console.error('[Worker] /api/users handler error', err);
          return new Response(JSON.stringify({ success: false, error: 'internal' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
      }

      // Comments for a post (public GET)
      const publicPostCommentsMatch = pathname.match(/^\/api\/post\/(\d+)\/comments$/);
      if (publicPostCommentsMatch && request.method === 'GET') {
        return postComments.onRequestGet({ env, params: { id: publicPostCommentsMatch[1] } });
      }

      const postMatch = pathname.match(/^\/api\/post\/(\d+)$/);
      if (postMatch && request.method === 'GET') {
        return postById.onRequestGet({ env, params: { id: postMatch[1] } });
      }

      const commentListMatch = pathname.match(/^\/api\/post\/(\d+)\/comments$/);
      if (commentListMatch && request.method === 'GET') {
        let optionalUserId;
        let headerUsername = getHeader('X-Username');

        if (headerUsername) {
          // URL 디코딩
          try {
            headerUsername = decodeURIComponent(headerUsername);
          } catch (e) {}

          const userRow = await env.D1_DB
            .prepare('SELECT user_id FROM users WHERE username = ?')
            .bind(headerUsername)
            .first();

          if (userRow?.user_id) {
            optionalUserId = userRow.user_id;
          }
        }

        return postComments.onRequestGet({ env, params: { id: commentListMatch[1] }, userId: optionalUserId });
      }

      /* =========================
         1️⃣ 사용자 인증 (username 기반)
      ========================= */

      const resolveUserIdFallback = async () => {
        const fromHeader = Number(getHeader('X-User-Id') || getHeader('X-UserId'));
        if (!Number.isNaN(fromHeader) && fromHeader > 0) {
          return fromHeader;
        }

        const fromQuery = Number(url.searchParams.get('userId'));
        if (!Number.isNaN(fromQuery) && fromQuery > 0) {
          return fromQuery;
        }

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
          try {
            const body = await request.clone().json();
            const fromBody = Number(body?.userId);
            if (!Number.isNaN(fromBody) && fromBody > 0) {
              return fromBody;
            }
          } catch {
            // ignore invalid/non-JSON body
          }
        }

        return null;
      };

      // username으로 userId 조회 (간단한 인증)
      let username = getHeader('X-Username');
      let userId;

      if (!username) {
        // Allow unauthenticated GET for challenge detail (show members public view)
        const detailMatch = pathname.match(/^\/api\/challenges\/(\d+)(?:\/(.+))?$/);
        if (detailMatch && !detailMatch[2] && request.method === 'GET') {
          return challengeById.default(request, {
            id: Number(detailMatch[1]),
            env,
            userId: undefined
          });
        }

        const fallbackUserId = await resolveUserIdFallback();
        if (fallbackUserId && env?.D1_DB) {
          const userRow = await env.D1_DB
            .prepare('SELECT user_id FROM users WHERE user_id = ?')
            .bind(fallbackUserId)
            .first();

          if (userRow?.user_id) {
            userId = userRow.user_id;
            console.log('✅ Fallback userId authenticated:', userId);
          }
        }

        if (userId) {
          // continue with authenticated routing below
        } else {
          console.log('❌ No XUsername header - index.js:136');
          return new Response(JSON.stringify({ message: '로그인이 필요합니다.' }), { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // URL 디코딩 (한글 이름 지원)
      if (!userId) {
        const originalUsername = username;
        try {
          username = decodeURIComponent(username);
          console.log('✅ Decoded username: - index.js:147', originalUsername, '->', username);
        } catch (e) {
          console.log('⚠️ Failed to decode username: - index.js:149', originalUsername, e);
          // 디코딩 실패 시 원본 사용
        }

        console.log('🔍 Looking up user: - index.js:153', username);
        const userRow = await env.D1_DB
          .prepare('SELECT user_id FROM users WHERE username = ?')
          .bind(username)
          .first();

        if (!userRow) {
          console.log('❌ User not found: - index.js:160', username);
          return new Response(JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }), { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        userId = userRow.user_id;
        console.log('✅ User authenticated: - index.js:168', username, 'userId:', userId);
      }

      if (pathname === '/api/user/points' || pathname.startsWith('/api/user/points/')) {
        if (request.method === 'GET') {
          return userPoints.onRequestGet({ request, env, userId });
        }

        if (request.method === 'POST') {
          return userPoints.onRequestPost({ request, env, userId });
        }

        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (pathname === '/api/user/items' || pathname.startsWith('/api/user/items/')) {
        if (request.method === 'GET') {
          return userItems.onRequestGet({ request, env, userId });
        }

        if (request.method === 'PUT') {
          return userItems.onRequestPut({ request, env, userId });
        }

        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (pathname === '/api/user/stats' || pathname.startsWith('/api/user/stats')) {
        if (request.method === 'GET') {
          return userStats.onRequestGet({ request, env, userId });
        }

        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (pathname === '/api/shop/purchase' || pathname.startsWith('/api/shop/purchase/')) {
        return shopPurchase.onRequestPost({ request, env, userId });
      }

      if (pathname === '/api/posts' && request.method === 'POST') {
        return posts.onRequestPost({ request, env, userId });
      }

      // Post comments (authenticated POST)
      const postCommentsMatch = pathname.match(/^\/api\/post\/(\d+)\/comments$/);
      if (postCommentsMatch && request.method === 'POST') {
        return postComments.onRequestPost({ request, env, params: { id: postCommentsMatch[1] }, userId });
      }

      // Comment operations (like / edit / delete)
      const commentMatch = pathname.match(/^\/api\/comment\/(\d+)(?:\/(.+))?$/);
      if (commentMatch) {
        const cid = commentMatch[1];
        const action = commentMatch[2];

        if (action === 'like' && request.method === 'POST') {
          return commentLike.onRequestPost({ env, params: { id: cid }, userId });
        }

        if (!action && request.method === 'PATCH') {
          return commentById.onRequestPatch({ request, env, params: { id: cid }, userId });
        }

        if (!action && request.method === 'DELETE') {
          return commentById.onRequestDelete({ env, params: { id: cid }, userId });
        }
      }

      const authPostMatch = pathname.match(/^\/api\/post\/(\d+)$/);
      if (authPostMatch && (request.method === 'PUT' || request.method === 'PATCH' || request.method === 'DELETE')) {
         return postById.default(request, { env, params: { id: authPostMatch[1] }, userId });
      }

      const postLikeMatch = pathname.match(/^\/api\/post\/(\d+)\/like$/);
      if (postLikeMatch && request.method === 'POST') {
        return postLike.onRequestPost({ env, params: { id: postLikeMatch[1] }, userId });
      }

      if (pathname === '/api/user/resolve' || pathname.startsWith('/api/user/resolve/')) {
        return userResolve.onRequestGet({ request, env });
      }

      /* =========================
         2️⃣ 챌린지 목록
      ========================= */

      if (pathname === '/api/challenges') {
        return challengesIndex.default(request, { env, userId });
      }

      /* =========================
         3️⃣ /api/challenges/:id 하위 기능
      ========================= */

      const match = pathname.match(/^\/api\/challenges\/(\d+)(?:\/(.+))?$/);
      if (match) {
        const id = match[1];
        const action = match[2]; // undefined | progress | verify | edit ...

        if (!action) {
          // 상세 조회 / 삭제
          return challengeById.default(request, {
            id: Number(id),
            env,
            userId
          });
        }

        switch (action) {
          case 'verify':
            return verify.default(request, {
              id: Number(id),
              env,
              userId
            });

          case 'progress':
            return progress.onRequestGet({
              request,
              env,
              params: { id },
              userId
            });

          case 'complete':
            return complete.onRequestPatch({
              request,
              env,
              params: { id },
              userId
            });

          case 'scores':
            return scores.onRequest({
              request,
              env,
              params: { id },
              userId
            });

          case 'rewards':
            return rewards.onRequestPost({
              request,
              env,
              params: { id },
              userId
            });

          case 'edit':
            return challengeEdit(request, {
              env,
              params: { id },
              userId
            });

          case 'result':
            return challengeResult(request, {
              env,
              params: { id },
              userId
            });

          case 'giveup-quote':
            return challengeGiveupQuote(request, {
              env,
              params: { id },
              userId
            });

          case 'leave':
            return challengeLeave(request, {
              env,
              params: { id },
              userId
            });

          case 'join':
            return challengeJoin(request, { env, params: { id }, userId });

          case 'minigame':
            if (request.method === 'GET') {
              return miniGame.onRequestGet({ request, env, params: { id }, userId });
            }
            if (request.method === 'POST') {
              return miniGame.onRequestPost({ request, env, params: { id }, userId });
            }
            if (request.method === 'PATCH') {
              return miniGame.onRequestPatch({ request, env, params: { id }, userId });
            }
            return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });

          default:
            return new Response('Not Found', { status: 404 });
        }
      }

      // Posts authenticated actions (edit / delete)
      const postMatchAuth = pathname.match(/^\/api\/post\/(\d+)$/);
      if (postMatchAuth) {
        return postById.default(request, { env, params: { id: postMatchAuth[1] }, userId });
      }

      // ===== API 경로가 여기까지 오면 404 =====
      return new Response('API Not Found', { status: 404, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error("❌ WORKER ERROR: - index.js:323", err?.message || String(err));
      return new Response(
        JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
