import { useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CustomQRCode from '../qrCodes/CustomQRCode';
import { Upload } from 'react-feather';
import ColorPicker from '../../common/ColorPicker';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [selectedType, setSelectedType] = useState("URL");
  const [inputValue, setInputValue] = useState("");
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const qrRef = useRef<any>(null);

  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" });
  const [smsData, setSmsData] = useState({ number: "", message: "" });
  const [upiData, setUpiData] = useState({ pa: "", pn: "", am: "", tn: "" });

  const [image, setImage] = useState<any>(null);
  const [backgroundOptions, setBackgroundOptions] = useState<any>({
    color: "#ffffff",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#ffffff" },
        { offset: 1, color: "#ffffff" }
      ]
    }
  })
  const [dotsOptions, setDotsOptions] = useState<any>({
    color: "#000000",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#000000" }
      ]
    },
    type: "square"
  })
  const [cornersSquareOptions, setCornersSquareOptions] = useState<any>({
    color: "#000000",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#000000" }
      ]
    },
    type: "square"
  })
  const [cornersDotOptions, setCornersDotOptions] = useState<any>({
    color: "#000000",
    gradient: {
      type: "linear" as "linear" | "radial",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#000000" }
      ]
    },
    type: "square"
  })

  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);

  const navigate = useNavigate();

  const qrValue = useMemo<any>(() => {
    switch (selectedType) {
      case "URL":
        return inputValue ? inputValue : "https://onlyqrs.com";
      case "TEXT":
        return inputValue ? inputValue : "https://onlyqrs.com";
      case "E-MAIL":
        return `mailto:${emailData.to}?subject=${emailData.subject}&body=${emailData.body}`;
      case "SMS":
        return `SMSTO:${smsData.number}:${smsData.message}`;
      case "UPI":
        return "https://onlyqrs.com";
      case "PDF":
        return "https://onlyqrs.com";
      case "MP3":
        return "https://onlyqrs.com";
      case "IMAGES":
        return "https://onlyqrs.com";
      default:
        return "https://qrsonly.com";
    }
  }, [selectedType, inputValue, emailData, smsData, upiData]);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleEmailChange = (e: any, field: any) => {
    setEmailData({ ...emailData, [field]: e.target.value });
  };

  const handleSmsChange = (e: any, field: any) => {
    setSmsData({ ...smsData, [field]: e.target.value });
  };

  const handleUpiChange = (e: any, field: any) => {
    setUpiData({ ...upiData, [field]: e.target.value });
  };

  const handleDownload = async (format: "png" | "jpg" | "svg" | "pdf") => {
    if (!qrRef.current) return;

    try {
      await qrRef.current.download(format);
      setHasDownloaded(true);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Error downloading ${format.toUpperCase()} file. Please try again.`);
    }
  };


  return (
    <div className="grid grid-cols-5 mt-4 md:mt-8 gap-4 md:gap-8">
      <div className="col-span-3 bg-[#F5F5F5]/80 rounded-2xl">
        <div className="flex justify-between gap-4 my-8 mx-8 px-4 py-3 bg-white rounded-xl">
          {["URL", "TEXT", "E-MAIL", "SMS", "PDF", "MP3", "IMAGES", "UPI"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setInputValue("");
              }}
              className={`p-3 text-lg md:text-2xl font-semibold rounded-lg transition-all ${selectedType === type
                ? "text-[#036AFF]"
                : "text-[#141414] hover:text-[#036AFF]"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mx-8 h-3/4">
          {selectedType == "URL" && (
            <div className='flex flex-col justify-between h-full'>
              <div className='h-full'>
                <input
                  type="text"
                  placeholder="Enter your link"
                  onChange={handleInputChange}
                  value={inputValue}
                  className="h-full w-full rounded-xl font-bold text-6xl pb-36 placeholder-gray-400 outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between mb-4 space-x-4">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Upload size={20} />
                  <span className="font-medium">Upload any file</span>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => {
                      setIsTrackingEnabled(!isTrackingEnabled)
                      setShowModal3(true)
                    }}
                    className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 
                    ${isTrackingEnabled ? "bg-blue-500" : "bg-gray-400"}`}
                  >
                    <span
                      className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                      ${isTrackingEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "TEXT" && (
            <div className='flex flex-col justify-between  h-full'>
              <div className='h-full'>
                <input
                  type="text"
                  placeholder="Enter your text"
                  onChange={handleInputChange}
                  value={inputValue}
                  className="h-full w-full rounded-xl font-bold text-6xl pb-36 placeholder-gray-400 outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between mb-4 space-x-4">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Upload size={20} />
                  <span className="font-medium">Upload any file</span>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setIsTrackingEnabled(!isTrackingEnabled)}
                    className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 
                    ${isTrackingEnabled ? "bg-blue-500" : "bg-gray-400"}`}
                  >
                    <span
                      className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                      ${isTrackingEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "E-MAIL" && (
            <div className='flex flex-col justify-between h-full pt-16'>
              <div className='h-full'>
                <div className="flex flex-col gap-4 ">
                  <input
                    type="email"
                    placeholder="Recipient Email"
                    onChange={(e) => handleEmailChange(e, 'to')}
                    className="p-2 rounded-xl text-xl outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    onChange={(e) => handleEmailChange(e, 'subject')}
                    className="p-2 rounded-xl text-xl outline-none"
                  />
                  <textarea
                    placeholder="Email Body"
                    onChange={(e) => handleEmailChange(e, 'body')}
                    className="p-2 rounded-xl text-xl outline-none h-32"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 space-x-4">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {/* <Upload size={20} />
                  <span className="font-medium">Upload any file</span> */}
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setIsTrackingEnabled(!isTrackingEnabled)}
                    className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 
                    ${isTrackingEnabled ? "bg-blue-500" : "bg-gray-400"}`}
                  >
                    <span
                      className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                      ${isTrackingEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "SMS" && (
            <div className='flex flex-col justify-between h-full pt-16'>
              <div className='h-full'>
                <div className="flex flex-col gap-4 ">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    onChange={(e) => handleSmsChange(e, 'number')}
                    className="p-2 rounded-xl text-xl outline-none"
                  />
                  <textarea
                    placeholder="Message"
                    onChange={(e) => handleSmsChange(e, 'message')}
                    className="p-2 rounded-xl text-xl outline-none h-36"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 space-x-4">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {/* <Upload size={20} />
                  <span className="font-medium">Upload any file</span> */}
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setIsTrackingEnabled(!isTrackingEnabled)}
                    className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 
                    ${isTrackingEnabled ? "bg-blue-500" : "bg-gray-400"}`}
                  >
                    <span
                      className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                      ${isTrackingEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "PDF" && (
            <div className='flex flex-col justify-between h-full pt-16'>
              <div className='h-full'>
                {/* <div className="flex flex-col gap-4 ">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    onChange={(e) => handleSmsChange(e, 'number')}
                    className="p-2 rounded-xl text-xl outline-none"
                  />
                  <textarea
                    placeholder="Message"
                    onChange={(e) => handleSmsChange(e, 'message')}
                    className="p-2 rounded-xl text-xl outline-none h-36"
                  />
                </div> */}
              </div>
              <div className="flex items-center justify-between mb-4 space-x-4">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {/* <Upload size={20} />
                  <span className="font-medium">Upload any file</span> */}
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setIsTrackingEnabled(!isTrackingEnabled)}
                    className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 
                    ${isTrackingEnabled ? "bg-blue-500" : "bg-gray-400"}`}
                  >
                    <span
                      className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                      ${isTrackingEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
      <div className="relative col-span-2 flex bg-[#F5F5F5]/80 rounded-2xl justify-center items-center">
        <img
          src="/iphone.png"
          alt="iPhone"
          className="h-[calc(100vh-280px)] mt-30 object-contain ml-22"
        />

        <div className="absolute top-[40%] right-[32%] flex items-center justify-center">
          {/* <QRCodeSVG
            value={inputValue || ' '}
            size={260}
            fgColor={qrForegroundColor}
          /> */}
          <CustomQRCode
            ref={qrRef}
            data={qrValue}
            size={265}
            margin={-1}
            image={image}
            backgroundOptions={backgroundOptions}
            dotsOptions={dotsOptions}
            cornersSquareOptions={cornersSquareOptions}
            cornersDotOptions={cornersDotOptions}
          />
        </div>

        <button
          onClick={() => setShowModal2(true)}
          className={`absolute bottom-[73%] left-[56%] w-56 flex items-center justify-center bg-[#FFFFFF] font-bold text-5xl px-3 py-6 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl cursor-pointer ${qrValue ? "text-[#036AFF]" : "text-gray-500"}`}
          disabled={!qrValue}
        >
          With 
          Logo ?
        </button>

        {!hasDownloaded ? (
          <button
            onClick={() => handleDownload("png")}
            className={`absolute top-[85%] flex items-center justify-center bg-[#FFFFFF] font-bold text-5xl px-16 py-3 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl cursor-pointer ${qrValue ? "text-[#036AFF]" : "text-gray-500"}`}
            disabled={!qrValue}
          >
            DOWNLOAD PNG
          </button>
        ) : (
          <button
            onClick={() => setShowModal1(true)}
            className="absolute top-[85%] flex items-center justify-center bg-[#FFFFFF] font-bold text-5xl px-16 py-3 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl text-[#036AFF] cursor-pointer"
          >
            MORE OPTIONS
          </button>
        )}

        <div className="flex flex-col justify-center items-center bg-[#FFFFFF] py-4 px-5 space-y-4 mt-32 rounded-xl mr-16">
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#000000", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#000000", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#000000", gradient: undefined })
            }}
            className="h-6 w-6 bg-[#000000] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#FF0A01", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#FF0A01", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#FF0A01", gradient: undefined })
            }}
            className="h-6 w-6 bg-[#FF0A01] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#FF9110", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#FF9110", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#FF9110", gradient: undefined })
            }}
            className="h-6 w-6 bg-[#FF9110] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#FCFF03", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#FCFF03", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#FCFF03", gradient: undefined })
            }}
            className="h-6 w-6 bg-[#FCFF03] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#0D19FF", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#0D19FF", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#0D19FF", gradient: undefined })
            }}
            className="h-6 w-6 bg-[#0D19FF] rounded-full"
          />

          <ColorPicker
            size={7}
            color={dotsOptions.color}
            onChange={(c) => {
              setDotsOptions({ ...dotsOptions, color: c, gradient: undefined })
              setCornersDotOptions({ ...cornersDotOptions, color: c, gradient: undefined })
              setCornersSquareOptions({ ...cornersSquareOptions, color: c, gradient: undefined })
            }}
          />
        </div>
      </div>

      {showModal1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            <p className="text-gray-600 mb-6">
              Sign up to unlock more download options and features.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal1(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal1(false);
                  navigate("/register")
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            <p className="text-gray-600 mb-6">
              Sign up to add logos to your qr code
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal2(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal2(false);
                  navigate("/register")
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal3 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            <p className="text-gray-600 mb-6">
              Sign up to track your qr code and get analytics
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowModal3(false)
                  setIsTrackingEnabled(!isTrackingEnabled)
                }}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal3(false);
                  setIsTrackingEnabled(!isTrackingEnabled)
                  navigate("/register")
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedType == "UPI" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            <p className="text-gray-600 mb-6">
              Sign up to track your qr code and get analytics
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedType("URL");
                }}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedType("URL");
                  navigate("/register")
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div >
  );
};

export default Hero;
