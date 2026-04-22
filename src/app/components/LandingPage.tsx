interface LandingPageProps {
  onCheckNow: () => void;
}

export function LandingPage({ onCheckNow }: LandingPageProps) {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative border-b border-[#E5E7EB] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1666886573421-d19e546cfc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)',
            opacity: 0.08
          }}
        />

        {/* Accent shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#2B7A78] opacity-10"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-[#2D8A3E] opacity-10"></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 py-32 md:py-40">
          <div className="max-w-3xl">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#2D8A3E] px-4 py-2">
                <div className="w-2 h-2 bg-[#2D8A3E]"></div>
                <span className="text-sm text-[#111]">Fast • Clear • Reliable</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl text-[#111] tracking-tight leading-[1.05] mb-6">
              Know when to act. Not guess.
            </h1>
            <p className="text-2xl text-[#6B7280] leading-relaxed mb-10">
              Clear guidance based on your symptoms in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onCheckNow}
                className="bg-[#111] text-white py-5 px-10 text-lg hover:bg-[#2B7A78] transition-colors"
              >
                Check symptoms
              </button>
              <div className="flex items-center gap-6 px-6">
                <div className="text-center">
                  <div className="text-2xl text-[#111] font-semibold">60s</div>
                  <div className="text-xs text-[#6B7280]">Average time</div>
                </div>
                <div className="w-px h-10 bg-[#E5E7EB]"></div>
                <div className="text-center">
                  <div className="text-2xl text-[#2D8A3E] font-semibold">24/7</div>
                  <div className="text-xs text-[#6B7280]">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <h2 className="text-4xl md:text-5xl text-[#111] tracking-tight mb-20 max-w-3xl">
            Wrong decisions happen every day
          </h2>

          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-4">OVERUSE</div>
              <h3 className="text-2xl text-[#111] mb-3">Going to ER unnecessarily</h3>
              <p className="text-base text-[#6B7280]">Wasting time and resources on non-urgent issues</p>
            </div>

            <div>
              <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-4">DELAY</div>
              <h3 className="text-2xl text-[#111] mb-3">Waiting too long when serious</h3>
              <p className="text-base text-[#6B7280]">Missing critical treatment windows</p>
            </div>

            <div>
              <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-4">CONFUSION</div>
              <h3 className="text-2xl text-[#111] mb-3">Not knowing what to do</h3>
              <p className="text-base text-[#6B7280]">Anxiety from uncertainty and lack of guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <h2 className="text-4xl md:text-5xl text-[#111] tracking-tight mb-20">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#2B7A78] text-white flex items-center justify-center text-sm">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl text-[#111] mb-3">Select symptoms</h3>
                <p className="text-base text-[#6B7280]">Choose from a comprehensive list of common symptoms</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#2B7A78] text-white flex items-center justify-center text-sm">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl text-[#111] mb-3">Get assessment</h3>
                <p className="text-base text-[#6B7280]">Receive clear guidance tailored to your situation</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#2B7A78] text-white flex items-center justify-center text-sm">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl text-[#111] mb-3">Follow guidance</h3>
                <p className="text-base text-[#6B7280]">Track and manage your next 24 hours with confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block mb-4">
                <div className="flex items-center gap-2 bg-[#FFF9E6] border border-[#E67700] px-3 py-1">
                  <span className="text-xs text-[#111] uppercase tracking-wider">Key Feature</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl text-[#111] tracking-tight mb-6">
                Understand consequences before they happen
              </h2>
              <p className="text-xl text-[#6B7280] mb-8">
                See how risk evolves over time and make informed decisions.
              </p>
            </div>

            <div>
              {/* Clean Timeline Visualization */}
              <div className="border-2 border-[#111] p-10 bg-white">
                <div className="space-y-8">
                  {/* NOW */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="text-lg text-[#111]">NOW</div>
                      <div className="text-sm text-[#2D8A3E] font-medium">Low risk</div>
                    </div>
                    <div className="h-2 bg-[#F3F4F6]">
                      <div className="h-full w-[15%] bg-[#2D8A3E]"></div>
                    </div>
                  </div>

                  {/* +24H */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="text-lg text-[#111]">+24H</div>
                      <div className="text-sm text-[#E67700] font-medium">Medium risk</div>
                    </div>
                    <div className="h-2 bg-[#F3F4F6]">
                      <div className="h-full w-[45%] bg-[#E67700]"></div>
                    </div>
                  </div>

                  {/* +48H */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="text-lg text-[#111]">+48H</div>
                      <div className="text-sm text-[#C92A2A] font-medium">High risk</div>
                    </div>
                    <div className="h-2 bg-[#F3F4F6]">
                      <div className="h-full w-[85%] bg-[#C92A2A]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-base text-[#6B7280]">
            Not a medical diagnosis tool. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-4xl md:text-5xl text-[#111] tracking-tight mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-[#6B7280] mb-10">
            Check your symptoms now and get clear guidance.
          </p>
          <button
            onClick={onCheckNow}
            className="bg-[#111] text-white py-4 px-10 text-lg hover:bg-[#2B7A78] transition-colors"
          >
            Check symptoms
          </button>
        </div>
      </div>
    </div>
  );
}
