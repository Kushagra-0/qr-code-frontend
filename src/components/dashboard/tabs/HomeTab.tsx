import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../common/constant";
import { ArrowRight, Bookmark, Calendar } from "react-feather";
import { useAuth } from '../../../context/AuthContext';
import { QrCode } from '../../../interface/QrCode';
import CustomQRCode from '../../qrCodes/CustomQRCode';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Skeleton from '../../common/Skeletion';

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
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch QR codes");
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
                headers: { Authorization: `Bearer ${token}` },
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

    const scanChartData = Object.entries(scanAnalytics).map(([date, count]) => ({
        date,
        scans: count,
    }));

    if (authLoading || loading || error) {
        return (
            <div className="w-full h-full flex flex-col">
                <div className="flex justify-end items-center mb-5 shrink-0">
                    <Skeleton className="h-10 w-28 sm:h-12 sm:w-40 md:h-14 md:w-48 rounded-2xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow">
                    {/* Left Section Skeleton */}
                    <div className="grid grid-cols-1 grid-rows-4 gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="row-span-1 bg-white rounded-xl shadow px-6 py-6 flex flex-col">
                                <Skeleton className="h-4 w-1/2 sm:h-6 sm:w-1/3 mb-4" />
                                <Skeleton className="h-8 w-1/2 sm:h-12 sm:w-1/2" />
                            </div>
                            <div className="row-span-1 bg-white rounded-xl shadow px-6 py-6">
                                <Skeleton className="h-4 w-2/3 sm:h-6 sm:w-1/2 mb-4" />
                                <Skeleton className="h-3 w-3/4 sm:h-4" />
                                <Skeleton className="h-3 w-2/3 sm:h-4 mt-2" />
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-2 row-span-4 bg-white rounded-xl shadow px-6 py-6">
                            <Skeleton className="h-5 w-1/3 sm:h-6 sm:w-1/4 mb-6" />
                            <Skeleton className="h-40 sm:h-48 md:h-56 w-full" />
                        </div>
                    </div>

                    {/* Right Section Skeleton */}
                    <div className="flex flex-col gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow px-4 sm:px-6 py-4 relative">
                                <div className="flex flex-row gap-4">
                                    <Skeleton className="h-24 w-20 sm:h-28 sm:w-24 rounded-md" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 sm:h-6 w-2/3 sm:w-1/2 mb-2" />
                                        <Skeleton className="h-3 sm:h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-2 sm:h-3 w-1/3" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Skeleton className="h-7 w-16 sm:h-8 sm:w-20 md:h-9 md:w-24 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-end items-center mb-4 md:mb-5 shrink-0">
                <button
                    onClick={() => navigate("/qrcodes/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl md:text-2xl font-semibold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer"
                >
                    CREATE NEW
                </button>
            </div>

            <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 grow">
                {/* Left Section */}
                <div className="grid grid-cols-2 grid-rows-6 gap-4 md:gap-6">
                    <div className="row-span-2 bg-white rounded-xl shadow p-4 md:p-6">
                        <p className="text-xl sm:text-2xl font-semibold">TOTAL SCANS</p>
                        <p className="text-4xl sm:text-6xl mt-4 font-bold">{totalScans}</p>
                    </div>
                    <div className="row-span-2 bg-white rounded-xl shadow p-4 md:p-6">
                        <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-1">LATEST BLOG</p>
                    </div>
                    <div className="col-span-2 row-span-4 bg-white rounded-xl shadow p-4 md:p-6">
                        <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Scans Over Time</p>
                        <ResponsiveContainer width="100%" height={230} className="mt-6">
                            <LineChart data={scanChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="scans" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col gap-4 md:gap-6">
                    {recentQrs.length === 0 ? (
                        <></>
                    ) : (
                        recentQrs.map((qr) => (
                            <div key={qr._id} className="bg-white rounded-xl shadow px-4 sm:px-6 py-2 md:py-4 relative">
                                <div className="flex flex-row my-2">
                                    <div className="border self-center sm:self-auto">
                                        <CustomQRCode
                                            data={qr.isDynamic ? `${window.location.origin}/qr/${qr.shortCode}` : qr.content}
                                            size={100}
                                            margin={-1}
                                            image={qr.image}
                                            backgroundOptions={qr.backgroundOptions}
                                            dotsOptions={qr.dotsOptions}
                                            cornersSquareOptions={qr.cornersSquareOptions}
                                            cornersDotOptions={qr.cornersDotOptions}
                                        />
                                    </div>
                                    <div className="mx-4 flex-1 overflow-hidden mt-0">
                                        <p className="text-lg sm:text-xl text-gray-600 break-words line-clamp-2">
                                            {qr.name ? qr.name : <span className="text-gray-300">No Name</span>}
                                        </p>
                                        <div className="flex flex-row gap-4 text-gray-400 mt-1 items-center">
                                            <div className="flex flex-row text-xs gap-2">
                                                <Bookmark size={12} className="mt-0.5" />
                                                <p className="">{qr.type.charAt(0).toUpperCase() + qr.type.slice(1).toLowerCase()}</p>
                                            </div>
                                            <div className="hidden lg:flex flex-row text-xs gap-2">
                                                <Calendar size={12} className="mt-0.5" />
                                                <div>
                                                    {new Date(qr.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={() => navigate(`/qrcodes/details/${qr._id}`)}
                                        className="text-blue-600 flex font-bold px-2 sm:px-4 py-2 cursor-pointer rounded-xl border-2 border-gray-300 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] transition-shadow text-xs sm:text-sm"
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
