'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { shuffleQuestions } from '@/utils/shuffle'
import { getCookie } from 'cookies-next'

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1800)
  const [warningGiven, setWarningGiven] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [tabSwitchDetected, setTabSwitchDetected] = useState(false)
  const [copyAttempts, setCopyAttempts] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  // fetch & shuffle Qs once
  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/questions')
      const data = await res.json()
      setQuestions(shuffleQuestions(data).slice(0, 50))
    })()
  }, [])

  // single submission guard
  const submitResults = useRef(async () => {
    if (isSubmitted) return
    setIsSubmitted(true)

    const correct = Object.entries(answers).filter(
      ([i, ans]) => questions[+i]?.answer === ans
    ).length
    const attempted = Object.keys(answers).length

    const payload = {
      name:      getCookie('name')    || 'Anonymous',
      email:     getCookie('email')   || '',
      phone:     getCookie('phone')   || '',
      college:   getCookie('college') || '',
      score:     correct,
      attempts:  attempted,
      tabSwitch: tabSwitchDetected,
      copyAttempts,
      timestamp: new Date().toISOString(),
    }

    await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    router.push(`/result?score=${correct}&attempts=${attempted}`)
  }).current

  // countdown
  useEffect(() => {
    if (isSubmitted) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          submitResults()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [answers, isSubmitted])

  // restore selection
  useEffect(() => {
    setSelectedOption(answers[currentIndex] || '')
  }, [currentIndex, answers])

  // tab‐switch detection
  useEffect(() => {
    if (isSubmitted) return
    const onVisibility = () => {
      if (!document.hidden) return
      if (!warningGiven) {
        setWarningGiven(true)
        setShowModal(true)
      } else {
        setTabSwitchDetected(true)
        submitResults()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [warningGiven, answers, isSubmitted])

  // block copy/paste & right-click
  useEffect(() => {
    if (isSubmitted) return
    const blockKeys = e => {
      if ((e.ctrlKey||e.metaKey) && ['c','v','x','u'].includes(e.key.toLowerCase())) {
        e.preventDefault(); setCopyAttempts(c => c+1)
      }
    }
    const blockContext = e => {
      e.preventDefault(); setCopyAttempts(c => c+1)
    }
    document.addEventListener('keydown', blockKeys)
    document.addEventListener('contextmenu', blockContext)
    return () => {
      document.removeEventListener('keydown', blockKeys)
      document.removeEventListener('contextmenu', blockContext)
    }
  }, [isSubmitted])

  const handleNext = () => {
    if (isSubmitted) return
    if (selectedOption) {
      setAnswers(a => ({ ...a, [currentIndex]: selectedOption }))
    }
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1)
    } else {
      submitResults()
    }
  }

  const handlePrevious = () => {
    if (isSubmitted) return
    if (currentIndex > 0) {
      setAnswers(a => ({ ...a, [currentIndex]: selectedOption }))
      setCurrentIndex(i => i - 1)
    }
  }

  if (!questions.length) {
    return <div className="h-screen flex items-center justify-center text-white">Loading…</div>
  }

  const current = questions[currentIndex]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = String(timeLeft % 60).padStart(2, '0')

  return (
    <div className="min-h-screen bg-[#64126D] flex items-center justify-center p-4">
      {/* Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-2">⚠️ Warning</h2>
            <p className="mb-4 text-gray-700">
              Tab switch detected—one more will end your quiz.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-5 py-2 bg-[#86288F] text-white rounded-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Quiz Card */}
      <div className="bg-white w-full max-w-3xl p-8 rounded-3xl shadow-2xl select-none">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/accent.png" alt="Accent Logo" className="w-40 h-auto" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-800">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span className="font-mono text-red-600">
            {minutes}:{seconds}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full mb-6">
          <div
            className="h-full bg-red-500 transition-width duration-200"
            style={{ width: `${((1800 - timeLeft) / 1800) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {current.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {current.options.map(opt => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`p-4 border rounded-lg text-left transition ${
                selectedOption === opt
                  ? 'bg-[#64126D] text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-500 text-white rounded-lg"
          >
            {currentIndex + 1 < questions.length ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}