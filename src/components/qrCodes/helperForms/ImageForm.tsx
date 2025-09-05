import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { baseUrl } from "../../../common/constant";

interface ImageFormProps {
  typeData: any;
  setTypeData: (data: any) => void;
}

const ImageForm: React.FC<ImageFormProps> = ({ typeData, setTypeData }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${baseUrl}/upload/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setTypeData({ ...typeData, imageUrl: res.data.url });
    } catch (err: any) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const cancelUpload = () => {
    setTypeData({ ...typeData, imageUrl: null });
  };

  return (
    <div className="my-4">
      <label className="text-gray-700 font-medium">Upload Image</label>

      {!typeData.imageUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 cursor-pointer hover:border-blue-500 bg-white rounded-2xl transition"
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <p className="text-gray-600 text-sm">
              {loading ? "Uploading..." : "Click or drag image file here"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, GIF allowed
            </p>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mt-3">
          <div className="flex items-center gap-3">
            <img
              src={typeData.imageUrl}
              alt="Uploaded preview"
              className="w-12 h-12 object-cover rounded"
            />
            <a
              href={typeData.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline truncate max-w-[200px]"
            >
              {typeData.imageUrl.split("/").pop()}
            </a>
          </div>
          <button
            onClick={cancelUpload}
            className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
