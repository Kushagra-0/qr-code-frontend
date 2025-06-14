import "./styles/BlogStyles.css"

import React, { useEffect, useState } from "react";
import { baseUrl } from "../../common/constant";

interface Blog {
  title: string;
  description?: string;
  content: string;
  image?: string;
  createdAt: string;
}

interface BlogDetailsProps {
  slug: string | undefined;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${baseUrl}/blog/${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-[#F5F5F5]/80 rounded-2xl mt-8">
      <h1 className="text-5xl font-extrabold mb-2 text-center justify-center">{blog.title}</h1>
      {blog.image && (
        <img src={blog.image} alt="Cover" className="mb-6 rounded-lg" />
      )}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogDetails;
