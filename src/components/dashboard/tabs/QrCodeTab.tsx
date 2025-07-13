import './styles/ScrollBar.css'

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../common/constant";
import { ArrowRight, Search } from "react-feather";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from '../../../context/AuthContext';
import { QrCode } from '../../../interface/QrCode';
import CustomQRCode from '../../qrCodes/CustomQRCode';

const QrCodeTab = () => {
    const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { token, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const fetchQrCodes = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await fetch(`${baseUrl}/qrcodes/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch QR codes");
            }

            const data = await res.json();
            setQrCodes(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch QR codes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchQrCodes();
        }
    }, []);

    const filteredQrs = qrCodes.filter(qr =>
        qr.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || loading) return <p>Loading QR codes...</p>;
    //   if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-2 py-1">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-2 py-1 text-lg bg-transparent focus:outline-none"
                    />
                    <Search size={20} className="text-gray-500 mr-2" />
                </div>
                <button
                    onClick={() => navigate("/qrcodes/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-semibold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer"
                >
                    CREATE NEW
                </button>
            </div>

            {/* Scrollable QR list */}
            <div className="overflow-y-auto pr-3 space-y-4 grow mt-2 custom-scrollbar">
                {filteredQrs.length === 0 ? (
                    <p>No QR codes found.</p>
                ) : (
                    filteredQrs.map((qr) => (
                        <div
                            key={qr._id}
                            className="bg-white rounded-xl shadow px-6 py-4 flex justify-between items-center relative"
                        >
                            <div className='flex flex-row my-2'>
                                <div className='border border-gray-300' style={{ backgroundColor: qr.backgroundColor }}>
                                    <CustomQRCode
                                        data={qr.isDynamic ? `${window.location.origin}/qr/${qr.shortCode}` : qr.content}
                                        fgColor={qr.foregroundColor}
                                        bgColor={qr.backgroundColor}
                                        size={100}
                                        margin={0}
                                        dotType={qr.dotType}
                                        dotColor={qr.dotColor}
                                        cornersSquareType={qr.cornersSquareType}
                                        cornersSquareColor={qr.cornersSquareColor}
                                        cornersDotType={qr.cornersDotType}
                                        cornersDotColor={qr.cornersDotColor}
                                    />
                                </div>
                                <div className='mx-4'>
                                    <p className="text-xl text-gray-600 mt-2">{qr.name}</p>
                                    <p className="text-md text-gray-600 mt-1">{qr.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(qr.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className='absolute middle-0 right-50 rounded-lg border-2 border-gray-200 px-5 py-7'>
                                <div className='text-2xl font-medium'>
                                    {qr.scanCount}
                                </div>
                                <div className='text-xs'>
                                    SCANS
                                </div>
                            </div>
                            <div className="flex items-end mb-20 gap-8 flex-col">
                                <div className="bg-white w-40 flex items-center justify-center px-2 py-1 rounded-lg border-2 border-gray-200 text-[#036AFF] font-bold">
                                    {qr.isDynamic ? (
                                        qr.isPaused ? (
                                            <div className="text-red-500 text-xs">🛑 DYNAMIC • PAUSED</div>
                                        ) : (
                                            <span className="text-green-500 text-xs">✅ DYNAMIC • ACTIVE</span>
                                        )
                                    ) : (
                                        <span className="text-gray-500 text-xs">📎 STATIC</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate(`/qrcodes/details/${qr._id}`)}
                                    className="absolute bottom-5.5 right-6 w-40 text-blue-600 hover:text-blue-700 border-2 border-gray-300 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl px-4 py-4 font-bold cursor-pointer flex flex-row items-center justify-center text-xl"
                                >
                                    <div>DETAILS</div>
                                    <div className="ml-1 mt-1">
                                        <ArrowRight size={18} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QrCodeTab;
