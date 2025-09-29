import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { baseUrl } from "../../common/constant";
import { useNavigate } from "react-router-dom";
import { QrCode } from "../../interface/QrCode";
import CustomQRCode from "./CustomQRCode";
import ColorPicker from "../../common/ColorPicker";
import Skeleton from "../common/Skeletion";
import UrlForm from "./helperForms/UrlForm";
import EmailForm from "./helperForms/EmailForm";
import SmsForm from "./helperForms/SmsForm";
import PhoneForm from "./helperForms/PhoneForm";
import YoutubeForm from "./helperForms/YoutubeForm";
import WhatsappForm from "./helperForms/WhatsappForm";
import LocationForm from "./helperForms/LocationForm";
import UpiForm from "./helperForms/UpiForm";
import UploadImage from "../../common/UploadImage";

interface EditQrCodeFormProps {
    id: string | undefined;
}

const EditQrCodeForm: React.FC<EditQrCodeFormProps> = ({ id }) => {

    const { token } = useAuth();

    const [qrCode, setQrCode] = useState<QrCode | null>(null);
    const [qrId, setQrId] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [name, setName] = useState("");
    const [qrType, setQrType] = useState<string>("");
    const [typeData, setTypeData] = useState<any>({});
    const [image, setImage] = useState<string>("");
    const [isBackgroundGradient, setIsBackgroundGradient] = useState(false);
    const [backgroundOptions, setBackgroundOptions] = useState<any>({
        color: "#ffffff",
        gradient: {
            type: "linear",
            rotation: 0,
            colorStops: [
                { offset: 0, color: "#ffffff" },
                { offset: 1, color: "#ffffff" },
            ],
        },
    });

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

    const [isDynamic, setIsDynamic] = useState(false);
    const [expiresAt, setExpiresAt] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<"data" | "styles">("data");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const res = await fetch(`${baseUrl}/qrcodes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch QR Code");

                setQrCode(data)
                setQrId(data._id);
                setShortCode(data.shortCode)
                setName(data.name);
                setQrType(data.type);
                setTypeData(data.typeData || {});
                setImage(data.image);
                if (data.backgroundOptions?.gradient) {
                    setIsBackgroundGradient(true);
                    setBackgroundOptions(data.backgroundOptions);
                } else {
                    setIsBackgroundGradient(false);
                    setBackgroundOptions(data.backgroundOptions);
                }
                if (data.dotsOptions?.gradient) {
                    setIsDotsGradient(true);
                    setDotsOptions(data.dotsOptions);
                } else {
                    setIsDotsGradient(false);
                    setDotsOptions(data.dotsOptions);
                }
                if (data.cornersSquareOptions?.gradient) {
                    setIsCornersSquareGradient(true);
                    setCornersSquareOptions(data.cornersSquareOptions);
                } else {
                    setIsCornersSquareGradient(false);
                    setCornersSquareOptions(data.cornersSquareOptions);
                }
                if (data.cornersDotOptions?.gradient) {
                    setIsCornersDotGradient(true);
                    setCornersDotOptions(data.cornersDotOptions);
                } else {
                    setIsCornersDotGradient(false);
                    setCornersDotOptions(data.cornersDotOptions);
                }
                setIsDynamic(data.isDynamic);
                setExpiresAt(data.expiresAt ? new Date(data.expiresAt).toISOString().split("T")[0] : "");
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (token && id) fetchQRCode();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await fetch(`${baseUrl}/qrcodes/${id}`, {
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
                    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update QR Code");

            navigate(`/qrcodes/details/${id}`);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    if (loading || error) {
        return (
            <div className="grid grid-cols-3 h-[78vh] gap-8 mt-8">
                {/* Left: iPhone preview skeleton */}
                <div className="flex justify-center bg-[#F5F5F5]/80 rounded-2xl relative">
                    <Skeleton className="h-[calc(100vh-300px)] w-[200px] mt-32 rounded-xl" />


                    <div className="absolute top-[85%]">
                        <Skeleton className="h-16 w-80 rounded-xl" />
                    </div>
                </div>

                {/* Right: form skeleton */}
                <div className="bg-[#F5F5F5]/80 rounded-2xl p-8 col-span-2 gap-6 overflow-y-scroll custom-scrollbar">
                    {/* Name */}
                    <div className="mb-6">
                        <Skeleton className="h-6 w-28 mb-2" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>

                    {/* Content */}
                    {/* <div className="mb-6">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div> */}

                    {/* QR Colors */}
                    <div className="mb-6">
                        <Skeleton className="h-6 w-40 mb-3" />
                        <div className="flex gap-4">
                            <Skeleton className="h-20 w-40 rounded-lg" />
                            <Skeleton className="h-20 w-40 rounded-lg" />
                        </div>
                    </div>

                    {/* QR Style */}
                    <div className="mb-6">
                        <Skeleton className="h-6 w-28 mb-3" />
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 w-16 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Edges */}
                    <div className="mb-6">
                        <Skeleton className="h-6 w-20 mb-3" />
                        <div className="flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-16 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 md:h-[78vh] gap-4 md:gap-8 mt-4 md:mt-8">
            <div className="flex items-center justify-center col-span-1 bg-[#F5F5F5]/80 rounded-2xl relative">
                <img
                    src="/iphone-2.png"
                    alt="iPhone"
                    className="block max-h-[70vh] lg:h-[calc(100vh-280px)] object-contain mt-3 md:mt-30 w-auto min-w-[100px]"
                />

                <div
                    className="absolute flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 md:mt-16 bg-white"
                >
                    <CustomQRCode
                        data={`${window.location.origin}/qr/${shortCode}`}
                        size={220}
                        margin={0}
                        image={image}
                        backgroundOptions={backgroundOptions}
                        dotsOptions={dotsOptions}
                        cornersSquareOptions={cornersSquareOptions}
                        cornersDotOptions={cornersDotOptions}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={loading}
                    className={`absolute bottom-4 md:bottom-8 w-5/6 flex items-center justify-center bg-[#FFFFFF] text-[#036AFF] font-bold border-2 border-gray-900 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl ${loading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                        }`}
                >
                    <button
                        className={`text-2xl md:text-3xl lg:text-4xl xl:text-4xl px-1 py-3 font-bold rounded-lg`}
                    >
                        {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </button>
            </div>

            <div className="bg-[#F5F5F5]/80 rounded-2xl p-4 md:p-8 col-span-1 md:col-span-2 overflow-y-scroll custom-scrollbar">
                <div className="flex justify-between px-18 md:px-24 lg:px-32 xl:px-48 py-4 rounded-2xl text-xl flex-between border-b bg-white border-gray-300 mb-6">
                    <button
                        onClick={() => setSelectedTab("data")}
                        className={`font-semibold ${selectedTab === "data"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        DATA
                    </button>
                    <button
                        onClick={() => setSelectedTab("styles")}
                        className={`font-semibold ${selectedTab === "styles"
                            ? "text-blue-600 "
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        STYLES
                    </button>
                </div>

                <div className="">
                    <div className="">
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
                                <div className="mt-4 md:mt-8">
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

                                <div className="mt-4 md:mt-8 w-full">
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
                                                className={`flex p-2 bg-white items-center justify-center rounded-lg border-2 ${dotsOptions.type === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
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

                                    <div className="flex flex-col mt-4 md:mt-8">
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
                                                        className={`flex items-center justify-center bg-white p-2 rounded-lg border-2 ${cornersDotOptions.type === style.value ? "border-blue-500" : "border-transparent"} hover:border-gray-400`}
                                                    >
                                                        <div className="p-2">
                                                            <img src={style.icon} alt={style.label} className="" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-2xl w-full xl:w-1/2 mt-6">
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
        </div>
    )
}

export default EditQrCodeForm;