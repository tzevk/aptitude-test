'use client'

import { useRouter } from 'next/navigation'

/** A single SVG question-mark, re-used & transformed */
const QuestionSVG = ({ className }) => (
  <svg
    viewBox="0 0 192 256"
    fill="none"
    stroke="#64126D"
    strokeWidth="4"
    className={`absolute ${className}`}
  >
    {/* outline “?” */}
    <path d="M96 216v-28m0-24c-9.8 0-18-8.2-18-18s8.2-18 18-18
             18-8.2 18-18S115.8 90 96 90 78 81.8 78 72" />
  </svg>
)

/** Background squiggle line */
const Wave = ({ className }) => (
  <svg
    viewBox="0 0 500 140"
    fill="none"
    stroke="#64126D"
    strokeWidth="4"
    className={`absolute ${className}`}
  >
    <path d="M0 70 Q125 0 250 70t250 0" />
  </svg>
)

export default function HomeScreen () {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
                    bg-gradient-to-b from-[#F8F6FF] via-[#C9A4DA]/60 to-[#64126D]">
      {/* white glass-card */}
      <div className="relative z-10 mx-auto w-[92%] max-w-sm rounded-[32px]
                      bg-white shadow-xl backdrop-blur-md p-8 flex flex-col items-center">
        {/* logo */}
        <img src="/accent.png" alt="ATS Aptitude Assessment" className="w-32 mb-4" />

        {/* copy */}
        <h1 className="text-2xl font-extrabold tracking-wide text-[#64126D] mb-1">
          APTITUDE TEST
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Sign up to begin your test.
        </p>

        {/* arrow button */}
        <button
          onClick={() => router.push('/signup')}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2
                     w-16 h-16 rounded-full bg-[#64126D] shadow-lg
                     flex items-center justify-center text-white
                     text-2xl hover:bg-[#54105a] active:scale-95 transition"
        >
          {/* → arrow (you can swap for hero-icons “arrow-right” if you wish) */}
          <span className="-mt-[2px]">&rarr;</span>
        </button>
      </div>
    </div>
  )
}