// /app/api/signup/route.js
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  const { name, phone, email, college, branch, password } = await request.json()

  const client = await clientPromise
  const db = client.db('APTITUDE')
  const users = db.collection('users')

  // reject duplicate emails
  const exists = await users.findOne({ email })
  if (exists) {
    return NextResponse.json(
      { success: false, message: 'User already exists' },
      { status: 400 }
    )
  }

  // insert new user
  await users.insertOne({ name, phone, email, college, branch, password })

  // set an HTTP-only cookie called "session" with the user's email
  cookies().set({
    name:   'session',
    value:  email,
    httpOnly: true,
    path:   '/',
    // you can also add `secure: true` and `sameSite` here, if you like
  })

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}