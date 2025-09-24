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

  const [hasChangedColor, setHasChangedColor] = useState(false);
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
    <div className="flex flex-col-reverse md:flex-row mt-4 md:mt-8 gap-4 md:gap-8">
      <div className="md:w-3/5 bg-[#F5F5F5]/80 rounded-2xl flex flex-col">
        <div className="flex flex-wrap justify-start gap-4 m-4 md:m-8 px-4 py-3 bg-white rounded-xl">
          {["URL", "TEXT", "E-MAIL", "SMS", "PDF", "MP3", "IMAGES", "UPI"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setInputValue("");
              }}
              className={`px-2 py-2 text-lg md:text-2xl font-semibold rounded-lg transition-all ${selectedType === type
                ? "text-[#036AFF]"
                : "text-[#141414] hover:text-[#036AFF]"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col mx-4 md:mx-8 h-full mb-4 md:mb-8">
          {selectedType == "URL" && (
            <div className='flex flex-col justify-between h-full pt-6 md:pt-0'>
              <div className='h-full'>
                <input
                  type="text"
                  placeholder="Enter your link"
                  onChange={handleInputChange}
                  value={inputValue}
                  className="h-full w-full rounded-xl font-bold text-3xl md:text-4xl xl:text-5xl pb-36 placeholder-gray-400 outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Upload size={20} />
                  <span className="text-xs md:text-base font-medium">Upload any file</span>
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "TEXT" && (
            <div className='flex flex-col justify-between h-full pt-6 md:pt-0'>
              <div className='h-full'>
                <input
                  type="text"
                  placeholder="Enter your text"
                  onChange={handleInputChange}
                  value={inputValue}
                  className="h-full w-full rounded-xl font-bold text-3xl md:text-4xl xl:text-5xl pb-36 placeholder-gray-400 outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between">
                <div
                  // onClick={uploadFile}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Upload size={20} />
                  <span className="text-xs md:text-base font-medium">Upload any file</span>
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
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
              <div className="flex items-center justify-between">
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
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
              <div className="flex items-center justify-between">
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
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
              <div className="flex items-center justify-between">
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "MP3" && (
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
              <div className="flex items-center justify-between">
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "IMAGES" && (
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
              <div className="flex items-center justify-between">
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

          {selectedType == "UPI" && (
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
              <div className="flex items-center justify-between">
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
                  <span className="text-xs md:text-base text-gray-700 font-semibold">Scan Tracking</span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>


      <div className="md:w-2/5 relative flex bg-[#F5F5F5]/80 rounded-2xl justify-center items-center">
        <div className='flex items-center justify-center z-10'>
          <img
            src="/iphone-2.png"
            alt="iPhone"
            className="block max-h-[70vh] lg:h-[calc(100vh-280px)] object-contain mt-3 md:mt-30 w-auto min-w-[100px]"
          />
          <div className="absolute flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 md:mt-16">
            <CustomQRCode
              ref={qrRef}
              data={qrValue}
              size={240}
              image={image}
              backgroundOptions={backgroundOptions}
              dotsOptions={dotsOptions}
              cornersSquareOptions={cornersSquareOptions}
              cornersDotOptions={cornersDotOptions}
            />
          </div>
        </div>


        {hasChangedColor && (
          <button
            onClick={() => setShowModal2(true)}
            className={`absolute z-20 top-4 md:top-8 right-4 md:right-8 w-1/3 flex items-center justify-center bg-[#FFFFFF] font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-3 py-6 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl cursor-pointer ${qrValue ? "text-[#036AFF]" : "text-gray-500"}`}
            disabled={!qrValue}
          >
            With
            Logo ?
          </button>
        )}

        {!hasDownloaded ? (
          <button
            onClick={() => handleDownload("png")}
            className={`absolute z-20 bottom-4 md:bottom-8 w-5/6 flex items-center justify-center bg-[#FFFFFF] font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-1 py-3 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl cursor-pointer ${qrValue ? "text-[#036AFF]" : "text-gray-500"}`}
            disabled={!qrValue}
          >
            DOWNLOAD PNG
          </button>
        ) : (
          <button
            onClick={() => setShowModal1(true)}
            className="absolute z-20 bottom-4 md:bottom-8 w-5/6 flex items-center justify-center bg-[#FFFFFF] font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-1 py-3 shadow-[0_0_20px_rgba(100,100,100,0.5)] rounded-xl text-[#036AFF] cursor-pointer"
          >
            MORE OPTIONS
          </button>
        )}

        <div className="hidden xl:flex flex-col absolute right-8 justify-center items-center bg-[#FFFFFF] py-4 px-2 md:px-5 mt-32 rounded-xl gap-4">
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#000000", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#000000", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#000000", gradient: undefined })
              setHasChangedColor(true);
            }}
            className="h-6 w-6 bg-[#000000] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#FF0A01", gradient: undefined })
              setCornersDotOptions({ ...cornersDotOptions, color: "#FF0A01", gradient: undefined })
              setCornersSquareOptions({ ...cornersSquareOptions, color: "#FF0A01", gradient: undefined })
              setHasChangedColor(true);
            }}
            className="h-6 w-6 bg-[#FF0A01] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#FF9110", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#FF9110", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#FF9110", gradient: undefined })
              setHasChangedColor(true);
            }}
            className="h-6 w-6 bg-[#FF9110] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#FCFF03", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#FCFF03", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#FCFF03", gradient: undefined })
              setHasChangedColor(true);
            }}
            className="h-6 w-6 bg-[#FCFF03] rounded-full"
          />
          <button
            onClick={() => {
              setDotsOptions({ ...dotsOptions, color: "#0D19FF", gradient: undefined })
              setCornersDotOptions({ ...setCornersDotOptions, color: "#0D19FF", gradient: undefined })
              setCornersSquareOptions({ ...setCornersSquareOptions, color: "#0D19FF", gradient: undefined })
              setHasChangedColor(true);
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
              setHasChangedColor(true);
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
