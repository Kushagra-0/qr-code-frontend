import { useParams } from "react-router-dom";
import Navbar from "../../../../components/common/Navbar";
import EditQrCodeForm from "../../../../components/qrCodes/EditQrCodeForm";

const EditQrCode = () => {
    const { id } = useParams();

    return (
        <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-4 md:p-8 min-h-screen w-full">
            <Navbar />
            <EditQrCodeForm id={id} />
        </div>
    );
};

export default EditQrCode;
