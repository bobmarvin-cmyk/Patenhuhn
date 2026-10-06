'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        return
      }
      router.push('/stall')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="main">
      <div className="card form">
        <h1>Einloggen</h1>
        <p className="muted">Melde dich an, um deinen digitalen Hühnerstall zu öffnen.</p>
        {message && <div className="notice error">{message}</div>}
        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="email">E-Mail</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Passwort</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Einloggen…' : 'Einloggen'}</button>
        </form>
      </div>
    </main>
  )
}
