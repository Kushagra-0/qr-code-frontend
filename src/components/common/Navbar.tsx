const Navbar = () => {
  return (
    <div className="w-full bg-[#F5F5F5]/80 px-6 py-2 flex justify-between items-center z-50 rounded-2xl">
      <div className="text-2xl font-semibold text-[#141414]">CUSTOM QR</div>
      <div className="space-x-4">
        <button className="text-2xl font-semibold text-[#141414]">LOGIN</button>
        <button className="text-2xl font-semibold text-[#141414] bg-[#FFFFFF] px-4 py-2 rounded-xl shadow-md">
          REGISTER
        </button>
      </div>
    </div>
  );
};

export default Navbar;
