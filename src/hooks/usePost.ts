import { postService } from "@/services/post-service";
import type { Post, PostResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await postService.getPosts();
      setPosts(postsData.data);
    } catch (err) {
      setError((err as PostResponse).message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, refetch: loadPosts, setError };
};