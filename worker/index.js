// import * as posts from "../functions/api/posts";
// import * as postById from "../functions/api/post/[[id]]";

// export default {
//   async fetch(request, env) {
//     const url = new URL(request.url);

//     if (url.pathname === "/api/posts") {
//       // /api/posts 경로로 요청이 들어오면 posts.onRequestGet 호출
//       return posts.onRequestGet({ env });
//     } else if (url.pathname.startsWith("/api/post/")) {
//       // /api/post/:id 경로로 요청이 들어오면 ID 추출하여 postById.onRequestGet 호출
//       const id = url.pathname.replace(/^\/api\/post\/+/, '');
//       const context = { params: { id } };
//       return postById.onRequestGet({ env, params: context.params });
//     }

//     // 위 두 조건에 맞지 않으면 404 응답
//     return new Response(null, { status: 404 });
//   }
// }
// worker/index.js
// worker/index.js
import * as challengesIndex from '../functions/api/challenges/index.ts';
import * as challengeById from '../functions/api/challenges/[id].ts';
import * as verify from '../functions/api/challenges/[id]/verify.ts';
import { verifyToken } from '../functions/api/utils/jwt.ts';

export default {
  async fetch(request, env) {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer {token}
      const user = await verifyToken(token);
      if (!user) return new Response('Unauthorized', { status: 401 });
      const userId = user.userId;

      const url = new URL(request.url);
      const { pathname } = url;

      if (pathname === '/api/challenges') {
        return challengesIndex.default(request, { env, userId });
      }

      if (/^\/api\/challenges\/\d+\/verify$/.test(pathname)) {
        const id = Number(pathname.split('/')[3]);
        if (Number.isNaN(id)) return new Response('Invalid challengeId', { status: 400 });
        return verify.default(request, { id, env, userId });
      }

      if (/^\/api\/challenges\/\d+$/.test(pathname)) {
        const id = Number(pathname.split('/')[3]);
        if (Number.isNaN(id)) return new Response('Invalid challengeId', { status: 400 });
        return challengeById.default(request, { id, env, userId });
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      return new Response('Server Error', { status: 500 });
    }
  }
};
