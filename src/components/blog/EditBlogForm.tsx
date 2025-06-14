import "./styles/BlogStyles.css"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateBlogEditor from "./CreateBlogEditor";
import { baseUrl } from "../../common/constant";

interface EditBlogProps {
    slug: string | undefined;
}

const EditBlogForm: React.FC<EditBlogProps> = ({ slug }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${baseUrl}/blog/${slug}`);
                const data = await res.json();
                setTitle(data.title);
                setDescription(data.description || "");
                setContent(data.content);
            } catch (err) {
                console.error("Error fetching blog:", err);
                alert("Failed to load blog for editing.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${baseUrl}/blog/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, content }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Error: " + errorData.error);
                return;
            }

            navigate(`/blog/${slug}`);
        } catch (err) {
            console.error("Error updating blog:", err);
            alert("Failed to update blog.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p>Loading blog...</p>;

    return (
        <div className="max-w-5xl min-h-[78vh] mx-auto px-4 py-8 bg-[#F5F5F5]/80 mt-8 rounded-2xl">
            <div className="max-w-5xl mx-auto">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full text-5xl font-semibold bg-transparent border-b-2 border-gray-200 focus:outline-none my-8 mx-4"
                />

                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short Description"
                    className="w-full text-lg bg-transparent border-b border-gray-200 focus:outline-none my-8 mx-4"
                />

                <div className="mx-4">
                    <CreateBlogEditor content={content} onChange={setContent} />
                </div>

                <div className="mt-6 mx-4">
                    <button
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                    >
                        {isSubmitting ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBlogForm;
