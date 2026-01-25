import * as posts from "../functions/api/posts";
import * as postById from "../functions/api/post/[[id]]";

export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === ("/api/posts")) {
      return posts.onRequestGet();
    } else if (url.pathname.startsWith("/api/post/")) {
      const id = url.pathname.replace(/^\/api\/post\/+/, '');
      const context = { params: { id } };
      return postById.onRequestGet(context);
    }

		return new Response(null, { status: 404 });
  },
}
