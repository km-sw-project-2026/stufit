import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Post = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    let cancelled = false;
    const getPost = async () => {
      setLoading(true);
      setError(false);
      try {
        const resp = await fetch(`/api/post/${id}`);
        if (!resp.ok) {
          if (!cancelled) {
            setError(true);
            setPost(null);
          }
          return;
        }
        const postResp = await resp.json();
        if (!cancelled) setPost(postResp);
      } catch (err) {
        if (!cancelled) {
          setError(true);
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getPost();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--color-text-secondary)" }}>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: "var(--space-10)", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
          게시글을 불러올 수 없습니다.
        </p>
        <Link
          to="/"
          style={{
            color: "var(--color-primary)",
            textDecoration: "underline",
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

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
