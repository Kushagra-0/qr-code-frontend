import Navbar from "../../../../components/common/Navbar";
import CreateQrCodeForm from "../../../../components/qrCodes/CreateQrCodeForm";

const CreateQrCode = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 min-h-screen w-full">
      <Navbar />
      <CreateQrCodeForm />
    </div>
  );
};

export default CreateQrCode;
