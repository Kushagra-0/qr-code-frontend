import { useState } from "react";
import HomeTab from "./tabs/HomeTab";
import QrCodeTab from "./tabs/QrCodeTab";
import { useSearchParams } from "react-router-dom";
import { Menu, X } from "react-feather"; // Feather icons

const Main = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab") || "home";
    const setActiveTab = (tab: "home" | "qr") => {
        setSearchParams({ tab });
        setIsOpen(false); // close sidebar when a tab is selected (on mobile)
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:grid md:grid-cols-5 mt-6 md:mt-8 gap-4 md:gap-8">
            {/* Mobile Navbar */}
            <div className="flex items-center justify-between md:hidden bg-[#F5F5F5]/80 rounded-2xl px-4 py-3 shadow">
                <h1 className="font-bold text-lg">Dashboard</h1>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-[#F5F5F5]/95 rounded-r-2xl p-4 shadow-lg transform transition-transform duration-300 z-50 md:static md:h-auto md:w-auto md:rounded-2xl md:p-4 md:shadow-none
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div
                    onClick={() => setActiveTab("home")}
                    className={`my-3 px-4 py-3 rounded-xl cursor-pointer font-semibold hover:bg-white text-base md:text-lg transition-all duration-300 ${
                        tabParam === "home"
                            ? "bg-white shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                            : "bg-none"
                    }`}
                >
                    HOME
                </div>

                <div
                    onClick={() => setActiveTab("qr")}
                    className={`my-3 px-4 py-3 rounded-xl cursor-pointer font-semibold hover:bg-white text-base md:text-lg transition-all duration-300 ${
                        tabParam === "qr"
                            ? "bg-white shadow-[0_0_20px_rgba(100,100,100,0.5)]"
                            : "bg-none"
                    }`}
                >
                    QR
                </div>
            </div>

            {/* Right Content */}
            <div className="relative col-span-4 bg-[#F5F5F5]/80 rounded-2xl p-4 md:p-6 overflow-hidden h-auto md:h-[78vh]">
                {tabParam === "home" && <HomeTab />}
                {tabParam === "qr" && <QrCodeTab />}
            </div>
        </div>
    );
};

export default Main;
