import "./styles/BlogStyles.css"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateBlogEditor from "./CreateBlogEditor";
import { baseUrl } from "../../common/constant";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface EditBlogProps {
    slug: string | undefined;
}

const EditBlogForm: React.FC<EditBlogProps> = ({ slug }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = useAuth();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${baseUrl}/blog/${slug}`);
                const data = await res.json();
                setTitle(data.title);
                setDescription(data.description || "");
                setContent(data.content);
                setCoverImageUrl(data.coverImageUrl || null);
            } catch (err) {
                console.error("Error fetching blog:", err);
                alert("Failed to load blog for editing.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Using the /upload/image route for the cover image
            const res = await axios.post(`${baseUrl}/upload/blog/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setCoverImageUrl(res.data.url)

        } catch (err) {
            console.error(err);
            alert("An error occurred during cover image upload.");
        }
    };

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${baseUrl}/blog/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, content, coverImageUrl }),
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

                <div className="mx-4 my-8">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Change Cover Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#036AFF] hover:file:bg-blue-100"
                    />

                    {/* Cover Image Preview */}
                    {coverImageUrl && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-1">Current/New Cover:</h3>
                            <img
                                src={coverImageUrl}
                                alt="Cover Preview"
                                className="h-64 w-full object-cover rounded-lg border-2 border-gray-300"
                            />
                            {/* Option to clear the cover image */}
                            <button
                                onClick={() => setCoverImageUrl(null)}
                                className="mt-2 text-sm text-red-500 hover:text-red-700"
                            >
                                Remove Cover Image
                            </button>
                        </div>
                    )}
                </div>

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
