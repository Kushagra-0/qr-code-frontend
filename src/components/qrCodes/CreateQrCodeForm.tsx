import { useEffect, useState } from "react";
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
import UploadImage from "../../common/UploadImage";
import PdfForm from "./helperForms/PdfForm";
import AudioForm from "./helperForms/AudioForm";
import ImageForm from "./helperForms/ImageForm";
import TextForm from "./helperForms/TextForm";

const CreateQrCodeForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdQRCode, setCreatedQRCode] = useState<QrCode | null>(null);
  const [name, setName] = useState("");

  const [qrType, setQrType] = useState("URL");
  const [typeData, setTypeData] = useState<any>({})

  const [image, setImage] = useState<any>(null);
  const [isBackgroundGradient, setIsBackgroundGradient] = useState(false)
  const [backgroundOptions, setBackgroundOptions] = useState<any>({
    color: "#ffffff",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#ffffff" },
        { offset: 1, color: "#ffffff" }
      ]
    }
  })

  const [isDotsGradient, setIsDotsGradient] = useState(false);
  const [dotsOptions, setDotsOptions] = useState<any>({
    color: "#000000",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#000000" }
      ]
    },
    type: "square"
  })

  const [isCornersSquareGradient, setIsCornersSquareGradient] = useState(false);
  const [cornersSquareOptions, setCornersSquareOptions] = useState<any>({
    color: "#000000",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#000000" }
      ]
    },
    type: "square"
  })

  const [isCornersDotGradient, setIsCornersDotGradient] = useState(false);
  const [cornersDotOptions, setCornersDotOptions] = useState<any>({
    color: "#000000",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#000000" }
      ]
    },
    type: "square"
  })

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
          image,
          backgroundOptions,
          dotsOptions,
          cornersSquareOptions,
          cornersDotOptions,
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
    <div className="bg-[#F5F5F5]/80 rounded-2xl p-4 md:p-8 min-h-[78vh]">
      <h1 className="text-3xl font-bold mb-10 flex justify-center ">Select QR Code Type</h1>

      {/* Uneven grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-14 gap-3 md:gap-4 auto-rows-[80px] sm:auto-rows-[90px] md:auto-rows-[100px]">
        {qrTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setQrType(type.value);
              setStep(2);
            }}
            className={`flex items-center text-sm sm:text-base md:text-lg justify-center text-start border rounded-xl px-2 md:px-4 py-2 font-medium transition-all gap-2 md:gap-3 bg-white text-gray-800 hover:bg-gray-100 border-gray-300 ${type.size}`}
          >
            {type.iconType == 1 && (
              <>
                {type.supportIcon}{type.label}
              </>
            )}

            {type.iconType == 2 && (
              <>
                <img src={type.mainIcon} className="size-6 md:size-7" />
              </>
            )}

            {type.iconType == 3 && (
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <img src={type.mainIcon} className="size-6 md:md:size-7 xl:size-10" />
                <span className="hidden xl:flex">
                  {type.supportIcon}{type.label}
                </span>

              </div>
            )}

          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full flex items-center justify-center bg-[#F5F5F5]/80 rounded-2xl p-4 md:p-8">
      <div className="bg-white p-4 md:p-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold mb-6">Enter QR Code Data</h1>

          {qrType === "URL" && (
            <UrlForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "IMAGE" && (
            <ImageForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "EMAIL" && (
            <EmailForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "PDF" && (
            <PdfForm typeData={typeData} setTypeData={setTypeData} />
          )}

          {qrType === "TEXT" && (
            <TextForm typeData={typeData} setTypeData={setTypeData} />
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

          {qrType === "AUDIO" && (
            <AudioForm typeData={typeData} setTypeData={setTypeData} />
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

  console.log(createdQRCode)

  const renderStep3 = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 md:h-[78vh] gap-4 md:gap-8">
        <div className="flex items-center justify-center col-span-1 bg-[#F5F5F5]/80 rounded-2xl relative">
          <img
            src="/iphone-2.png"
            alt="iPhone"
            className="block max-h-[70vh] lg:h-[calc(100vh-280px)] object-contain mt-3 md:mt-30 w-auto min-w-[100px]"
          />

          <div className="absolute flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 md:mt-16 bg-white">
            <CustomQRCode
              data={createdQRCode?.isDynamic ? `${window.location.origin}/qr/${createdQRCode?.shortCode}` : "xcvb"}
              size={220}
              margin={-1}
              image={image}
              backgroundOptions={backgroundOptions}
              dotsOptions={dotsOptions}
              cornersSquareOptions={cornersSquareOptions}
              cornersDotOptions={cornersDotOptions}
            />
          </div>

          <div className="absolute bottom-4 md:bottom-8 w-5/6 flex items-center justify-center bg-[#FFFFFF] text-[#036AFF] font-bold border-2 border-gray-900 rounded-xl">
            <button
              type="submit"
              disabled={loading}
              className={`text-2xl md:text-3xl lg:text-4xl xl:text-4xl px-1 py-3 font-bold rounded-lg ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        <div className="bg-[#F5F5F5]/80 rounded-2xl p-4 md:p-8 col-span-1 md:col-span-2 overflow-y-scroll custom-scrollbar">
          <div className="flex justify-between px-18 md:px-24 lg:px-32 xl:px-48 py-4 rounded-2xl text-xl flex-between border-b bg-white border-gray-300 mb-6">
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

                <div className="mt-4 md:mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Data</label>

                  {qrType === "URL" && (
                    <UrlForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "IMAGE" && (
                    <ImageForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "EMAIL" && (
                    <EmailForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "PDF" && (
                    <PdfForm typeData={typeData} setTypeData={setTypeData} />
                  )}

                  {qrType === "TEXT" && (
                    <TextForm typeData={typeData} setTypeData={setTypeData} />
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

                  {qrType === "AUDIO" && (
                    <AudioForm typeData={typeData} setTypeData={setTypeData} />
                  )}
                </div>
              </div>
            )}

            {selectedTab === "styles" && (
              <div>
                <div className="mt-4 md:mt-8">
                  {/* <UploadLogo onUpload={(url:any) => setLogo(url)} /> */}
                  <div className="block text-sm font-medium text-gray-700 mb-2">QR Colors</div>
                  <div className="flex flex-col xl:flex-row gap-4 mt-2">

                    <div className="bg-white p-4 rounded-2xl w-full xl:w-1/2">
                      <label className="block text-gray-700 font-semibold text-xs mb-3">Code Color</label>

                      {/* Solid / Gradient Toggle */}
                      <div className="flex items-center gap-6 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!isDotsGradient}
                            onChange={() => {
                              setIsDotsGradient(false);
                              setDotsOptions({
                                ...dotsOptions,
                                gradient: undefined,
                                color: "#000000"
                              });
                            }}
                          />
                          <span>Solid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={isDotsGradient}
                            onChange={() => {
                              setIsDotsGradient(true);
                              setDotsOptions({
                                ...dotsOptions,
                                color: undefined,
                                gradient: {
                                  type: "linear",
                                  rotation: 0,
                                  colorStops: [
                                    { offset: 0, color: "#000000" },
                                    { offset: 1, color: "#000000" }
                                  ]
                                }
                              });
                            }}
                          />
                          <span>Gradient</span>
                        </label>
                      </div>

                      {isDotsGradient ?
                        <>
                          <div className="grid gap-4">
                            <div className="flex gap-4">
                              {/* Start Color */}
                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">Start Color</label>
                                <input
                                  value={dotsOptions.gradient.colorStops[0].color}
                                  onChange={(e) =>
                                    setDotsOptions({
                                      ...dotsOptions,
                                      gradient: {
                                        ...dotsOptions.gradient,
                                        colorStops: [
                                          { ...dotsOptions.gradient.colorStops[0], color: e.target.value },
                                          dotsOptions.gradient.colorStops[1]
                                        ]
                                      }
                                    })
                                  }
                                  className="outline-none w-36 uppercase"
                                />
                                <ColorPicker
                                  color={dotsOptions.gradient.colorStops[0].color}
                                  onChange={(c) =>
                                    setDotsOptions({
                                      ...dotsOptions,
                                      gradient: {
                                        ...dotsOptions.gradient,
                                        colorStops: [
                                          { ...dotsOptions.gradient.colorStops[0], color: c },
                                          dotsOptions.gradient.colorStops[1]
                                        ]
                                      }
                                    })
                                  }
                                />
                              </div>

                              {/* End Color */}
                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">End Color</label>
                                <input
                                  value={dotsOptions.gradient.colorStops[1].color}
                                  onChange={(e) =>
                                    setDotsOptions({
                                      ...dotsOptions,
                                      gradient: {
                                        ...dotsOptions.gradient,
                                        colorStops: [
                                          dotsOptions.gradient.colorStops[0],
                                          { ...dotsOptions.gradient.colorStops[1], color: e.target.value }
                                        ]
                                      }
                                    })
                                  }
                                  className="outline-none w-36 uppercase"
                                />
                                <ColorPicker
                                  color={dotsOptions.gradient.colorStops[1].color}
                                  onChange={(c) =>
                                    setDotsOptions({
                                      ...dotsOptions,
                                      gradient: {
                                        ...dotsOptions.gradient,
                                        colorStops: [
                                          dotsOptions.gradient.colorStops[0],
                                          { ...dotsOptions.gradient.colorStops[1], color: c }
                                        ]
                                      }
                                    })
                                  }
                                />
                              </div>
                            </div>

                            {/* Gradient Type & Rotation */}
                            <div className="flex gap-4">
                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">Gradient Type</label>
                                <select
                                  value={dotsOptions.gradient.type}
                                  onChange={(e) =>
                                    setDotsOptions({
                                      ...dotsOptions,
                                      gradient: { ...dotsOptions.gradient, type: e.target.value as "linear" | "radial" }
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                >
                                  <option value="linear">Linear</option>
                                  <option value="radial">Radial</option>
                                </select>
                              </div>

                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">Rotation</label>
                                <input
                                  type="number"
                                  value={dotsOptions.gradient.rotation}
                                  onChange={(e) =>
                                    setDotsOptions({
                                      ...dotsOptions,
                                      gradient: { ...dotsOptions.gradient, rotation: Number(e.target.value) }
                                    })
                                  }
                                  className="border rounded px-2 py-1 w-24"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                        :
                        <>
                          <div className="border p-2 rounded-lg w-1/2">
                            <label className="block text-gray-700 font-semibold text-xs">Code Color</label>
                            <input
                              value={dotsOptions.color}
                              onChange={(e) =>
                                setDotsOptions({ ...dotsOptions, color: e.target.value, gradient: undefined })
                              }
                              className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                            />
                            <ColorPicker
                              color={dotsOptions.color}
                              onChange={(c) =>
                                setDotsOptions({ ...dotsOptions, color: c, gradient: undefined })
                              }
                            />
                          </div>

                        </>
                      }
                    </div>


                    <div className="bg-white p-4 rounded-2xl w-full xl:w-1/2">
                      <div className="block text-sm font-medium text-gray-700 mb-2">QR Background</div>

                      {/* Toggle Solid / Gradient */}
                      <div className="flex items-center gap-6 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!isBackgroundGradient}
                            onChange={() => {
                              setIsBackgroundGradient(false);
                              setBackgroundOptions({
                                color: "#ffffff",
                                gradient: undefined
                              });
                            }}
                          />
                          <span>Solid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={isBackgroundGradient}
                            onChange={() => {
                              setIsBackgroundGradient(true);
                              setBackgroundOptions({
                                gradient: {
                                  type: "linear",
                                  rotation: 0,
                                  colorStops: [
                                    { offset: 0, color: "#ffffff" },
                                    { offset: 1, color: "#ffffff" }
                                  ]
                                }
                              });
                            }}
                          />
                          <span>Gradient</span>
                        </label>
                      </div>

                      {isBackgroundGradient ?
                        <>
                          <div className="grid gap-4">
                            <div className="flex gap-4">
                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">Start Color</label>
                                <input
                                  value={backgroundOptions.gradient.colorStops[0].color}
                                  onChange={(e) =>
                                    setBackgroundOptions({
                                      gradient: {
                                        ...backgroundOptions.gradient,
                                        colorStops: [
                                          { ...backgroundOptions.gradient.colorStops[0], color: e.target.value },
                                          backgroundOptions.gradient.colorStops[1],
                                        ],
                                      },
                                    })
                                  }
                                  className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                                />
                                <ColorPicker
                                  color={backgroundOptions.gradient.colorStops[0].color}
                                  onChange={(c) =>
                                    setBackgroundOptions({
                                      gradient: {
                                        ...backgroundOptions.gradient,
                                        colorStops: [
                                          { ...backgroundOptions.gradient.colorStops[0], color: c },
                                          backgroundOptions.gradient.colorStops[1],
                                        ],
                                      },
                                    })
                                  }
                                />
                              </div>

                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">End Color</label>
                                <input
                                  value={backgroundOptions.gradient.colorStops[1].color}
                                  onChange={(e) =>
                                    setBackgroundOptions({
                                      gradient: {
                                        ...backgroundOptions.gradient,
                                        colorStops: [
                                          backgroundOptions.gradient.colorStops[0],
                                          { ...backgroundOptions.gradient.colorStops[1], color: e.target.value },
                                        ],
                                      },
                                    })
                                  }
                                  className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                                />
                                <ColorPicker
                                  color={backgroundOptions.gradient.colorStops[1].color}
                                  onChange={(c) =>
                                    setBackgroundOptions({
                                      gradient: {
                                        ...backgroundOptions.gradient,
                                        colorStops: [
                                          backgroundOptions.gradient.colorStops[0],
                                          { ...backgroundOptions.gradient.colorStops[1], color: c },
                                        ],
                                      },
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">Gradient Type</label>
                                <select
                                  value={backgroundOptions.gradient.type}
                                  onChange={(e) =>
                                    setBackgroundOptions({
                                      ...backgroundOptions,
                                      gradient: { ...backgroundOptions.gradient, type: e.target.value as "linear" | "radial" },
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                >
                                  <option value="linear">Linear</option>
                                  <option value="radial">Radial</option>
                                </select>
                              </div>

                              <div className="border p-2 rounded-lg">
                                <label className="block text-gray-700 font-semibold text-xs">Rotation</label>
                                <input
                                  type="number"
                                  value={backgroundOptions.gradient.rotation}
                                  onChange={(e) =>
                                    setBackgroundOptions({
                                      ...backgroundOptions,
                                      gradient: { ...backgroundOptions.gradient, rotation: Number(e.target.value) },
                                    })
                                  }
                                  className="border rounded px-2 py-1 w-24"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                        :
                        <>
                          <div className="border p-2 rounded-lg w-1/2">
                            <label className="block text-gray-700 font-semibold text-xs">Background Color</label>
                            <input
                              value={backgroundOptions.color}
                              onChange={(e) => setBackgroundOptions({ color: e.target.value })}
                              className="outline-none focus:ring-0 focus:border-transparent w-36 uppercase"
                            />
                            <ColorPicker
                              color={backgroundOptions.color}
                              onChange={(c) => setBackgroundOptions({ color: c, gradient: undefined })}
                            />
                          </div>
                        </>
                      }
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                        onClick={() => setDotsOptions({ ...dotsOptions, type: style.value })}
                        type="button"
                        className={`flex bg-white items-center justify-center p-2 rounded-lg border-2 ${dotsOptions.type === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                      >
                        <div className="p-2">
                          <img src={style.icon} alt={style.label} className="" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 md:mt-8">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Edges</div>
                  <div className="flex flex-col mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-xs">Square Style</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                            onClick={() => setCornersSquareOptions({ ...cornersSquareOptions, type: style.value })}
                            type="button"
                            className={`flex bg-white items-center justify-center p-2 rounded-lg border-2 ${cornersSquareOptions.type === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                          >
                            <div className="p-2">
                              <img src={style.icon} alt={style.label} className="" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl w-full xl:w-1/2 mt-6">
                      <div className="block text-sm font-medium text-gray-700 mb-2">Square Color</div>
                      <div className="flex items-center gap-6 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!isCornersSquareGradient}
                            onChange={() => {
                              setIsCornersSquareGradient(false);
                              setCornersSquareOptions({
                                ...cornersSquareOptions,
                                gradient: undefined,
                                color: "#000000"
                              });
                            }}
                          />
                          <span>Solid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={isCornersSquareGradient}
                            onChange={() => {
                              setIsCornersSquareGradient(true);
                              setCornersSquareOptions({
                                ...cornersSquareOptions,
                                color: undefined,
                                gradient: {
                                  type: "linear",
                                  rotation: 0,
                                  colorStops: [
                                    { offset: 0, color: "#000000" },
                                    { offset: 1, color: "#000000" }
                                  ]
                                }
                              });
                            }}
                          />
                          <span>Gradient</span>
                        </label>
                      </div>

                      {isCornersSquareGradient ? (
                        <>
                          {/* Gradient picker UI — same structure as dotsOptions */}
                          <div className="flex gap-4">
                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">Start Color</label>
                              <input
                                value={cornersSquareOptions.gradient.colorStops[0].color}
                                onChange={(e) =>
                                  setCornersSquareOptions({
                                    ...cornersSquareOptions,
                                    gradient: {
                                      ...cornersSquareOptions.gradient,
                                      colorStops: [
                                        { ...cornersSquareOptions.gradient.colorStops[0], color: e.target.value },
                                        cornersSquareOptions.gradient.colorStops[1]
                                      ]
                                    }
                                  })
                                }
                                className="outline-none w-36 uppercase"
                              />
                              <ColorPicker
                                color={cornersSquareOptions.gradient.colorStops[0].color}
                                onChange={(c) =>
                                  setCornersSquareOptions({
                                    ...cornersSquareOptions,
                                    gradient: {
                                      ...cornersSquareOptions.gradient,
                                      colorStops: [
                                        { ...cornersSquareOptions.gradient.colorStops[0], color: c },
                                        cornersSquareOptions.gradient.colorStops[1]
                                      ]
                                    }
                                  })
                                }
                              />
                            </div>

                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">End Color</label>
                              <input
                                value={cornersSquareOptions.gradient.colorStops[1].color}
                                onChange={(e) =>
                                  setCornersSquareOptions({
                                    ...cornersSquareOptions,
                                    gradient: {
                                      ...cornersSquareOptions.gradient,
                                      colorStops: [
                                        cornersSquareOptions.gradient.colorStops[0],
                                        { ...cornersSquareOptions.gradient.colorStops[1], color: e.target.value }
                                      ]
                                    }
                                  })
                                }
                                className="outline-none w-36 uppercase"
                              />
                              <ColorPicker
                                color={cornersSquareOptions.gradient.colorStops[1].color}
                                onChange={(c) =>
                                  setCornersSquareOptions({
                                    ...cornersSquareOptions,
                                    gradient: {
                                      ...cornersSquareOptions.gradient,
                                      colorStops: [
                                        cornersSquareOptions.gradient.colorStops[0],
                                        { ...cornersSquareOptions.gradient.colorStops[1], color: c }
                                      ]
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 mt-4">
                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">Gradient Type</label>
                              <select
                                value={cornersSquareOptions.gradient.type}
                                onChange={(e) =>
                                  setCornersSquareOptions({
                                    ...cornersSquareOptions,
                                    gradient: { ...cornersSquareOptions.gradient, type: e.target.value as "linear" | "radial" }
                                  })
                                }
                                className="border rounded px-2 py-1"
                              >
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                              </select>
                            </div>

                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">Rotation</label>
                              <input
                                type="number"
                                value={cornersSquareOptions.gradient.rotation}
                                onChange={(e) =>
                                  setCornersSquareOptions({
                                    ...cornersSquareOptions,
                                    gradient: { ...cornersSquareOptions.gradient, rotation: Number(e.target.value) }
                                  })
                                }
                                className="border rounded px-2 py-1 w-24"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="border p-2 rounded-lg w-1/2">
                          <label className="block text-gray-700 font-semibold text-xs">Square Color</label>
                          <input
                            value={cornersSquareOptions.color}
                            onChange={(e) => setCornersSquareOptions({ ...cornersSquareOptions, color: e.target.value, gradient: undefined })}
                            className="outline-none w-36 uppercase"
                          />
                          <ColorPicker
                            color={cornersSquareOptions.color}
                            onChange={(c) => setCornersSquareOptions({ ...cornersSquareOptions, color: c, gradient: undefined })}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-xs">Dot Style</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                            onClick={() => setCornersDotOptions({ ...cornersDotOptions, type: style.value })}
                            type="button"
                            className={`flex bg-white items-center justify-center p-2 rounded-lg border-2 ${cornersDotOptions.type === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                          >
                            <div className="p-2">
                              <img src={style.icon} alt={style.label} className="" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl w-full xl:w-1/2 mt-6">
                      <div className="block text-sm font-medium text-gray-700 mb-2">Dot Color</div>
                      <div className="flex items-center gap-6 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!isCornersDotGradient}
                            onChange={() => {
                              setIsCornersDotGradient(false);
                              setCornersDotOptions({
                                ...cornersDotOptions,
                                gradient: undefined,
                                color: "#000000"
                              });
                            }}
                          />
                          <span>Solid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={isCornersDotGradient}
                            onChange={() => {
                              setIsCornersDotGradient(true);
                              setCornersDotOptions({
                                ...cornersDotOptions,
                                color: undefined,
                                gradient: {
                                  type: "linear",
                                  rotation: 0,
                                  colorStops: [
                                    { offset: 0, color: "#000000" },
                                    { offset: 1, color: "#000000" }
                                  ]
                                }
                              });
                            }}
                          />
                          <span>Gradient</span>
                        </label>
                      </div>

                      {isCornersDotGradient ? (
                        <>
                          {/* Gradient picker UI — same structure as dotsOptions */}
                          <div className="flex gap-4">
                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">Start Color</label>
                              <input
                                value={cornersDotOptions.gradient.colorStops[0].color}
                                onChange={(e) =>
                                  setCornersDotOptions({
                                    ...cornersDotOptions,
                                    gradient: {
                                      ...cornersDotOptions.gradient,
                                      colorStops: [
                                        { ...cornersDotOptions.gradient.colorStops[0], color: e.target.value },
                                        cornersDotOptions.gradient.colorStops[1]
                                      ]
                                    }
                                  })
                                }
                                className="outline-none w-36 uppercase"
                              />
                              <ColorPicker
                                color={cornersDotOptions.gradient.colorStops[0].color}
                                onChange={(c) =>
                                  setCornersDotOptions({
                                    ...cornersDotOptions,
                                    gradient: {
                                      ...cornersDotOptions.gradient,
                                      colorStops: [
                                        { ...cornersDotOptions.gradient.colorStops[0], color: c },
                                        cornersDotOptions.gradient.colorStops[1]
                                      ]
                                    }
                                  })
                                }
                              />
                            </div>

                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">End Color</label>
                              <input
                                value={cornersDotOptions.gradient.colorStops[1].color}
                                onChange={(e) =>
                                  setCornersDotOptions({
                                    ...cornersDotOptions,
                                    gradient: {
                                      ...cornersDotOptions.gradient,
                                      colorStops: [
                                        cornersDotOptions.gradient.colorStops[0],
                                        { ...cornersDotOptions.gradient.colorStops[1], color: e.target.value }
                                      ]
                                    }
                                  })
                                }
                                className="outline-none w-36 uppercase"
                              />
                              <ColorPicker
                                color={cornersDotOptions.gradient.colorStops[1].color}
                                onChange={(c) =>
                                  setCornersDotOptions({
                                    ...cornersDotOptions,
                                    gradient: {
                                      ...cornersDotOptions.gradient,
                                      colorStops: [
                                        cornersDotOptions.gradient.colorStops[0],
                                        { ...cornersDotOptions.gradient.colorStops[1], color: c }
                                      ]
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 mt-4">
                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">Gradient Type</label>
                              <select
                                value={cornersDotOptions.gradient.type}
                                onChange={(e) =>
                                  setCornersDotOptions({
                                    ...cornersDotOptions,
                                    gradient: { ...cornersDotOptions.gradient, type: e.target.value as "linear" | "radial" }
                                  })
                                }
                                className="border rounded px-2 py-1"
                              >
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                              </select>
                            </div>

                            <div className="border p-2 rounded-lg">
                              <label className="block text-gray-700 font-semibold text-xs">Rotation</label>
                              <input
                                type="number"
                                value={cornersDotOptions.gradient.rotation}
                                onChange={(e) =>
                                  setCornersDotOptions({
                                    ...cornersDotOptions,
                                    gradient: { ...cornersDotOptions.gradient, rotation: Number(e.target.value) }
                                  })
                                }
                                className="border rounded px-2 py-1 w-24"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="border p-2 rounded-lg w-1/2">
                          <label className="block text-gray-700 font-semibold text-xs">Dot Color</label>
                          <input
                            value={cornersDotOptions.color}
                            onChange={(e) => setCornersDotOptions({ ...cornersDotOptions, color: e.target.value, gradient: undefined })}
                            className="outline-none w-36 uppercase"
                          />
                          <ColorPicker
                            color={cornersDotOptions.color}
                            onChange={(c) => setCornersDotOptions({ ...cornersDotOptions, color: c, gradient: undefined })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <UploadImage onUpload={(url: any) => setImage(url)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );



  return (
    <div className="mx-auto mt-4 md:mt-8">
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
