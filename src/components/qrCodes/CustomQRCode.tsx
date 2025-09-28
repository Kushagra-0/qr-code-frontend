import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling from "qr-code-styling";
import jsPDF from "jspdf";

export interface CustomQRCodeHandle {
    download: (extension: "png" | "jpg" | "svg" | "pdf") => Promise<void>;
}

interface CustomQRCodeProps {
    data: string;
    margin?: number;
    size?: number;
    style?: React.CSSProperties;
    image?: string;
    backgroundOptions?: {
        color?: string;
        gradient?: {
            type: "linear" | "radial";
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
    };
    dotsOptions?: {
        color?: string;
        gradient?: {
            type: "linear" | "radial";
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
        type: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
    }
    cornersSquareOptions?: {
        color?: string;
        gradient?: {
            type: "linear" | "radial";
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
        type: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
    }
    cornersDotOptions?: {
        color?: string;
        gradient?: {
            type: "linear" | "radial";
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
        type: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
    }
}

const CustomQRCode = forwardRef<CustomQRCodeHandle, CustomQRCodeProps>(({
    data,
    size = 100,
    style,
    margin = 0,
    image,
    backgroundOptions,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions
}, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    const preloadImage = (url: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.crossOrigin = "anonymous"; // Important for S3 images
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    // Initialize once
    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: size,
            height: size,
            margin,
            data,
            type: "svg",
            // image: image || undefined,
            backgroundOptions: backgroundOptions,
            dotsOptions: dotsOptions,
            cornersSquareOptions: cornersSquareOptions,
            cornersDotOptions: cornersDotOptions
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
                image: image,
                backgroundOptions: backgroundOptions,
                dotsOptions: dotsOptions,
                cornersSquareOptions: cornersSquareOptions,
                cornersDotOptions: cornersDotOptions
            });
        }
    }, [data, size, margin, image, backgroundOptions, dotsOptions, cornersSquareOptions, cornersDotOptions]);

    // Expose download method via ref
    useImperativeHandle(ref, () => ({
        download: async (extension: "png" | "jpg" | "svg" | "pdf") => {
            if (!qrCode.current) return;

            const downloadSize = 1024;

            const tempQRCode = new QRCodeStyling({
                width: downloadSize,
                height: downloadSize,
                margin,
                data,
                type: "svg", // Always generate as SVG first for best scaling
                image: image || undefined,
                backgroundOptions: backgroundOptions,
                dotsOptions: dotsOptions,
                cornersSquareOptions: cornersSquareOptions,
                cornersDotOptions: cornersDotOptions
            });

            const fileName = `qr-code`;

            try {
                switch (extension) {
                    case "png":
                        await tempQRCode.download({
                            name: fileName,
                            extension: "png"
                        });
                        break;

                    case "jpg":
                        await tempQRCode.download({
                            name: fileName,
                            extension: "jpeg"
                        });
                        break;

                    case "svg":
                        await tempQRCode.download({
                            name: fileName,
                            extension: "svg"
                        });
                        break;

                    case "pdf":
                        const pngBlob = await tempQRCode.getRawData("png");
                        if (!pngBlob) {
                            console.error("Failed to generate QR code PNG data for PDF");
                            throw new Error("Failed to generate QR code image");
                        }
                        try {
                            const pngDataUrl = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result as string);
                                reader.onerror = () => reject(new Error("Failed to read PNG data"));
                                reader.readAsDataURL(pngBlob);
                            });

                            const pdf = new jsPDF({
                                orientation: "portrait",
                                unit: "px",
                                format: [downloadSize + margin * 2, downloadSize + margin * 2]
                            });
                            pdf.addImage(pngDataUrl, "PNG", margin, margin, downloadSize, downloadSize);
                            pdf.save(`${fileName}.pdf`);
                        } catch (pdfError) {
                            console.error("PDF generation error:", pdfError);
                            console.warn("Falling back to PNG download due to PDF generation failure");
                            await tempQRCode.download({
                                name: fileName,
                                extension: "png"
                            });
                        }
                        break;
                    // // Check for browser compatibility
                    // if (!window.Blob || !window.URL || !window.URL.createObjectURL) {
                    //     console.error("Browser does not support required APIs for PDF generation");
                    //     throw new Error("Browser does not support PDF generation");
                    // }

                    // // Get QR code as PNG Blob
                    // const pngBlob = await qrCode.current.getRawData("png");
                    // if (!pngBlob) {
                    //     console.error("Failed to generate QR code PNG data");
                    //     throw new Error("Failed to generate QR code image");
                    // }

                    // try {
                    //     // Convert Blob to data URL
                    //     const pngDataUrl = await new Promise<string>((resolve, reject) => {
                    //         const reader = new FileReader();
                    //         reader.onload = () => resolve(reader.result as string);
                    //         reader.onerror = () => reject(new Error("Failed to read PNG data"));
                    //         reader.readAsDataURL(pngBlob);
                    //     });

                    //     // Create new jsPDF instance
                    //     const pdf = new jsPDF({
                    //         orientation: "portrait",
                    //         unit: "px",
                    //         format: [size + margin * 2, size + margin * 2]
                    //     });

                    //     // Add QR code image to PDF
                    //     pdf.addImage(pngDataUrl, "PNG", margin, margin, size, size);

                    //     // Save PDF
                    //     pdf.save(`${fileName}.pdf`);
                    // } catch (pdfError) {
                    //     console.error("PDF generation error:", pdfError);
                    //     // Fallback to PNG download
                    //     console.warn("Falling back to PNG download due to PDF generation failure");
                    //     await qrCode.current.download({
                    //         name: fileName,
                    //         extension: "png"
                    //     });
                    // }
                    // break;
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