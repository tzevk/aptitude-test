'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { setCookie } from 'cookies-next'
import { colleges } from '@/utils/colleges'
import { branches } from '@/utils/branches'

const Select = dynamic(() => import('react-select'), { ssr: false })

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    branch: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (selectedOption, fieldName) => {
    setForm({ ...form, [fieldName]: selectedOption?.value || '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(form.phone)) {
      setError('Invalid Indian phone number.')
      return
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.success) {
      // write all user info into cookies
      setCookie('name',   form.name,    { path: '/' })
      setCookie('phone',  form.phone,   { path: '/' })
      setCookie('email',  form.email,   { path: '/' })
      setCookie('college',form.college, { path: '/' })
      setCookie('branch', form.branch,  { path: '/' })
      router.push('/start')
    } else {
      setError(data.message)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#64126D] px-4 overflow-hidden">

      {/* White Signup Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white w-full max-w-xl p-10 rounded-3xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.3)] border border-gray-200 flex flex-col gap-6"
      >
        {/* Logo Header */}
        <div className="text-center">
          <img src="/accent.png" alt="Accent Logo" className="w-40 h-auto mx-auto mb-2" />
          <p className="text-sm text-gray-600 tracking-wide">Enter your details to begin</p>
        </div>

        {/* Input Fields */}
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        {/* Dropdown Selects */}
        <Select
          options={colleges.map((c) => ({ label: c, value: c }))}
          placeholder="Select College"
          onChange={(option) => handleSelectChange(option, 'college')}
          className="text-black"
          classNamePrefix="react-select"
        />
        <Select
          options={branches.map((b) => ({ label: b, value: b }))}
          placeholder="Select Branch"
          onChange={(option) => handleSelectChange(option, 'branch')}
          className="text-black"
          classNamePrefix="react-select"
        />

        {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#86288F] text-white font-semibold rounded-xl hover:bg-[#64126D] transition-all duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}