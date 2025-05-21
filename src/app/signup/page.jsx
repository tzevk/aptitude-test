'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { colleges } from '@/utils/colleges'
import { branches } from '@/utils/branches'

const Select = dynamic(() => import('react-select'), { ssr: false })

export default function SignupPage () {
  const router = useRouter()

  const [form, setForm] = useState({
    name:    '',
    phone:   '',
    email:   '',
    college: '',
    branch:  '',
  })

  const [error,   setError] = useState('')
  const [loading, setLoad ] = useState(false)

  /* ---------------- handlers ---------------- */
  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSelectChange = (opt, key) =>
    setForm(f => ({ ...f, [key]: opt?.value || '' }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number')
      return
    }

    setLoad(true)
    try {
      const res  = await fetch('/api/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const raw  = await res.text()
      const data = raw ? JSON.parse(raw) : {}

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Signup failed (status ${res.status})`)
      }
      router.push('/start')
    } catch (err) {
      setError(err.message || 'Something went wrong, please try again.')
    } finally {
      setLoad(false)
    }
  }

  /* ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#64126D] px-4 py-6">
      <form
        onSubmit={handleSubmit}
        /*  ⬇︎ mobile-first width / padding  */
        className="w-full max-w-sm sm:max-w-md lg:max-w-xl bg-white p-6 sm:p-8 lg:p-10
                   rounded-3xl shadow-2xl border border-gray-200 flex flex-col gap-5 sm:gap-6"
      >
        {/* logo */}
        <div className="text-center">
          <img src="/accent.png" alt="Logo" className="w-32 sm:w-36 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-gray-600">Enter your details to begin</p>
        </div>

        {/* inputs */}
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-2.5 sm:py-3 border rounded-lg
                     text-sm sm:text-base focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          name="phone"
          type="tel"
          pattern="[6-9][0-9]{9}"
          placeholder="10-digit Mobile No."
          onChange={handleChange}
          className="w-full px-4 py-2.5 sm:py-3 border rounded-lg
                     text-sm sm:text-base focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full px-4 py-2.5 sm:py-3 border rounded-lg
                     text-sm sm:text-base focus:ring-2 focus:ring-purple-400"
          required
        />

        <Select
          options={colleges.map(c => ({ label: c, value: c }))}
          placeholder="Select College"
          onChange={o => handleSelectChange(o, 'college')}
          classNamePrefix="react-select"
        />

        <Select
          options={branches.map(b => ({ label: b, value: b }))}
          placeholder="Select Branch"
          onChange={o => handleSelectChange(o, 'branch')}
          classNamePrefix="react-select"
        />

        {error && <p className="text-red-500 text-xs sm:text-sm -mt-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 bg-[#86288F] text-white rounded-xl
                     text-sm sm:text-base font-semibold hover:bg-[#64126D]
                     transition disabled:opacity-50"
        >
          {loading ? 'Signing Up…' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}