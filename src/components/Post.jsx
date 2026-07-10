import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Post = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const resp = await fetch(`/api/post/${id}`);
        if (!resp.ok) {
          console.error("Failed to fetch post", resp.status);
          setPost(null);
          return;
        }
        const postResp = await resp.json();
        setPost(postResp);
      } catch (err) {
        console.error("Error fetching post", err);
        setPost(null);
      }
    };

    getPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <em>Published {new Date(post.created_at).toLocaleString()}</em>
      </p>
      <p>
        <Link to="/">Go back</Link>
      </p>
    </div>
  );
};

export default Post;
