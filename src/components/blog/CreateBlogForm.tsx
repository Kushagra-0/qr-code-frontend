import "./styles/BlogStyles.css"

import React, { useState } from "react";
import CreateBlogEditor from "./CreateBlogEditor";
import { baseUrl } from "../../common/constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const CreateBlogForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = useAuth();

    const navigate = useNavigate();

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        setSlug(generateSlug(val));
    };

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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const payload = {
            title,
            description,
            slug,
            content,
            coverImageUrl,
        };

        try {
            const res = await fetch(`${baseUrl}/blog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsPreviewOpen(false);
                setTitle("");
                setDescription("");
                setContent("");
                setImagePreview(null);
                navigate(`/blog/${slug}`)
            } else {
                const errorData = await res.json();
                alert("Error: " + errorData.error);
            }
        } catch (err) {
            console.error(err);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="max-w-5xl min-h-[78vh] mx-auto px-4 py-8 bg-[#F5F5F5]/80 mt-8 rounded-2xl">
            <div className="max-w-5xl mx-auto">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Title"
                    className="w-full text-5xl font-semibold bg-transparent border-b-2 border-gray-200 focus:outline-none my-8 mx-4"
                />

                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short Description"
                    className="w-full text-xl bg-transparent border-b border-gray-200 focus:outline-none my-8 mx-4"
                />

                <div className="mx-4 my-8">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#036AFF] hover:file:bg-blue-100"
                    />
                    {/* Cover Image Preview */}
                    {coverImageUrl && (
                        <div className="mt-4">
                            <img src={coverImageUrl} alt="Cover Preview" className="h-40 w-full object-cover rounded-lg" />
                        </div>
                    )}
                </div>


                <div className="mx-4">
                    <CreateBlogEditor content={content} onChange={setContent} />
                </div>

                <div className="mt-6 mx-4">
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-6 py-2 bg-[#036AFF] text-white rounded-xl hover:shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                    >
                        Preview & Publish
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-2">{title}</h2>
                        <p className="text-gray-600 mb-4">{description}</p>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="rounded-lg mb-4"
                            />
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#036AFF] text-white rounded-lg flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        {/* <Loader2 className="animate-spin mr-2" /> */}
                                        Publishing...
                                    </>
                                ) : (
                                    "Publish"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBlogForm;
