import type { VercelRequest, VercelResponse } from '@vercel/node'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new HttpError(500, `Server is missing ${name}`)
  return v
}

/** Wraps a handler: JSON in/out, consistent errors, never leaks upstream secrets. */
export function route(handler: (req: VercelRequest) => Promise<unknown>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      res.setHeader('Cache-Control', 'no-store')
      const data = await handler(req)
      res.status(200).json(data)
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 502
      const message = e instanceof HttpError ? e.message : 'The service hit an error talking to an outside provider. Please try again.'
      if (!(e instanceof HttpError)) console.error('payment error', (e as Error).message)
      res.status(status).json({ error: message })
    }
  }
}

/** Ugandan mobile number -> { intl: '2567XXXXXXXX', national: '7XXXXXXXX' } */
export function normalisePhone(input: unknown): { intl: string; national: string } {
  const digits = String(input ?? '').replace(/\D/g, '')
  const national = digits.startsWith('256') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits
  if (!/^7\d{8}$/.test(national)) throw new HttpError(400, 'Enter a valid Ugandan mobile number, e.g. 0772 123456')
  return { intl: `256${national}`, national }
}

export function parseAmount(input: unknown): number {
  const n = Number(input)
  if (!Number.isInteger(n) || n < 500 || n > 5_000_000) {
    throw new HttpError(400, 'Amount must be a whole number of UGX between 500 and 5,000,000')
  }
  return n
}

export function parseRef(input: unknown): string {
  const s = String(input ?? '')
  if (!/^[A-Za-z0-9-]{3,40}$/.test(s)) throw new HttpError(400, 'Invalid job reference')
  return s
}

export function requireMethod(req: VercelRequest, ...methods: string[]) {
  if (!methods.includes(req.method ?? '')) throw new HttpError(405, 'Method not allowed')
}

export async function json<T>(r: Response, what: string): Promise<T> {
  const text = await r.text()
  if (!r.ok) throw new Error(`${what} failed (${r.status}): ${text.slice(0, 200)}`)
  return (text ? JSON.parse(text) : {}) as T
}
