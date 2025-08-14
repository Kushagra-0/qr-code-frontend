import './styles/ScrollBar.css'

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../common/constant";
import { ArrowRight, Search } from "react-feather";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from '../../../context/AuthContext';
import { QrCode } from '../../../interface/QrCode';
import CustomQRCode from '../../qrCodes/CustomQRCode';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const HomeTab = () => {
    const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
    const [scanAnalytics, setScanAnalytics] = useState<{ [date: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            fetchUserScanAnalytics();
        }
    }, []);

    const fetchUserScanAnalytics = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${baseUrl}/qrcodes/user/analytics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch scan analytics");
            const data = await res.json();
            setScanAnalytics(data.scansOverTime);
        } catch (err) {
            console.error(err);
        }
    };

    const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.scanCount || 0), 0);
    const recentQrs = [...qrCodes]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

    if (authLoading || loading) return <p>Loading QR codes...</p>;
    //   if (error) return <p className="text-red-500">{error}</p>;

    const scanChartData = Object.entries(scanAnalytics).map(([date, count]) => ({
        date,
        scans: count,
    }));

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-end items-center mb-5 shrink-0">
                {/* <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-2 py-1">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-2 py-1 text-lg bg-transparent focus:outline-none"
                    />
                    <Search size={20} className="text-gray-500 mr-2" />
                </div> */}
                <button
                    onClick={() => navigate("/qrcodes/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-semibold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer"
                >
                    CREATE NEW
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 grow">
                {/* Left Section */}
                <div className="grid grid-cols-2 grid-rows-6 gap-6">
                    {/* Total Scans */}
                    <div className="row-span-2 bg-white rounded-xl shadow px-6 py-6">
                        <p className="text-2xl font-semibold">TOTAL SCANS</p>
                        <p className="text-6xl mt-4 font-bold">{totalScans}</p>
                    </div>

                    {/* Blog Article */}
                    <div className="row-span-2 bg-white rounded-xl shadow px-6 py-6">
                        <p className="text-2xl font-semibold text-gray-700 mb-1">LATEST BLOG</p>
                    </div>

                    <div className="col-span-2 row-span-4 bg-white rounded-xl max-h-[93%] shadow px-6 py-6">
                        {/* <p className="text-2xl font-semibold text-gray-700 mb-4">Recent Blog Article</p>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">How QR Codes Are Transforming Marketing</h3>
                        <p className="text-gray-600 mb-4">Explore how businesses are leveraging QR codes to streamline user engagement and track campaign success.</p> */}
                        <p className="text-2xl font-semibold text-gray-700 mb-2">Scans Over Time</p>
                        <ResponsiveContainer width="90%" height={230} className="mt-6">
                            <LineChart data={scanChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="scans" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* <div className="col-span-2 row-span-4 bg-white rounded-xl shadow px-4 py-4">
                        <p className="text-2xl font-semibold text-gray-700 mb-2">Scans Over Time</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={scanChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="scans" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div> */}
                </div>

                {/* Right Section (Recent QR Codes) */}
                <div className="flex flex-col gap-6 overflow-visible">
                    {recentQrs.length === 0 ? (
                        <p>No recent QR codes found.</p>
                    ) : (
                        recentQrs.map((qr) => (
                            <div
                                key={qr._id}
                                className="bg-white rounded-xl shadow px-6 py-4 relative"
                            >
                                {/* Content area with padding-bottom to avoid overlap with button */}
                                <div className="pr-6">
                                    <div className="flex flex-row my-2">
                                        <div className='border' style={{ backgroundColor: qr.backgroundColor }}>
                                            <CustomQRCode
                                                data={qr.isDynamic ? `${window.location.origin}/qr/${qr.shortCode}` : qr.content}
                                                fgColor={qr.foregroundColor}
                                                bgColor={qr.backgroundColor}
                                                size={100}
                                                margin={-1}
                                                dotType={qr.dotType}
                                                dotColor={qr.dotColor}
                                                cornersSquareType={qr.cornersSquareType}
                                                cornersSquareColor={qr.cornersSquareColor}
                                                cornersDotType={qr.cornersDotType}
                                                cornersDotColor={qr.cornersSquareColor}
                                            />
                                        </div>
                                        <div className="mx-4 flex-1 overflow-hidden">
                                            <p className="text-xl text-gray-600 mt-2 break-words line-clamp-2">{qr.name}</p>
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
                                </div>

                                {/* Bottom-right button absolutely placed */}
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={() => navigate(`/qrcodes/details/${qr._id}`)}
                                        className="text-blue-600 flex font-bold px-4 py-2 cursor-pointer rounded-xl border-2 border-gray-300 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] transition-shadow text-sm"
                                    >
                                        DETAILS
                                        <div className="mt-0.5 ml-1">
                                            <ArrowRight size={18} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
