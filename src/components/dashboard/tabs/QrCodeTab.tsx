// import './styles/ScrollBar.css'

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../common/constant";
import { ArrowLeft, ArrowRight, Calendar, Link, Search } from "react-feather";
import { useAuth } from '../../../context/AuthContext';
import { QrCode } from '../../../interface/QrCode';
import CustomQRCode from '../../qrCodes/CustomQRCode';
import Skeleton from '../../common/Skeletion';

const QrCodeTab = () => {
    const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { token, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const qrsPerPage = 10;

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
        (qr.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredQrs.length / qrsPerPage);
    const startIndex = (currentPage - 1) * qrsPerPage;
    const paginatedQrs = filteredQrs.slice(startIndex, startIndex + qrsPerPage);

    if (authLoading || loading) {
        return (
            <div className="w-full h-full flex flex-col">
                {/* Header skeleton */}
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-2xl" />
                </div>

                {/* QR list skeleton */}
                <div className="overflow-y-auto pr-3 space-y-4 grow mt-2 custom-scrollbar">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow px-6 py-4 flex justify-between items-center relative"
                        >
                            {/* QR preview + text */}
                            <div className="flex flex-row gap-4">
                                <Skeleton className="h-24 w-24 rounded-md" />
                                <div className="flex flex-col gap-2 mt-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-60" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>

                            {/* Scan count box */}
                            <div className="absolute middle-0 right-50 rounded-lg border-2 border-gray-200 px-5 py-7">
                                <Skeleton className="h-6 w-10 mb-2" />
                                <Skeleton className="h-3 w-12" />
                            </div>

                            {/* Right-side buttons */}
                            <div className="flex items-end mb-4 gap-8 flex-col">
                                <Skeleton className="h-8 w-40 rounded-lg" />
                                <Skeleton className="h-10 w-40 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 justify-between bg-white border border-gray-300 rounded-xl px-2 py-1 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-2 py-1 text-sm md:text-lg bg-transparent focus:outline-none"
                    />
                    <Search size={20} className="text-gray-500 mr-2" />
                </div>
                <button
                    onClick={() => navigate("/qrcodes/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-2xl font-semibold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer w-full md:w-auto"
                >
                    CREATE NEW
                </button>
            </div>

            {/* Scrollable QR list */}
            <div className="overflow-y-auto pr-3 space-y-4 grow mt-4 md:mt-2 custom-scrollbar">
                {paginatedQrs.length === 0 ? (
                    // <p>No QR codes found.</p>    
                    <></>
                ) : (
                    paginatedQrs.map((qr) => (
                        <div
                            key={qr._id}
                            className="bg-white rounded-xl shadow px-6 py-3 flex justify-between items-center relative"
                        >
                            <div className='flex flex-row my-2'>
                                <div className='border border-gray-300'>
                                    <CustomQRCode
                                        data={`${window.location.origin}/qr/${qr.shortCode}`}
                                        size={100}
                                        margin={0}
                                        image={qr.image}
                                        backgroundOptions={qr.backgroundOptions}
                                        dotsOptions={qr.dotsOptions}
                                        cornersSquareOptions={qr.cornersSquareOptions}
                                        cornersDotOptions={qr.cornersDotOptions}
                                    />
                                </div>
                                <div className='mx-4'>
                                    <p className="text-lg sm:text-xl text-gray-700 mt-2">{qr.name ? qr.name : <span className='text-gray-300'>No Name</span>}</p>
                                    <button onClick={() => window.open(`${window.location.origin}/qr/${qr.shortCode}`, "_blank")} className="hidden lg:flex flex-row text-sm text-gray-600 mt-3 gap-2 cursor-pointer ">
                                        <Link size={12} className="mt-1" />
                                        <div className="">
                                            {`${window.location.origin}/qr/${qr.shortCode}`}
                                        </div>
                                    </button>
                                    <div className="flex flex-row text-xs text-gray-400 gap-2 mt-2">
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
                            <div className='hidden lg:flex flex-col absolute middle-0 right-50 rounded-lg border-2 border-gray-200 px-5 py-7'>
                                <div className='text-2xl font-medium'>
                                    {qr.scanCount}
                                </div>
                                <div className='text-xs'>
                                    SCANS
                                </div>
                            </div>
                            <div className="flex items-end mb-20 gap-8 flex-col">
                                <div className="hidden lg:flex bg-white w-40 items-center justify-center px-2 py-1 rounded-lg border-2 border-gray-200 text-[#036AFF] font-bold">
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
                                    className="absolute bottom-5.5 right-6 w-40 text-blue-600 hover:text-blue-700 border-2 border-gray-300 hover:border-gray-200 hover:shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl p-0 lg:p-4 font-bold cursor-pointer flex flex-row items-center justify-center text-lg lg:text-xl"
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

            {filteredQrs.length > qrsPerPage && (
                <div className="flex justify-end items-center gap-4 mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="p-1 rounded-full border bg-white shadow disabled:opacity-50"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="p-1 rounded-full border bg-white shadow disabled:opacity-50"
                    >
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default QrCodeTab;
