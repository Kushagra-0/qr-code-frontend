import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/high-res.css';

const WhatsappForm = ({ typeData, setTypeData }: any) => {
    const [defaultCountry, setDefaultCountry] = useState("in");

    useEffect(() => {
        // Detect country from IP
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => {
                if (data.country_code) {
                    setDefaultCountry(data.country_code.toLowerCase());
                }
            })
            .catch(() => {
                setDefaultCountry("us");
            });
    }, []);

    return (
        <div className="w-full mb-2">
            <PhoneInput
                country={defaultCountry}
                value={typeData.whatsappNumber || ""}
                onChange={(phone) => setTypeData({ ...typeData, whatsappNumber: `+${phone}` })}
                inputClass="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
                containerClass="w-full"
            />

            <input
                type="text"
                placeholder="Message"
                value={typeData.whatsappMessage || ""}
                onChange={(e) => setTypeData({ ...typeData, whatsappMessage: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
            />
        </div>
    );
}

export default WhatsappForm;