export interface QrCode {
  _id: string;
  content: string;
  createdAt: string;
  isDynamic: boolean;
  isPaused: boolean;
  scanCount: number;
  color: string;
}
