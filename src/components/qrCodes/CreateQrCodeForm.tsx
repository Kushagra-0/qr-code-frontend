import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { baseUrl } from "../../common/constant";

const CreateQrCodeForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [color, setColor] = useState("#000000");
  const [isDynamic, setIsDynamic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${baseUrl}/qrcodes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          color,
          isDynamic,  
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create QR code");
      }

      navigate("/dashboard"); // Adjust this to your QR code list route
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#F5F5F5]/80 shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Create New QR Code</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Content</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-500"
            placeholder="Enter the content to encode"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">QR Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 p-1 border rounded"
          />
        </div>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isDynamic}
            onChange={() => setIsDynamic(!isDynamic)}
            className="form-checkbox h-5 w-5"
          />
          <span className="ml-2 text-gray-700 font-semibold">Make Dynamic</span>
        </label>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white font-semibold rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Creating..." : "Create QR Code"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQrCodeForm;
