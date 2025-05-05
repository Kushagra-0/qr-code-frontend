import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const Hero = () => {
  const [text, setText] = useState('');
  const [qrForegroundColor, setQrForegroundColor] = useState('#000000');

  return (
    <div className="grid grid-cols-5 mt-8 gap-8">
      <div className="col-span-3 bg-[#F5F5F5]/80 rounded-2xl justify-between items-center">
        <div className="my-8 mx-8 px-4 py-4 space-x-2 bg-[#FFFFFF] rounded-xl">
          <button className="border-black p-2 text-2xl font-semibold text-[#141414]">
            URL
          </button>
          <button className="border-black p-2 text-2xl font-semibold text-[#141414]">
            TEXT
          </button>
          <button className="border-black p-2 text-2xl font-semibold text-[#141414]">
            INSTAGRAM
          </button>
          <button className="border-black p-2 text-2xl font-semibold text-[#141414]">
            YOUTUBE
          </button>
          <button className="border-black p-2 text-2xl font-semibold text-[#141414]">
            PDF
          </button>
          <button className="border-black p-2 text-2xl font-semibold text-[#141414]">
            MP3
          </button>
        </div>

        <div className="mx-8">
          <input
            type="text"
            placeholder="Enter your link or drop a file"
            onChange={(e) => setText(e.target.value)}
            className="h-96 w-full rounded-xl font-bold text-6xl placeholder-black outline-none focus:ring-0 focus:border-transparent"
          />
        </div>
      </div>
      <div className="relative col-span-2 flex bg-[#F5F5F5]/80 rounded-2xl justify-center items-center">
        <img
          src="/iphone.png"
          alt="iPhone"
          className="h-[calc(100vh-280px)] mt-30 object-contain ml-22"
        />

        <div className="absolute top-[40%] right-[32%] flex items-center justify-center">
          <QRCodeSVG
            value={text || ' '}
            size={260}
            fgColor={qrForegroundColor}
          />
        </div>

        <button className="absolute top-[85%] flex items-center justify-center bg-[#FFFFFF] text-[#036AFF] font-bold text-5xl px-16 py-3 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl">
          DOWNLOAD JPG
        </button>

        <div className="flex flex-col bg-[#FFFFFF] py-4 px-6 space-y-4 mt-36 rounded-xl mr-16">
          <button
            onClick={() => setQrForegroundColor('#000000')}
            className="h-6 w-6 bg-[#000000] rounded-full"
          />
          <button
            onClick={() => setQrForegroundColor('#FF0A01')}
            className="h-6 w-6 bg-[#FF0A01] rounded-full"
          />
          <button
            onClick={() => setQrForegroundColor('#FF9110')}
            className="h-6 w-6 bg-[#FF9110] rounded-full"
          />
          <button
            onClick={() => setQrForegroundColor('#FCFF03')}
            className="h-6 w-6 bg-[#FCFF03] rounded-full"
          />
          <button
            onClick={() => setQrForegroundColor('#0D19FF')}
            className="h-6 w-6 bg-[#0D19FF] rounded-full"
          />
          <input
            type="color"
            value={qrForegroundColor}
            onChange={(e) => setQrForegroundColor(e.target.value)}
            className="h-6 w-6 rounded-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
