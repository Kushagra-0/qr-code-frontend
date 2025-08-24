import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { baseUrl } from "../../common/constant";
import { QrCode } from "../../interface/QrCode";
import CustomQRCode from "./CustomQRCode";
import PhoneForm from "./helperForms/PhoneForm";
import SmsForm from "./helperForms/SmsForm";
import UrlForm from "./helperForms/UrlForm";
import YoutubeForm from "./helperForms/YoutubeForm";
import EmailForm from "./helperForms/EmailForm";
import { qrTypes } from "../common/QrTypes";
import WhatsappForm from "./helperForms/WhatsappForm";
import LocationForm from "./helperForms/LocationForm";
import UpiForm from "./helperForms/UpiForm";
import ColorPicker from "../../common/ColorPicker";

const CreateQrCodeForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdQRCode, setCreatedQRCode] = useState<QrCode | null>(null);
  const [name, setName] = useState("");

  const [qrType, setQrType] = useState("URL");
  const [typeData, setTypeData] = useState<any>({})

  //Styling Options
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [dotType, setDotType] = useState<any>("square");
  const [dotColor, setDotColor] = useState("#000000");
  const [cornersSquareType, setCornersSquareType] = useState<any>("square");
  const [cornersSquareColor, setCornersSquareColor] = useState("#000000");
  const [cornersDotType, setCornersDotType] = useState<any>("square");
  const [cornersDotColor, setCornersDotColor] = useState("#000000");

  //Dynamic Options
  const [isDynamic, setIsDynamic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState<"data" | "styles">("data");

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(qrType, typeData, isDynamic)

    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/qrcodes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: qrType, typeData, isDynamic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create QR code");

      setCreatedQRCode(data.qrCode);
      setStep(3);
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
          typeData,
          backgroundColor,
          dotType,
          dotColor,
          cornersSquareType,
          cornersSquareColor,
          cornersDotType,
          cornersDotColor,
          isDynamic,
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

  const renderStep1 = () => (
    <div className="bg-[#F5F5F5]/80 rounded-2xl p-8 min-h-[78vh]">
      <h1 className="text-3xl font-bold mb-10 flex justify-center ">Select QR Code Type</h1>

      {/* Uneven grid */}
      <div className="grid grid-cols-14 gap-4 auto-rows-[80px]">
        {qrTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setQrType(type.value);
              setStep(2);
            }}
            className={`flex items-center text-xl justify-center text-start border rounded-xl px-4 font-medium transition-all gap-3 bg-white text-gray-800 hover:bg-gray-100 border-gray-300 ${type.size}`}
          >
            {type.mainIcon ?
              <>
                <img src={type.mainIcon} className="size-10" />
              </>
              :
              <>
                {type.supportIcon}{type.label}
              </>
            }

          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full flex items-center justify-center bg-[#F5F5F5]/80 rounded-2xl p-8">
      <div className="bg-white p-8 w-1/2 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold mb-6">Enter QR Code Data</h1>

          {qrType === "URL" && (
            <UrlForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "EMAIL" && (
            <EmailForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "SMS" && (
            <SmsForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "PHONE" && (
            <PhoneForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "YOUTUBE" && (
            <YoutubeForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "WHATSAPP" && (
            <WhatsappForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "LOCATION" && (
            <LocationForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "UPI" && (
            <UpiForm typeData={typeData} setTypeData={setTypeData} />
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 rounded-lg border"
            >
              BACK
            </button>
            <button
              type="button"
              onClick={handleInitialSubmit}
              className="px-6 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              GENERATE QR
            </button>
          </div>

        </div>


      </div>

    </div>
  );

  const renderStep3 = () => (
    <>
      <div className="grid grid-cols-3 h-[78vh] gap-8">
        <div className="flex justify-center bg-[#F5F5F5]/80 rounded-2xl relative">
          <img
            src="/iphone.png"
            alt="iPhone"
            className="h-[calc(100vh-300px)] object-contain mt-32"
          />

          <div className="absolute top-[42%] right-[26%] bg-white flex justify-center items-center">
            <div className="p-2" style={{ backgroundColor }}>
              <CustomQRCode
                data={createdQRCode?.isDynamic ? `${window.location.origin}/qr/${createdQRCode?.shortCode}` : "xcvb"}
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

          <div className="absolute top-[85%] flex items-center justify-center bg-[#FFFFFF] text-[#036AFF] font-bold px-16 py-2 border-2 border-gray-900 rounded-xl">
            <button
              type="submit"
              disabled={loading}
              className={`text-4xl font-bold rounded-lg ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        <div className="bg-[#F5F5F5]/80 rounded-2xl p-8 col-span-2 gap-6 overflow-y-scroll custom-scrollbar">
          <div className="flex justify-between px-48 py-4 rounded-2xl text-xl flex-between border-b bg-white border-gray-300 mb-6">
            <div
              onClick={() => setSelectedTab("data")}
              className={`font-semibold ${selectedTab === "data"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
            >
              DATA
            </div>
            <div
              onClick={() => setSelectedTab("styles")}
              className={`font-semibold ${selectedTab === "styles"
                ? "text-blue-600 "
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
            >
              STYLES
            </div>
          </div>

          <div>
            {selectedTab === "data" && (
              <div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition shadow-sm placeholder-gray-400"
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Data</label>

                  {qrType === "URL" && (
                    <UrlForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "EMAIL" && (
                    <EmailForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "SMS" && (
                    <SmsForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "PHONE" && (
                    <PhoneForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "YOUTUBE" && (
                    <YoutubeForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "WHATSAPP" && (
                    <WhatsappForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "LOCATION" && (
                    <LocationForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "UPI" && (
                    <UpiForm typeData={typeData} setTypeData={setTypeData} />
                  )}
                </div>
              </div>
            )}

            {selectedTab === "styles" && (
              <div>
                <div className="mt-8">
                  <div className="block text-sm font-medium text-gray-700 mb-2">QR Colors</div>
                  <div className="flex flex-row gap-4 mt-2">
                    <div className="border p-2 rounded-lg">
                      <label className="block text-gray-700 font-semibold text-xs">Code Color</label>
                      <input
                        value={dotColor}
                        onChange={(e) => setDotColor(e.target.value)}
                        className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                      />
                      <ColorPicker color={dotColor} onChange={setDotColor} />
                    </div>
                    <div className="border p-2 rounded-lg">
                      <label className="block text-gray-700 font-semibold text-xs">Background Color</label>
                      <input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                      />
                      <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Style</label>
                  <div className="flex gap-4">
                    {[
                      { label: "Square", value: "square", icon: "/qr-styles/square.svg" },
                      { label: "Dots", value: "dots", icon: "/qr-styles/dots.svg" },
                      { label: "Rounded", value: "rounded", icon: "/qr-styles/rounded.svg" },
                      { label: "Classy", value: "classy", icon: "/qr-styles/classy.svg" },
                      { label: "Classy Rounded", value: "classy-rounded", icon: "/qr-styles/classy-rounded.svg" },
                      { label: "Extra Rounded", value: "extra-rounded", icon: "/qr-styles/extra-rounded.svg" },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setDotType(style.value)}
                        type="button"
                        className={`p-2 rounded-lg border-2 ${dotType === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                      >
                        <div className="bg-white p-2">
                          <img src={style.icon} alt={style.label} className="w-13 h-13" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Edges</div>
                  <div className="flex flex-row mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-xs">Square Style</label>
                      <div className="flex gap-4">
                        {[
                          { label: "Square", value: "square", icon: "/edges-square-styles/square.png" },
                          { label: "Dots", value: "dots", icon: "/edges-square-styles/dots.png" },
                          { label: "Rounded", value: "rounded", icon: "/edges-square-styles/rounded.png" },
                          { label: "Classy", value: "classy", icon: "/edges-square-styles/classy.png" },
                          { label: "Classy Rounded", value: "classy-rounded", icon: "/edges-square-styles/classy-rounded.png" },
                          { label: "Extra Rounded", value: "extra-rounded", icon: "/edges-square-styles/extra-rounded.png" },
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setCornersSquareType(style.value)}
                            type="button"
                            className={`p-2 rounded-lg border-2 ${cornersSquareType === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                          >
                            <div className="bg-white p-2">
                              <img src={style.icon} alt={style.label} className="w-13 h-13" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border p-2 rounded-lg mx-4 mt-6">
                      <label className="block text-gray-700 font-semibold text-xs">Square Color</label>
                      <input
                        value={cornersSquareColor}
                        onChange={(e) => setCornersSquareColor(e.target.value)}
                        className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                      />
                      <ColorPicker color={cornersSquareColor} onChange={setCornersSquareColor} />
                    </div>
                  </div>

                  <div className="flex flex-row mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-xs">Dot Style</label>
                      <div className="flex gap-4">
                        {[
                          { label: "Square", value: "square", icon: "/edges-dot-styles/square.svg" },
                          { label: "Dots", value: "dots", icon: "/edges-dot-styles/dots.svg" },
                          { label: "Rounded", value: "rounded", icon: "/edges-dot-styles/rounded.png" },
                          { label: "Classy", value: "classy", icon: "/edges-dot-styles/classy.png" },
                          { label: "Classy Rounded", value: "classy-rounded", icon: "/edges-dot-styles/classy-rounded.svg" },
                          { label: "Extra Rounded", value: "extra-rounded", icon: "/edges-dot-styles/extra-rounded.svg" },
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setCornersDotType(style.value)}
                            type="button"
                            className={`p-2 rounded-lg border-2 ${cornersDotType === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                          >
                            <div className="bg-white p-2">
                              <img src={style.icon} alt={style.label} className="w-13 h-13" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border p-2 rounded-lg mx-4 mt-6">
                      <label className="block text-gray-700 font-semibold mb-1 text-xs">Dot Color</label>
                      <input
                        value={cornersDotColor}
                        onChange={(e) => setCornersDotColor(e.target.value)}
                        className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                      />
                      <ColorPicker color={cornersDotColor} onChange={setCornersDotColor} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">QR Background Color</label>
            <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-16 h-10 p-1 border rounded" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Dot Style</label>
            <select value={dotType} onChange={(e) => setDotType(e.target.value)} className="border rounded px-4 py-2 w-full">
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
            <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-16 h-10 p-1 border rounded" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Corner Square Style</label>
            <select value={cornersSquareType} onChange={(e) => setCornersSquareType(e.target.value)} className="border rounded px-4 py-2 w-full">
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
            <input type="color" value={cornersSquareColor} onChange={(e) => setCornersSquareColor(e.target.value)} className="w-16 h-10 p-1 border rounded" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Corner Dot Style</label>
            <select value={cornersDotType} onChange={(e) => setCornersDotType(e.target.value)} className="border rounded px-4 py-2 w-full">
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
            <input type="color" value={cornersDotColor} onChange={(e) => setCornersDotColor(e.target.value)} className="w-16 h-10 p-1 border rounded" />
          </div> */}
        </div>
      </div>
    </>
  );



  return (
    <div className="mx-auto mt-8">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={step === 3 ? handleFinalSubmit : (e) => e.preventDefault()} className="space-y-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && createdQRCode && renderStep3()}
      </form>
    </div>
  );
};

export default CreateQrCodeForm;
