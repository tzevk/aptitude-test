'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
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

  const handleSelectChange = (sel, field) => {
    setForm({ ...form, [field]: sel?.value || '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Indian phone validation
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Invalid Indian phone number')
      return
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const { success, message } = await res.json()
    if (success) {
      router.push('/start')
    } else {
      setError(message || 'Signup failed')
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#64126D] px-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white w-full max-w-xl p-10 rounded-3xl shadow-2xl border border-gray-200 flex flex-col gap-6"
      >
        {/* Logo */}
        <div className="text-center">
          <img src="/accent.png" alt="Logo" className="w-40 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Enter your details to begin</p>
        </div>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
          required
        />

        <Select
          options={colleges.map((c) => ({ label: c, value: c }))}
          placeholder="Select College"
          onChange={(o) => handleSelectChange(o, 'college')}
        />
        <Select
          options={branches.map((b) => ({ label: b, value: b }))}
          placeholder="Select Branch"
          onChange={(o) => handleSelectChange(o, 'branch')}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-[#86288F] text-white rounded-xl hover:bg-[#64126D] transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}