import HomeTab from "./tabs/HomeTab";
import QrCodeTab from "./tabs/QrCodeTab";
import { useSearchParams } from "react-router-dom";

const Main = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab") || "home";
    const setActiveTab = (tab: "home" | "qr") => {
        setSearchParams({ tab });
    };

    return (
        <div className="grid grid-cols-5 mt-8 gap-8">
            <div className="col-span-1 bg-[#F5F5F5]/80 rounded-2xl py-1 px-4">
                <div
                    onClick={() => setActiveTab("home")}
                    className={`my-4 px-4 py-4 rounded-xl cursor-pointer font-semibold hover:bg-white text-lg transition-all duration-300 ${tabParam === "home"
                        ? "bg-white shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                        : "bg-none"
                        }`}
                >
                    HOME
                </div>

                <div
                    onClick={() => setActiveTab("qr")}
                    className={`my-4 px-4 py-4 rounded-xl cursor-pointer font-semibold hover:bg-white text-lg transition-all duration-300 ${tabParam === "qr"
                        ? "bg-white shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                        : "bg-none"
                        }`}
                >
                    QR
                </div>
            </div>

            {/* Right Content */}
            <div className="relative col-span-4 bg-[#F5F5F5]/80 rounded-2xl p-6 overflow-hidden h-[78vh]">
                {tabParam === "home" && (
                    <HomeTab />
                )}
                {tabParam === "qr" && (
                    <QrCodeTab />
                )}
            </div>
        </div>
    );
};

export default Main
