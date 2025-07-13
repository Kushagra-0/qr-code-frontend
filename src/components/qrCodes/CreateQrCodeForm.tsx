import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { baseUrl } from "../../common/constant";
import { QrCode } from "../../interface/QrCode";
import CustomQRCode from "./CustomQRCode";

const CreateQrCodeForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [createdQRCode, setCreatedQRCode] = useState<QrCode | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [dotType, setDotType] = useState<any>("square");
  const [dotColor, setDotColor] = useState("#000000");
  const [cornersSquareType, setCornersSquareType] = useState<any>("square");
  const [cornersSquareColor, setCornersSquareColor] = useState("#000000");
  const [cornersDotType, setCornersDotType] = useState<any>("square");
  const [cornersDotColor, setCornersDotColor] = useState("#000000");
  const [isDynamic, setIsDynamic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return setError("Content is required");

    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/qrcodes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: content, content, isDynamic }), // Include isDynamic here
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create QR code");

      setName(content);
      setCreatedQRCode(data.qrCode);
      setStep(2); // Go to Step 2
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdQRCode) return;

    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/qrcodes/${createdQRCode._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          content,
          backgroundColor,
          dotType,
          dotColor,
          cornersSquareType,
          cornersSquareColor,
          cornersDotType,
          cornersDotColor,
          isDynamic,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update QR code");

      navigate(`/qrcodes/details/${createdQRCode._id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={step === 1 ? handleInitialSubmit : handleFinalSubmit} className="space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="w-1/3 bg-[#F5F5F5]/80 rounded-2xl p-8">
              <h1 className="text-3xl font-bold mb-6">
                {step === 1 ? "Create QR Code" : ""}
              </h1>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-0"
                placeholder="Enter the content"
              />
            </div>

            <div className="w-full flex items-center justify-start mb-4">
              <div className="flex items-center space-x-4 bg-[#F5F5F5]/80 rounded-2xl p-4 w-40">

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isDynamic}
                    onChange={() => setIsDynamic(!isDynamic)}
                  />
                  <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6"></div>
                </label>

                <span className={`font-semibold ${isDynamic ? "text-blue-600" : "text-gray-500"}`}>{`${isDynamic ? "Dynamic" : "Static"}`}</span>
              </div>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && createdQRCode && (
          <>
            <div className="grid grid-cols-3 h-[78vh] gap-8">
              <div className="flex justify-center bg-[#F5F5F5]/80 rounded-2xl relative">
                <img
                  src="/iphone.png"
                  alt="iPhone"
                  className="h-[calc(100vh-300px)] object-contain mt-32"
                />

                <div
                  className="absolute top-[42%] right-[26%] bg-white flex justify-center items-center"
                >
                  <div className="p-2" style={{ backgroundColor }}>
                    <CustomQRCode
                      data={createdQRCode.isDynamic ? `${window.location.origin}/qr/${createdQRCode.shortCode}` : createdQRCode.content}
                      bgColor={backgroundColor}
                      size={220}
                      margin={-1}
                      dotType={dotType}
                      dotColor={dotColor}
                      cornersSquareType={cornersSquareType}
                      cornersSquareColor={cornersSquareColor}
                      cornersDotType={cornersDotType}
                      cornersDotColor={cornersDotColor}
                    />
                  </div>
                </div>

                <div className="absolute top-[85%] flex items-center justify-center bg-[#FFFFFF] text-[#036AFF] font-bold px-16 py-2 border-2 border-gray-900 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`text-4xl font-bold rounded-lg ${loading
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                      }`}
                  >
                    {loading ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </div>
              </div>

              <div className="bg-[#F5F5F5]/80 rounded-2xl p-8 col-span-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Content</label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">QR Background Color</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Dot Style</label>
                  <select
                    value={dotType}
                    onChange={(e) => setDotType(e.target.value as any)}
                    className="border rounded px-4 py-2 w-full"
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Dot Color</label>
                  <input
                    type="color"
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Corner Square Style</label>
                  <select
                    value={cornersSquareType}
                    onChange={(e) => setCornersSquareType(e.target.value as any)}
                    className="border rounded px-4 py-2 w-full"
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Corner Square Color</label>
                  <input
                    type="color"
                    value={cornersSquareColor}
                    onChange={(e) => setCornersSquareColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Corner Dot Style</label>
                  <select
                    value={cornersDotType}
                    onChange={(e) => setCornersDotType(e.target.value as any)}
                    className="border rounded px-4 py-2 w-full"
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Corner Dot Color</label>
                  <input
                    type="color"
                    value={cornersDotColor}
                    onChange={(e) => setCornersDotColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                </div>
              </div>
            </div>
          </>
        )}


        {step == 1 &&
          <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white font-semibold rounded-lg ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading
                ? step === 1
                  ? "Creating..."
                  : "Saving..."
                : step === 1
                  ? "CREATE"
                  : "Save Changes"}
            </button>
          </div>
        }
      </form>
    </div>
  );
};

export default CreateQrCodeForm;
