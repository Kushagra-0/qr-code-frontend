import "./styles/ScrollBar.css"

import { useEffect, useState } from "react";
import { baseUrl } from "../../../common/constant";
import { useNavigate } from "react-router-dom";
import { Search } from "react-feather";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
}

const BlogTab = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/blog`);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };


  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      const res = await fetch(`${baseUrl}/blog/${blogToDelete.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs(prev => prev.filter(b => b.slug !== blogToDelete.slug));
      setShowConfirmModal(false);
      setBlogToDelete(null);
      setConfirmInput("");
    } catch (err) {
      alert("Error deleting blog.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-2 py-1">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 text-lg bg-transparent focus:outline-none"
          />
          <Search size={20} className="text-gray-500 mr-2" />
        </div>
        <button
          onClick={() => navigate("/blog/create/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-semibold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer"
        >
          CREATE NEW
        </button>
      </div>

      {/* Scrollable blog list */}
      <div className="overflow-y-auto pr-3 space-y-4 grow mt-2 custom-scrollbar">
        {filteredBlogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog.slug}
              className="bg-white rounded-xl shadow px-6 py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="text-sm text-gray-600">
                  {blog.description || "No description"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => window.open(`/blog/${blog.slug}`, "_blank")}
                  className="text-green-600 font-semibold px-8 py-4 border border-green-600 cursor-pointer rounded-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-shadow"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/blog/edit/${blog.slug}`)}
                  className="text-yellow-600 font-semibold px-8 py-4 border border-yellow-500 cursor-pointer rounded-lg hover:shadow-[0_0_15px_rgba(234,179,8,0.6)] transition-shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setBlogToDelete(blog);
                    setShowConfirmModal(true);
                    setConfirmInput("");
                  }}
                  className="text-red-500 font-semibold px-8 py-4 border border-red-500 cursor-pointer rounded-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showConfirmModal && blogToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-2 text-red-600">Confirm Deletion</h2>
            <p className="mb-4">
              To confirm deletion of <strong>{blogToDelete.title}</strong>, please type the blog title below:
            </p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
              placeholder="Enter blog title"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setBlogToDelete(null);
                  setConfirmInput("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                disabled={confirmInput !== blogToDelete.title}
                onClick={confirmDeleteBlog}
                className={`px-4 py-2 rounded-lg text-white ${confirmInput === blogToDelete.title
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
                  }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogTab;
