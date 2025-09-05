import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // wherever your token comes from
import { baseUrl } from "./constant";

const UploadImage = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); // 👈 get token

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${baseUrl}/upload/logo/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 👈 IMPORTANT
        },
      });

      onUpload(res.data.url);
    } catch (err: any) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // setUploadedUrl(null);
    onUpload(""); // clear logo in parent
    setLoading(false);

    // also clear input value
    const input = document.getElementById("file-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="my-4">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 cursor-pointer hover:border-blue-500 bg-white rounded-2xl transition"
      >
        <p className="text-gray-600 text-sm">
          {loading ? "Uploading..." : "Click or drag file to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG allowed</p>
      </label>

      {/* hidden input */}
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition mt-2"
        >
          Cancel
        </button>
    </div>
  
  );
};

export default UploadImage;
