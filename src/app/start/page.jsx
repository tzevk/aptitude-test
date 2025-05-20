'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function StartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const branch = searchParams.get('branch') || 'General'

  const handleStart = () => {
    router.push(`/quiz?branch=${encodeURIComponent(branch)}`)
  }

  return (
        <div className="relative w-full min-h-screen flex items-center justify-center bg-[#64126D] px-4 overflow-hidden">

      {/* White card */}
      <div className="relative z-10 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/accent.png" alt="Accent Logo" className="w-40 h-auto mx-auto mb-2" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">INSTRUCTIONS</h1>
          <p className="text-center text-gray-600 mb-6"></p>

          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li><strong>Questions:</strong> 50</li>
            <li><strong>Time Limit:</strong> 30 minutes</li>
            <li><strong>Navigation:</strong> Next &amp; Previous</li>
            <li>
              <strong>Tab Switching:</strong>
              <ul className="list-disc list-inside ml-5 text-gray-600">
                <li>1st switch: Warning</li>
                <li>2nd switch: Quiz ends immediately</li>
              </ul>
            </li>
            <li>
              <strong>Copy/Paste &amp; Context Menu:</strong>  
              Blocked &amp; logged
            </li>
            <li>
              <strong>Results:</strong> Saved against your account—name, email, phone, college, branch, timestamps, tab-switch &amp; copy attempts
            </li>
            <li>
              <strong>After submission:</strong> View score, then auto-redirect home
            </li>
          </ul>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-[#86288F] hover:bg-[#64126D] text-white font-semibold rounded-xl shadow-md transition"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}