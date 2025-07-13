import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../common/constant";

const QrRedirect = () => {
    const { shortCode } = useParams();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchQr = async () => {
            try {
                const res = await fetch(`${baseUrl}/qrcodes/redirect/${shortCode}`, {
                    method: "GET",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Invalid response from server.");
                }

                // Safe redirect
                window.location.href = data.url;
            } catch (err) {
                console.error(err);
                alert("QR Code not found or server error.");
            }
        };

        fetchQr();
    }, [shortCode]);

    return (
        <div className="h-screen flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-700">Redirecting...</p>
        </div>
    );
};

export default QrRedirect;
