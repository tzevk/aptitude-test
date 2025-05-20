// app/api/signup/route.js
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, phone, email, college, branch } = body

    // basic server-side validation
    if (!name || !phone || !email || !college || !branch) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('APTITUDE')
    const users = db.collection('users')

    // check duplicate
    const exists = await users.findOne({ email })
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      )
    }

    // insert
    await users.insertOne({ name, phone, email, college, branch })

    // set cookies for session & user details
    const cookieStore = cookies()
    cookieStore.set({ name: 'user_name', value: name, path: '/' })
    cookieStore.set({ name: 'user_email', value: email, path: '/' })
    cookieStore.set({ name: 'user_phone', value: phone, path: '/' })
    cookieStore.set({ name: 'user_college', value: college, path: '/' })
    cookieStore.set({ name: 'user_branch', value: branch, path: '/' })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/signup] error:', err)
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}