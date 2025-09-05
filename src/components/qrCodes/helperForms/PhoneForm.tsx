import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/high-res.css';

const PhoneForm = ({ typeData, setTypeData }: any) => {
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
                value={typeData.phoneNumber || ""}
                onChange={(phone) => setTypeData({ ...typeData, phoneNumber: `+${phone}` })}
                inputClass="!w-full !text-sm !h-10 focus:!outline-none"
                containerClass="w-full"
            />
        </div>
    );
}

export default PhoneForm