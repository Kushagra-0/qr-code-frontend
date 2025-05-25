import { useState } from "react";

const Main = () => {
    const [activeTab, setActiveTab] = useState<"home" | "qr">("home");

    return (
        <div className="grid grid-cols-5 mt-8 gap-8">
            <div className="col-span-1 bg-[#F5F5F5]/80 rounded-2xl py-1 px-4">
                <div
                    onClick={() => setActiveTab("home")}
                    className={`my-4 px-4 py-4 rounded-xl cursor-pointer font-semibold text-lg ${activeTab === "home"
                        ? "bg-white shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                        : "bg-none"
                        }`}
                >
                    HOME
                </div>

                <div
                    onClick={() => setActiveTab("qr")}
                    className={`my-4 px-4 py-4 rounded-xl cursor-pointer ${activeTab === "qr"
                        ? "bg-white shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                        : "bg-none"
                        }`}
                >
                    <button className="text-lg font-semibold w-full text-left">
                        QR
                    </button>
                </div>
            </div>

            {/* Right Content */}
            <div className="relative col-span-4 flex bg-[#F5F5F5]/80 rounded-2xl justify-center items-center p-8">
                {activeTab === "home" && (
                    <div className="text-xl font-medium text-[#141414]">Welcome to the Home Section!</div>
                )}
                {activeTab === "qr" && (
                    <div className="text-xl font-medium text-[#141414]">This is the QR Section!</div>
                )}
            </div>
        </div>
    );
};

export default Main
