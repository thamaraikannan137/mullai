import { NextResponse } from 'next/server'

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json(details ? { error, details } : { error }, { status })
}
