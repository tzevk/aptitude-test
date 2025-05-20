// src/app/api/questions/route.js
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const url = new URL(req.url)
  const branch = url.searchParams.get('branch')

  try {
    const client = await clientPromise
    const db = client.db('APTITUDE')
    const collection = db.collection('questions')

    const filter = branch ? { branch } : {}
    const questions = await collection.find(filter).toArray()

    // Drop the Mongo-generated _id by mapping it to `_` then returning the rest
    const cleanQuestions = questions.map(({ _id: _, ...rest }) => rest)

    return NextResponse.json(cleanQuestions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}