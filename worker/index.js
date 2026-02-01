import * as challengesIndex from '../functions/api/challenges/index';
import * as challengeById from '../functions/api/challenges/[id]';
import * as verify from '../functions/api/challenges/[id]/verify';
import { verifyToken } from '../functions/api/utils/jwt';

// auth
import * as login from '../functions/api/auth/login';
import * as register from '../functions/api/auth/register';

// posts
import * as posts from '../functions/api/posts';
import * as postById from '../functions/api/post/[[id]]';

// challenges extra
import * as progress from '../functions/api/challenges/[id]/progress';
import * as complete from '../functions/api/challenges/[id]/complete';
import * as scores from '../functions/api/challenges/[id]/scores';

import challengeEdit from '../functions/api/challenges/[id]/edit';
import challengeResult from '../functions/api/challenges/[id]/result';
import challengeGiveupQuote from '../functions/api/challenges/[id]/giveup-quote';
import challengeLeave from '../functions/api/challenges/[id]/leave';

export default {
  /**
   * @param {Request} request
   * @param {any} env
   */
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const { pathname } = url;

      // Bypass worker for non-API routes so static assets (favicon, images, etc.)
      // are served by the dev server/origin and don't get routed through
      // the API authentication logic below.
      if (!pathname.startsWith('/api')) {
        return fetch(request);
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

      // Posts API (인증 불필요)
      if (pathname === '/api/posts') {
        return posts.onRequestGet({ env });
      }

      const postMatch = pathname.match(/^\/api\/post\/(\d+)$/);
      if (postMatch) {
        return postById.onRequestGet({ env, params: { id: postMatch[1] } });
      }

      /* =========================
         1️⃣ 토큰 검증 (이 아래는 인증 필수)
      ========================= */

      const token = request.headers
        .get('Authorization')
        ?.replace('Bearer ', '');

      const user = await verifyToken(token);
      if (!user) {
        return new Response('Unauthorized', { status: 401 });
      }
      const userId = user.userId;

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

          default:
            return new Response('Not Found', { status: 404 });
        }
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      console.error(err);
      return new Response('Server Error', { status: 500 });
    }
  }
};
