import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface CustomQRCodeProps {
    data: string;
    margin?: number;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    style?: React.CSSProperties;
    dotType?: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
    dotColor?: string;
    cornersSquareType?: 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded';
    cornersSquareColor?: string;
    cornersDotType?: 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
    cornersDotColor?: string;
}

const CustomQRCode: React.FC<CustomQRCodeProps> = ({
    data,
    size = 100,
    bgColor = "#ffffff",
    fgColor = "#000000",
    style,
    margin = 0,
    dotType = "square",
    dotColor = "#000000",
    cornersSquareType = "square",
    cornersSquareColor = "#000000",
    cornersDotType = "square",
    cornersDotColor = "#000000",
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    // Initialize once
    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: size,
            height: size,
            margin,
            data,
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
            backgroundOptions: {
                color: bgColor,
            },
        });

        if (ref.current) {
            qrCode.current.append(ref.current);
        }

        return () => {
            if (ref.current) ref.current.innerHTML = "";
        };
    }, []); // 🔹 Init only once

    // Update QR Code on props change
    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update({
                data,
                width: size,
                height: size,
                margin,
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
                backgroundOptions: {
                    color: bgColor,
                },
            });
        }
    }, [data, size, margin, fgColor, bgColor, dotType, dotColor, cornersSquareType, cornersSquareColor, cornersDotType, cornersDotColor]);

    return (
        <div
            ref={ref}
            style={{ width: size, height: size, ...style }}
        />
    );
};

export default CustomQRCode;
