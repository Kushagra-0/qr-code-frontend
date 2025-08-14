const steps = [
  { step: "1", title: "Create", desc: "Enter your content, customize design, and generate your QR code." },
  { step: "2", title: "Share", desc: "Download and share it anywhere — print, social media, or websites." },
  { step: "3", title: "Track", desc: "Get real-time analytics on scans, locations, and devices." }
];

const HowItWorks = () => {
  return (
    <div className="mt-10">
      <h2 className="text-5xl font-bold text-center mb-12">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto px-6">
        {steps.map((s, i) => (
          <div key={i} className="bg-[#F5F5F5]/80 rounded-2xl p-8 shadow-lg w-full md:w-1/3 text-center">
            <div className="text-6xl font-bold text-[#036AFF]">{s.step}</div>
            <h3 className="mt-4 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
