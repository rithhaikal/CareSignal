interface LandingPageProps {
  onCheckNow: () => void;
}

export function LandingPage({ onCheckNow }: LandingPageProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#EAF7EF] via-white to-white overflow-hidden font-sans">
      {/* Header */}
      <div className="pt-6 px-6 max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-center px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-xl font-bold text-[#111]">
            <span className="text-[#2D8A3E]">Care</span>Signal
          </div>

          <span className="text-sm font-semibold text-gray-700">
            Build with AI 2026
          </span>
        </header>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-40 z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-[64px] font-extrabold text-[#0B1A24] tracking-tight leading-[1.05] mb-6">
              Not sure if you should go to the hospital?
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-10 font-medium">
              Get clear guidance in seconds based on your symptoms. No guessing. No panic. Just the next step.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={onCheckNow}
                className="w-full sm:w-auto bg-[#0B1A24] text-white font-semibold py-4 px-8 rounded hover:bg-gray-800 transition-colors"
              >
                Check Symptoms
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-end">
            <img
              src="/hero.png"
              alt="AI Health Assistant"
              className="w-full max-w-2xl scale-110 drop-shadow-2xl object-contain mix-blend-darken"
            />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white border-t border-[#E5E7EB] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1A24] tracking-tight mb-20 text-center">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F0FDF4] text-[#2D8A3E] rounded-full flex items-center justify-center text-xl font-bold mb-6 border border-[#bbf7d0]">
                1
              </div>
              <h3 className="text-xl font-bold text-[#0B1A24] mb-3">Select symptoms</h3>
              <p className="text-base text-gray-600">Choose from a list of common symptoms</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F0FDF4] text-[#2D8A3E] rounded-full flex items-center justify-center text-xl font-bold mb-6 border border-[#bbf7d0]">
                2
              </div>
              <h3 className="text-xl font-bold text-[#0B1A24] mb-3">Get assessment</h3>
              <p className="text-base text-gray-600">Receive clear guidance based on your symptoms</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F0FDF4] text-[#2D8A3E] rounded-full flex items-center justify-center text-xl font-bold mb-6 border border-[#bbf7d0]">
                3
              </div>
              <h3 className="text-xl font-bold text-[#0B1A24] mb-3">Follow guidance</h3>
              <p className="text-base text-gray-600">Review your next steps and warning signs clearly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}