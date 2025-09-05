import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../common/constant";
import { useAuth } from "../../../context/AuthContext";

interface AudioFormProps {
  typeData: any;
  setTypeData: (data: any) => void;
}

const AudioForm = ({ typeData, setTypeData }: AudioFormProps) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Only audio files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(`${baseUrl}/upload/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const url = res.data.url;
      setTypeData({ audioUrl: url });
    } catch (err) {
      console.error("Audio upload failed:", err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Audio</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <p className="text-blue-600 font-semibold">Uploading audio...</p>
        ) : typeData?.audioUrl ? (
          <div className="flex flex-col items-center">
            <audio controls src={typeData.audioUrl} className="w-full mb-2" />
            <a
              href={typeData.audioUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Download Audio
            </a>
          </div>
        ) : (
          <p className="text-gray-600">Drag & drop an audio file here (MP3, WAV, etc.)</p>
        )}
      </div>
    </div>
  );
};

export default AudioForm;
