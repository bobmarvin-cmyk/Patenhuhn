'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type StallData = {
  chickenName: string
  breed: string
  availableEggs: number
  weekEggs: number
  isDemo: boolean
}

export default function StallPage() {
  const router = useRouter()
  const [data, setData] = useState<StallData | null>(null)
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: authData } = await supabase.auth.getUser()

        if (!authData.user) {
          setData({ chickenName: 'Lotta', breed: 'Welsumer', availableEggs: 24, weekEggs: 4, isDemo: true })
          return
        }

        const { data: sponsorship, error } = await supabase
          .from('sponsorships')
          .select('id, chicken_id, chickens(name, breed)')
          .eq('user_id', authData.user.id)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle()

        if (error || !sponsorship) {
          setData({ chickenName: 'Noch kein Huhn', breed: 'Keine aktive Patenschaft', availableEggs: 0, weekEggs: 0, isDemo: false })
          return
        }

        const { data: tx } = await supabase
          .from('egg_transactions')
          .select('amount, type, week_start')
          .eq('sponsorship_id', sponsorship.id)

        const balance = (tx ?? []).reduce((sum: number, row: { amount: number }) => sum + Number(row.amount || 0), 0)

        const monday = new Date()
        const day = monday.getDay()
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1)
        monday.setDate(diff)
        const currentWeek = monday.toISOString().slice(0, 10)
        const weeklyCredit = (tx ?? []).find((row: { type: string; week_start: string | null }) =>
          row.type === 'weekly_credit' && row.week_start === currentWeek
        )
        const chicken = Array.isArray(sponsorship.chickens) ? sponsorship.chickens[0] : sponsorship.chickens

        setData({
          chickenName: chicken?.name ?? 'Patenhuhn',
          breed: chicken?.breed ?? 'Unbekannte Rasse',
          availableEggs: balance,
          weekEggs: Math.min(6, Math.max(0, Number(weeklyCredit?.amount ?? 0))),
          isDemo: false
        })
      } catch (error) {
        setInfo(error instanceof Error ? error.message : 'Daten konnten nicht geladen werden.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const eggs = useMemo(() => Array.from({ length: 6 }, (_, i) => i < (data?.weekEggs ?? 0)), [data])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) return <main className="main"><div className="card">Hühnerstall wird geöffnet…</div></main>

  return (
    <main className="main">
      <div className="stallTop">
        <div>
          <div className="muted">Mein Hühnerstall</div>
          <h1 style={{marginTop:6}}>Willkommen im Stall 🐔</h1>
        </div>
        <button className="btn secondary" onClick={logout}>Abmelden</button>
      </div>

      {data?.isDemo && <div className="notice">Demo-Modus: Noch kein Login erkannt. So wird der Stall später aussehen.</div>}
      {info && <div className="notice error">{info}</div>}

      <section className="card chickenCard">
        <div className="chickenAvatar">🐔</div>
        <div>
          <div className="muted">Dein Patenhuhn</div>
          <h2 style={{fontSize:'2rem', margin:'4px 0'}}>{data?.chickenName}</h2>
          <div className="muted">{data?.breed}</div>

          <div className="eggRow">
            {eggs.map((filled, i) => <span key={i} className={`egg ${filled ? '' : 'empty'}`} />)}
          </div>
          <strong>{data?.weekEggs ?? 0} von 6 Eiern diese Woche</strong>
        </div>
      </section>

      <section className="grid" style={{marginTop:18}}>
        <div className="card">
          <div className="muted">Verfügbares Eierguthaben</div>
          <div className="stat">{data?.availableEggs ?? 0} 🥚</div>
        </div>
        <div className="card">
          <div className="muted">Wochenanspruch</div>
          <div className="stat">6 🥚</div>
        </div>
        <div className="card">
          <div className="muted">Nächster Schritt</div>
          <button className="btn" style={{marginTop:10}} onClick={() => setInfo('Abholcodes bauen wir in V0.3 ein.')}>Eier abholen</button>
        </div>
      </section>
    </main>
  )
}
