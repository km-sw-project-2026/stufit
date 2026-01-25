// import posts from './data'

// export function onRequestGet(context){
//     const id = context.params.id

//     if (!id) {
//         return new Response('Not found',{status:404})
//     }
//     const post = posts.find(post => post.id === Number(id))

//      if (!post) {
//         return new Response('Not found',{status:404})
//     }
//     return Response.json(post)
// }

export async function onRequestGet({ env, params }) {
    const { id } = params;

    // D1 데이터베이스에서 'posts' 테이블에서 해당 ID의 게시물 조회
    const result = await env.D1_DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();

    if (!result) {
        return new Response('Post not found', { status: 404 });
    }

    // 결과를 JSON 형식으로 반환
    return Response.json(result);
}
