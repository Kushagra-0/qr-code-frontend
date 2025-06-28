import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { baseUrl } from "../../common/constant";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { Calendar, Download, Edit2, MoreVertical, PauseCircle, Trash2 } from "react-feather";
import { QrCode } from "../../interface/QrCode";
import { toJpeg, toPng, toSvg } from "html-to-image";
import jsPDF from "jspdf";

interface ShowQrCodeDetailsProps {
  id: string | undefined;
}

const ShowQrCodeDetails: React.FC<ShowQrCodeDetailsProps> = ({ id }) => {
  const { token } = useAuth();
  const [qrCode, setQrCode] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmPauseModel, setShowConfirmPauseModel] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [qrToDelete, setQrToDelete] = useState<QrCode | null>(null);
  const [qrToPause, setQrToPause] = useState<QrCode | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrRef = useRef(null);
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

  const handleDownload = async (format: string) => {
    if (!qrRef.current) return;

    const fileName = `qr-code-${qrCode?._id || "download"}`;

    try {
      switch (format) {
        case "png":
          const pngDataUrl = await toPng(qrRef.current);
          downloadImage(pngDataUrl, `${fileName}.png`);
          break;

        case "jpg":
          const jpgDataUrl = await toJpeg(qrRef.current);
          downloadImage(jpgDataUrl, `${fileName}.jpg`);
          break;

        case "svg":
          const svgDataUrl = await toSvg(qrRef.current);
          downloadImage(svgDataUrl, `${fileName}.svg`);
          break;

        case "pdf":
          const pdfDataUrl = await toPng(qrRef.current);
          const size = 200;
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [size, size],
          });
          pdf.addImage(pdfDataUrl, 'PNG', 0, 0, size, size);
          pdf.save(`${fileName}.pdf`);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Download error", error);
    }
  };

  const downloadImage = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  };

  if (loading) return <p>Loading...</p>;
  if (error || !qrCode) return <p className="text-red-500">{error || "QR Code not found."}</p>;

  return (
    <div className="grid grid-cols-4 grid-rows-4 mt-8 gap-8">

      <div className="col-span-1 row-span-2 bg-[#F5F5F5]/80 rounded-2xl flex justify-end relative pt-14">

        <img
          src="/iphone-medium.png"
          alt="iPhone"
          className="h-[calc(100vh-420px)] object-contain"
        />

        <div
          className="absolute top-[35%] right-[20%] bg-white flex justify-center items-center"
        >
          <div ref={qrRef} className="p-2 bg-white">
            <QRCodeSVG
              value={qrCode.isDynamic ? `${window.location.origin}/qrcodes/link/${qrCode._id}` : qrCode.content}
              size={200}
              fgColor={qrCode.color || "#000"}
              bgColor="#FFFFFF"
            />
          </div>
        </div>
      </div>


      <div className="col-span-3 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">
            {qrCode.content}
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

        <div className="flex flex-row justify-between items-center mt-4">
          <div className="flex flex-row gap-2">
            <Calendar size={20} className="mt-0.5" />
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

      <div className="col-span-1 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex justify-between">
        <div className={`${!qrCode.isDynamic ? "blur-sm pointer-events-none select-none" : ""}`}>
          <div className="flex flex-col">
            <div className="text-xl font-bold">TOTAL SCANS</div>
            {qrCode.isDynamic ?
              <>
                <div className="text-7xl mt-4">{qrCode.scanCount}</div>
              </>
              :
              <>
                <div className="text-7xl mt-4">82310</div>
              </>
            }
          </div>
        </div>
      </div>

      <div className="col-span-1 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex justify-between">
        <div className={`${!qrCode.isDynamic ? "blur-sm pointer-events-none select-none" : ""}`}>
          <div className="flex flex-col">
            <div className="text-xl font-bold">UNIQUE SCANS</div>

            {qrCode.isDynamic ?
              <>
                <div className="text-7xl mt-4">{qrCode.scanCount}</div>
              </>
              :
              <>
                <div className="text-7xl mt-4">52450</div>
              </>
            }
          </div>
        </div>

      </div>

      <div className="col-span-1 bg-[#F5F5F5]/80 rounded-2xl px-8 py-8 flex justify-between">
        <div className="flex flex-col w-full gap-6">
          <div id="qr-download-dropdown" className="relative">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-semibold px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(100,100,100,0.5)] cursor-pointer flex items-start gap-4"
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
            >
              <Download size={30} className="mt-1" />
              DOWNLOAD
            </button>

            {showDownloadDropdown && (
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
  );
};

export default ShowQrCodeDetails;
