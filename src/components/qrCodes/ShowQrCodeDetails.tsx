import "./styles/ScrollBar.css"

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { baseUrl } from "../../common/constant";
import { useNavigate } from "react-router-dom";
import { Calendar, Download, Edit2, Link, MoreVertical, PauseCircle, Trash2 } from "react-feather";
import { QrCode } from "../../interface/QrCode";
import CustomQRCode from "./CustomQRCode";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Skeleton from "../common/Skeletion";

interface ShowQrCodeDetailsProps {
  id: string | undefined;
}

const ShowQrCodeDetails: React.FC<ShowQrCodeDetailsProps> = ({ id }) => {
  const { token } = useAuth();
  const [qrCode, setQrCode] = useState<QrCode | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  // const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmPauseModel, setShowConfirmPauseModel] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [qrToDelete, setQrToDelete] = useState<QrCode | null>(null);
  const [qrToPause, setQrToPause] = useState<QrCode | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<any>(null);
  const navigation = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById("qr-option-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }

      const downloadDropdown = document.getElementById("qr-download-dropdown");
      if (downloadDropdown && !downloadDropdown.contains(e.target as Node)) {
        setShowDownloadDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const isModalOpen = showConfirmDeleteModal || showConfirmPauseModel;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfirmDeleteModal, showConfirmPauseModel]);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const res = await fetch(`${baseUrl}/qrcodes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch QR Code");
        }

        const data = await res.json();

        setQrCode(data);
      } catch (err) {
        console.error(err);
        setError("Error loading QR Code details.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchQrCode();
  }, [id, token]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${baseUrl}/qrcodes/analytics/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchAnalytics();
    }
  }, [id, token]);

  const confirmDeleteQr = async () => {
    if (!qrToDelete) return;

    try {
      const res = await fetch(`${baseUrl}/qrcodes/${qrToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete QR code");

      setShowConfirmDeleteModal(false);
      setQrToDelete(null);
      navigation("/dashboard?tab=qr")
    } catch (err) {
      console.error(err);
      alert("Error deleting QR code.");
    }
  };

  const confirmPauseQr = async () => {
    if (!qrToPause) return;

    try {
      const res = await fetch(`${baseUrl}/qrcodes/pause/${qrToPause._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to toggle pause");

      const updated = await res.json();
      setQrCode(updated.qrCode);
      setShowConfirmPauseModel(false);
      setQrToPause(null);
    } catch (err) {
      console.error(err);
      alert("Error toggling QR code status.");
    }
  };

  // const handleDownload = async (format: string) => {
  //   if (!qrRef.current) return;

  //   const fileName = `qr-code`;

  //   try {
  //     switch (format) {
  //       case "png":
  //         const pngDataUrl = await toPng(qrRef.current);
  //         downloadImage(pngDataUrl, `${fileName}.png`);
  //         break;

  //       case "jpg":
  //         const jpgDataUrl = await toJpeg(qrRef.current);
  //         downloadImage(jpgDataUrl, `${fileName}.jpg`);
  //         break;

  //       case "svg":
  //         const svgDataUrl = await toSvg(qrRef.current);
  //         downloadImage(svgDataUrl, `${fileName}.svg`);
  //         break;

  //       case "pdf":
  //         const pdfDataUrl = await toPng(qrRef.current);
  //         const size = 200;
  //         const pdf = new jsPDF({
  //           orientation: "portrait",
  //           unit: "mm",
  //           format: [size, size],
  //         });
  //         pdf.addImage(pdfDataUrl, 'PNG', 0, 0, size, size);
  //         pdf.save(`${fileName}.pdf`);
  //         break;

  //       default:
  //         break;
  //     }
  //   } catch (error) {
  //     console.error("Download error", error);
  //   }
  // };

  const handleDownload = async (format: "png" | "jpg" | "svg" | "pdf") => {
    if (!qrRef.current || isDownloading) return;

    setIsDownloading(true);
    setShowDownloadDropdown(false);

    try {
      await qrRef.current.download(format);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Error downloading ${format.toUpperCase()} file. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading || error || !qrCode || !analytics) {
    return (
      <div className="grid grid-cols-8 grid-rows-2 mt-8 gap-8 animate-pulse">
        {/* Left QR Preview Skeleton */}
        <div className="col-span-2 row-span-2 bg-gray-200 rounded-2xl flex justify-center items-center">
          <Skeleton className="w-40 h-40" />
        </div>

        {/* QR Details Skeleton */}
        <div className="col-span-6 bg-gray-200 rounded-2xl p-8 flex flex-col justify-between">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Stats Skeletons */}
        <div className="col-span-2 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-12 w-1/3" />
        </div>

        <div className="col-span-2 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-12 w-1/3" />
        </div>

        {/* Download/Edit Buttons */}
        <div className="col-span-2 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Chart Skeletons */}
        <div className="col-span-5 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-60 w-full" />
        </div>

        <div className="col-span-3 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-60 w-full" />
        </div>

        <div className="col-span-4 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-60 w-full" />
        </div>

        <div className="col-span-4 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-60 w-full" />
        </div>

        <div className="col-span-3 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-60 w-full" />
        </div>

        <div className="col-span-5 bg-gray-200 rounded-2xl p-8">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Transform data for charts
  const scanTimeData = Object.entries(analytics.charts.scansOverTime).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    scans: count
  }));

  const deviceData = Object.entries(analytics.charts.deviceTypes).map(([device, count]) => ({
    name: device.charAt(0).toUpperCase() + device.slice(1),
    value: count
  }));

  const browserData = Object.entries(analytics.charts.browsers).map(([browser, count]) => ({
    name: browser,
    value: count
  })).slice(0, 5);

  const countryData = Object.entries(analytics.charts.countries).map(([country, count]) => ({
    name: country,
    value: count
  })).slice(0, 5);

  const hourlyData = Object.entries(analytics.charts.hourlyDistribution).map(([hour, count]) => ({
    hour: `${hour}:00`,
    scans: count
  }));

  console.log(qrCode)

  return (
    <>
      <div className="grid grid-cols-8 grid-rows-2 mt-8 gap-8">
        <div className="col-span-2 row-span-2 bg-[#F5F5F5]/80 rounded-2xl flex justify-end relative pt-14">

          <img
            src="/iphone-medium.png"
            alt="iPhone"
            className="h-[calc(100vh-420px)] object-contain"
          />

          <div
            className="absolute top-[35%] right-[22%] bg-white flex justify-center items-center"
          >
            <div className="p-0">
              <CustomQRCode
                data={`${window.location.origin}/qr/${qrCode.shortCode}`}
                backgroundOptions={qrCode.backgroundOptions}
                size={200}
                margin={0}
                dotType={qrCode.dotType}
                dotColor={qrCode.dotColor}
                cornersSquareType={qrCode.cornersSquareType}
                cornersSquareColor={qrCode.cornersSquareColor}
                cornersDotType={qrCode.cornersDotType}
                cornersDotColor={qrCode.cornersDotColor}
              />
            </div>
          </div>
        </div>


        <div className="col-span-6 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <div className="text-3xl font-bold">
                {qrCode.name ? qrCode.name : <span className="text-gray-300">No Name</span>}
              </div>
              <button onClick={() => window.open(`${window.location.origin}/qr/${qrCode.shortCode}`, "_blank")} className="flex flex-row mt-7 gap-2 cursor-pointer">
                <Link size={14} className="mt-1.5" />
                <div className="">
                  {`${window.location.origin}/qr/${qrCode.shortCode}`}
                </div>
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div id="qr-option-dropdown" className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-600 hover:text-gray-800 font-bold cursor-pointer"
                >
                  <MoreVertical />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg z-10 shadow-[0_0_20px_rgba(100,100,100,0.5)]">
                    <button
                      onClick={() => {
                        setQrToPause(qrCode);
                        setShowConfirmPauseModel(true);
                        setIsDropdownOpen(false);
                      }}
                      disabled={!qrCode.isDynamic}
                      className={`w-full text-left px-4 py-2 text-sm flex flex-row gap-2 ${qrCode.isDynamic ? "hover:bg-gray-100 text-black" : "text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      <PauseCircle size={15} className="mt-0.5" />
                      <div>
                        {qrCode.isPaused ? "Resume" : "Pause"}
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setQrToDelete(qrCode);
                        setShowConfirmDeleteModal(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 flex flex-row gap-2"
                    >
                      <Trash2 size={15} className="mt-0.5" />
                      <div>
                        Delete
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
              <Calendar size={14} className="mt-1.5" />
              <div>
                {new Date(qrCode.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="bg-white px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(100,100,100,0.5)] text-[#036AFF] font-bold">
              {qrCode.isDynamic ? (
                qrCode.isPaused ? (
                  <span className="text-red-500">🛑 DYNAMIC • PAUSED</span>
                ) : (
                  <span className="text-green-500">✅ DYNAMIC • ACTIVE</span>
                )
              ) : (
                <span className="text-gray-500">📎 STATIC</span>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex justify-between">
          <div className={`${!qrCode.isDynamic ? "blur-sm pointer-events-none select-none" : ""}`}>
            <div className="flex flex-col">
              <div className="text-xl font-bold">TOTAL SCANS</div>
              {qrCode.isDynamic ?
                <>
                  <div className="text-7xl mt-4">{analytics.summary.totalScans}</div>
                </>
                :
                <>
                  <div className="text-7xl mt-4">82310</div>
                </>
              }
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex justify-between">
          <div className={`${!qrCode.isDynamic ? "blur-sm pointer-events-none select-none" : ""}`}>
            <div className="flex flex-col">
              <div className="text-xl font-bold">UNIQUE SCANS</div>

              {qrCode.isDynamic ?
                <>
                  <div className="text-7xl mt-4">{analytics.summary.uniqueVisitors}</div>
                </>
                :
                <>
                  <div className="text-7xl mt-4">52450</div>
                </>
              }
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex justify-between">
          <div className="flex flex-col w-full gap-6">
            <div id="qr-download-dropdown" className="relative">
              <button
                className={`w-full text-white text-3xl font-semibold px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer flex items-start gap-4 transition-colors ${isDownloading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                onClick={() => !isDownloading && setShowDownloadDropdown(!showDownloadDropdown)}
                disabled={isDownloading}
              >
                <Download size={30} className="mt-1" />
                {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD'}
              </button>

              {showDownloadDropdown && !isDownloading && (
                <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg z-10 shadow-[0_0_20px_rgba(100,100,100,0.5)] w-full">
                  <button
                    onClick={() => handleDownload("png")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => handleDownload("jpg")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Download JPG
                  </button>
                  <button
                    onClick={() => handleDownload("svg")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Download SVG
                  </button>
                  <button
                    onClick={() => handleDownload("pdf")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => navigation(`/qrcodes/edit/${qrCode._id}`)}
              className={`w-full text-3xl font-semibold px-4 py-2 rounded-xl flex items-start gap-4 transition-all duration-300 ${qrCode.isDynamic
                ? "hover:bg-blue-600 hover:text-white text-blue-600 cursor-pointer hover:shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              disabled={!qrCode.isDynamic}
            >
              <Edit2 size={30} className="mt-1" />
              EDIT
            </button>
          </div>
        </div>

        <div className="col-span-5 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Scans Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scanTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="scans" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-3 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Device Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-4 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Top Browsers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={browserData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-4 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-3 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Hourly Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-5 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-6 overflow-y-scroll h-72 custom-scrollbar pr-2">
            {analytics.recentActivity.map((scan: any, index: any) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{scan.city}, {scan.country}</p>
                    <p className="text-sm text-gray-500">{scan.deviceType} • {scan.browser}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(scan.scannedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showConfirmDeleteModal && qrToDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 shadow-[0_0_20px_rgba(100,100,100,0.5)]">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
              <p className="mb-8">
                Are you sure you want to delete this QR code? You will loose all the data related to it.
              </p>
              <div className="flex justify-end gap-6">
                <button
                  onClick={() => {
                    setShowConfirmDeleteModal(false);
                    setQrToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteQr}
                  className={`px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 cursor-pointer`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmPauseModel && qrToPause && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 shadow-[0_0_20px_rgba(100,100,100,0.5)]">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
              <p className="mb-8">
                Are you sure you want to {qrToPause.isPaused ? "resume" : "pause"} this QR code?
              </p>
              <div className="flex justify-end gap-6">
                <button
                  onClick={() => {
                    setShowConfirmPauseModel(false);
                    setQrToPause(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPauseQr}
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  {qrToPause.isPaused ? "Resume" : "Pause"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowQrCodeDetails;
