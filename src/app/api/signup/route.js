import clientPromise from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function POST(req) {
  const body = await req.json()
  const { name, phone, email, college, branch, password } = body

  const client = await clientPromise
  const db = client.db('APTITUDE')

  const exists = await db.collection('users').findOne({ email })
  if (exists) {
    return new Response(JSON.stringify({ success: false, message: 'User already exists' }), { status: 400 })
  }

  await db.collection('users').insertOne({ name, phone, email, college, branch, password })

  cookies().set('session', email, { httpOnly: true })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}