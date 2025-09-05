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
  image: string;
  backgroundOptions: any;
  dotsOptions: any;
  cornersSquareOptions: any;
  cornersDotOptions: any;
}
