export interface QrCode {
  _id: string;
  shortCode: string;
  name: string;
  content: string;
  createdAt: string;
  isDynamic: boolean;
  isPaused: boolean;
  scanCount: number;
  foregroundColor: string;
  dotType: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  dotColor: string;
  cornersSquareType: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  cornersSquareColor: string;
  cornersDotType: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  cornersDotColor: string;
  backgroundOptions: any;
}
