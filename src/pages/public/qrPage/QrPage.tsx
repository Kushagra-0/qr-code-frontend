import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../common/constant";
import { Download } from "react-feather";

// interface QrData {
//   type: string;
//   data: any;
// }

const QrPage = () => {
  const { shortCode } = useParams();
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQrData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/qrcodes/public/${shortCode}`);
        setQrData(res.data);
      } catch (err) {
        console.error("Failed to fetch QR data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQrData();
  }, [shortCode]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!qrData) {
    return <div className="flex items-center justify-center h-screen">QR Code not found</div>;
  }

  console.log(qrData)

  const renderPreview = () => {
    switch (qrData.type) {
      case "URL":
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Website Link</h1>
            <a href={qrData.data.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {qrData.data.url}
            </a>
          </div>
        );

      case "PDF":
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">PDF Preview</h1>

            {/* This will embed the PDF in the page */}
            <object
              data={qrData.typeData?.pdfUrl || qrData.data?.pdfUrl}
              type="application/pdf"
              width="100%"
              height="80vh"
            >
              <p>
                PDF preview not available. You can{" "}
                <a
                  href={qrData.typeData?.pdfUrl || qrData.data?.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  download it here
                </a>
                .
              </p>
            </object>

            <a
              href={qrData.typeData?.pdfUrl || qrData.data?.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Open/Download PDF
            </a>
          </div>
        );

      case "IMAGE":
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Image Preview</h1>
            <img src={qrData.typeData.imageUrl} alt="QR Data" className="max-h-[70vh] rounded-lg shadow" />
          </div>
        );

      case "TEXT":
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Text Content</h1>
            <p className="text-gray-700">{qrData.typeData.textContent}</p>
          </div>
        );

      case "AUDIO":
        return (
          <div className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-xl font-semibold">Audio Preview</h2>

            {/* Audio player */}
            <audio controls className="w-full max-w-md">
              <source src={qrData.typeData.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            {/* Download button */}
            <a
              href={qrData.typeData.audioUrl}
              download
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            >
              <Download size={18} /> Download
            </a>
          </div>
        );





      default:
        return <p>Unsupported QR type</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        {renderPreview()}
      </div>
    </div>
  );
};

export default QrPage;
