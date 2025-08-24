import "./styles/ScrollBar.css"

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
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [dotType, setDotType] = useState<any>("");
    const [dotColor, setDotColor] = useState("#000000");
    const [cornersSquareType, setCornersSquareType] = useState<any>("");
    const [cornersSquareColor, setCornersSquareColor] = useState("#000000");
    const [cornersDotType, setCornersDotType] = useState<any>("");
    const [cornersDotColor, setCornersDotColor] = useState("#000000");
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
                setBackgroundColor(data.backgroundColor || "#ffffff");
                setDotType(data.dotType);
                setDotColor(data.dotColor)
                setCornersSquareType(data.cornersSquareType);
                setCornersSquareColor(data.cornersSquareColor);
                setCornersDotType(data.cornersDotType);
                setCornersDotColor(data.cornersDotColor);
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
                    backgroundColor,
                    dotType,
                    typeData,
                    dotColor,
                    cornersSquareType,
                    cornersSquareColor,
                    cornersDotType,
                    cornersDotColor,
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
        <div className="grid grid-cols-3 h-[78vh] gap-8 mt-8">
            <div className="flex justify-center bg-[#F5F5F5]/80 rounded-2xl relative">
                <img
                    src="/iphone.png"
                    alt="iPhone"
                    className="h-[calc(100vh-300px)] object-contain mt-32"
                />

                <div
                    className="absolute top-[42%] right-[28%] bg-white flex justify-center items-center"
                >
                    <div className="p-0" style={{ backgroundColor }}>
                        <CustomQRCode
                            data={`${window.location.origin}/qr/${shortCode}`}
                            bgColor={backgroundColor}
                            size={220}
                            margin={0}
                            dotType={dotType}
                            dotColor={dotColor}
                            cornersSquareType={cornersSquareType}
                            cornersSquareColor={cornersSquareColor}
                            cornersDotType={cornersDotType}
                            cornersDotColor={cornersDotColor}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={loading}
                    className={`absolute top-[85%] flex items-center justify-center bg-[#FFFFFF] text-[#036AFF] font-bold px-16 py-2 border-2 border-gray-900 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl ${loading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                        }`}
                >
                    <button
                        className={`text-4xl font-bold rounded-lg`}
                    >
                        {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </button>
            </div>

            <div className="bg-[#F5F5F5]/80 rounded-2xl p-8 col-span-2 gap-6 overflow-y-scroll custom-scrollbar">
                <div className="flex justify-between px-48 py-4 rounded-2xl text-xl flex-between border-b bg-white border-gray-300 mb-6">
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
                </div>
            </div>
        </div>
    )
}

export default EditQrCodeForm;