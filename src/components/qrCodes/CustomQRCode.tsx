import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling from "qr-code-styling";

export interface CustomQRCodeHandle {
    download: (extension: "png" | "jpg" | "svg" | "pdf") => Promise<void>;
}

interface CustomQRCodeProps {
    data: string;
    margin?: number;
    size?: number;
    style?: React.CSSProperties;
    dotType?: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
    dotColor?: string;
    cornersSquareType?: 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded';
    cornersSquareColor?: string;
    cornersDotType?: 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
    cornersDotColor?: string;
    backgroundOptions?: {
        color?: string;
        gradient?: {
            type: "linear" | "radial";
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
    };
}

const CustomQRCode = forwardRef<CustomQRCodeHandle, CustomQRCodeProps>(({
    data,
    size = 100,
    style,
    margin = 0,
    dotType = "square",
    dotColor = "#000000",
    cornersSquareType = "square",
    cornersSquareColor = "#000000",
    cornersDotType = "square",
    cornersDotColor = "#000000",
    backgroundOptions,
}, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    // Initialize once
    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: size,
            height: size,
            margin,
            data,
            type: "svg",
            backgroundOptions: backgroundOptions,
            dotsOptions: {
                type: dotType,
                color: dotColor,
            },
            cornersSquareOptions: {
                type: cornersSquareType,
                color: cornersSquareColor,
            },
            cornersDotOptions: {
                type: cornersDotType,
                color: cornersDotColor,
            },
        });

        if (divRef.current) {
            qrCode.current.append(divRef.current);
        }

        return () => {  
            if (divRef.current) divRef.current.innerHTML = "";
        };
    }, []); // Init only once

    // Update QR Code on props change
    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update({
                data,
                width: size,
                height: size,
                margin,
                backgroundOptions: backgroundOptions,
                dotsOptions: {
                    type: dotType,
                    color: dotColor,
                },
                cornersSquareOptions: {
                    type: cornersSquareType,
                    color: cornersSquareColor,
                },
                cornersDotOptions: {
                    type: cornersDotType,
                    color: cornersDotColor,
                },      
            });
        }
    }, [data, size, margin, backgroundOptions, dotType, dotColor, cornersSquareType, cornersSquareColor, cornersDotType, cornersDotColor]);

    // Expose download method via ref
    useImperativeHandle(ref, () => ({
        download: async (extension: "png" | "jpg" | "svg" | "pdf") => {
            if (!qrCode.current) return;

            const fileName = `qr-code`;

            try {
                switch (extension) {
                    case "png":
                        await qrCode.current.download({
                            name: fileName,
                            extension: "png"
                        });
                        break;

                    case "jpg":
                        await qrCode.current.download({
                            name: fileName,
                            extension: "jpeg"
                        });
                        break;

                    case "svg":
                        await qrCode.current.download({
                            name: fileName,
                            extension: "svg"
                        });
                        break;

                    case "pdf":
                        // For PDF, we need to create it manually since QRCodeStyling doesn't support PDF directly
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;

                        // Set high DPI for better quality
                        const dpi = 300;
                        const scaleFactor = dpi / 96; // 96 DPI is default
                        const scaledSize = size * scaleFactor;

                        canvas.width = scaledSize;
                        canvas.height = scaledSize;

                        // Scale the context to match the DPI
                        ctx.scale(scaleFactor, scaleFactor);

                        // await qrCode.current.drawCanvas(ctx);

                        const dataUrl = canvas.toDataURL('image/png');

                        // Dynamically import jsPDF to avoid bundle issues
                        const { default: jsPDF } = await import('jspdf');

                        const sizeInMm = 100; // 100mm x 100mm
                        const pdf = new jsPDF({
                            orientation: "portrait",
                            unit: "mm",
                            format: [sizeInMm, sizeInMm],
                        });

                        pdf.addImage(dataUrl, 'PNG', 0, 0, sizeInMm, sizeInMm);
                        pdf.save(`${fileName}.pdf`);
                        break;
                }
            } catch (error) {
                console.error("Download error:", error);
                throw error;
            }
        }
    }));

    return (
        <div
            ref={divRef}
            style={{ width: size, height: size, ...style }}
        />
    );
});

CustomQRCode.displayName = 'CustomQRCode';

export default CustomQRCode;