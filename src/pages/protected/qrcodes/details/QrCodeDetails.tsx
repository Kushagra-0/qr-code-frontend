import { useParams } from "react-router-dom";
import Navbar from "../../../../components/common/Navbar";
import ShowQrCodeDetails from "../../../../components/qrCodes/ShowQrCodeDetails";

const QrCodeDetails = () => {
    const { id } = useParams();

    return (
        <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-4 md:p-8 min-h-screen w-full">
            <Navbar />
            <ShowQrCodeDetails id={id} />
        </div>
    );
};

export default QrCodeDetails;
