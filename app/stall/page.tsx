'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { createClient } from '@/lib/supabase/client'

type Sponsorship = {
  id: string
  eggs_per_week: number
  start_date: string
  chicken_id: string
  chickens: { id:string; name:string; breed:string|null; photo_url:string|null; farms:{id:string;name:string;city:string|null}|null } | null
  balance: number
  weekEggs: number
}

type Redemption = { id:string; sponsorship_id:string; egg_count:number; code:string; status:string; expires_at:string; created_at:string }

export default function StallPage(){
  const router=useRouter()
  const [items,setItems]=useState<Sponsorship[]>([])
  const [codes,setCodes]=useState<Redemption[]>([])
  const [loading,setLoading]=useState(true)
  const [msg,setMsg]=useState('')
  const [amounts,setAmounts]=useState<Record<string,number>>({})

  useEffect(()=>{load()},[])

  async function load(){
    setLoading(true); setMsg('')
    const supabase=createClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){router.push('/login');return}

    const {data:sponsorships,error}=await supabase
      .from('sponsorships')
      .select('id,eggs_per_week,start_date,chicken_id,chickens(id,name,breed,photo_url,farms(id,name,city))')
      .eq('user_id',user.id).eq('status','active').order('created_at',{ascending:true})
    if(error){setMsg(error.message);setLoading(false);return}

    const enriched:Sponsorship[]=[]
    for(const raw of (sponsorships||[]) as any[]){
      await supabase.rpc('credit_weekly_eggs',{p_sponsorship_id:raw.id})
      const {data:tx}=await supabase.from('egg_transactions').select('amount,type,week_start').eq('sponsorship_id',raw.id)
      const balance=(tx||[]).reduce((n:number,r:any)=>n+Number(r.amount||0),0)
      const monday=new Date(); const day=monday.getDay(); monday.setDate(monday.getDate()-day+(day===0?-6:1)); const week=monday.toISOString().slice(0,10)
      const weekly=(tx||[]).find((r:any)=>r.type==='weekly_credit'&&r.week_start===week)
      enriched.push({...raw,balance,weekEggs:Math.min(Number(raw.eggs_per_week||6),Math.max(0,Number(weekly?.amount||0)))})
    }
    setItems(enriched)
    const ids=enriched.map(x=>x.id)
    if(ids.length){
      const {data:r}=await supabase.from('redemptions').select('id,sponsorship_id,egg_count,code,status,expires_at,created_at').in('sponsorship_id',ids).order('created_at',{ascending:false})
      setCodes((r||[]) as Redemption[])
    }else setCodes([])
    setLoading(false)
  }

  async function createCode(s:Sponsorship){
    const amount=amounts[s.id]||6
    if(amount<1||amount>s.balance){setMsg('Bitte eine gültige Eiermenge wählen.');return}
    const supabase=createClient()
    const {data:settings}=await supabase.from('site_settings').select('value').eq('key','redemption_valid_days').maybeSingle()
    const days=Number(settings?.value||7)
    const {error}=await supabase.rpc('create_redemption',{p_sponsorship_id:s.id,p_egg_count:amount,p_valid_days:days})
    if(error){setMsg(error.message);return}
    setMsg(`Abholcode für ${amount} Eier erstellt.`); await load()
  }

  async function cancelCode(id:string){
    const supabase=createClient(); const {error}=await supabase.rpc('cancel_redemption',{p_redemption_id:id})
    if(error){setMsg(error.message);return} setMsg('Code storniert, Eier wurden zurückgebucht.'); await load()
  }

  async function logout(){const supabase=createClient();await supabase.auth.signOut();router.push('/');router.refresh()}

  if(loading)return <main className="main page"><div className="card">Hühnerstall wird geöffnet…</div></main>

  return <main className="main page">
    <div className="stallTop"><div><div className="eyebrow">MEIN DIGITALER HÜHNERSTALL</div><h1 className="pageTitle">Deine Hühner & Eier</h1><p className="muted">Jede aktive Patenschaft erhält ihr vereinbartes Wochenkontingent. Nicht abgeholte Eier bleiben als Guthaben erhalten.</p></div><button className="btn secondary" onClick={logout}>Abmelden</button></div>
    {msg&&<div className="notice">{msg}</div>}
    {!items.length&&<div className="card"><h2>Noch keine aktive Patenschaft</h2><p className="muted">Sobald deine Bestellung einem Huhn zugeordnet wurde, erscheint es hier.</p><Link className="btn" href="/bestellen">Patenhuhn bestellen</Link></div>}
    <div className="stallList">
      {items.map(s=><section className="card chickenCardV2" key={s.id}>
        <div className="chickenAvatar">🐔</div>
        <div className="chickenMain"><div className="muted">{s.chickens?.farms?.name||'Patenhuhn-Hof'}{s.chickens?.farms?.city?` · ${s.chickens.farms.city}`:''}</div><h2>{s.chickens?.name||'Patenhuhn'}</h2>          <div className="eggRow">{Array.from({length:s.eggs_per_week},(_,i)=><span key={i} className={'egg '+(i<s.weekEggs?'':'empty')}/>)}</div>
          <strong>{s.weekEggs} von {s.eggs_per_week} Eiern diese Woche</strong>
        </div>
        <div className="balanceBox"><span className="muted">Verfügbar</span><strong>{s.balance} 🥚</strong><div className="redeemRow"><input type="number" min={1} max={Math.max(1,s.balance)} value={amounts[s.id]||Math.min(6,Math.max(1,s.balance))} onChange={e=>setAmounts(a=>({...a,[s.id]:Number(e.target.value)}))}/><button className="btn" disabled={s.balance<1} onClick={()=>createCode(s)}>Abholcode</button></div></div>
      </section>)}
    </div>

    {!!codes.length&&<section style={{marginTop:30}}><div className="eyebrow">ABHOLCODES</div><h2 className="sectionTitle">Deine Codes</h2><div className="codeGrid">{codes.map(c=><article className="card codeCard" key={c.id}><div><span className={'statusBadge '+c.status}>{c.status==='open'?'gültig':c.status==='redeemed'?'eingelöst':c.status==='cancelled'?'storniert':'abgelaufen'}</span><h3>{c.egg_count} Eier</h3><div className="bigCode">{c.code}</div><p className="small muted">Gültig bis {new Date(c.expires_at).toLocaleString('de-DE')}</p>{c.status==='open'&&<button className="btn ghost" onClick={()=>cancelCode(c.id)}>Code stornieren</button>}</div><div className="qrBox"><QRCodeSVG value={c.code} size={128} /></div></article>)}</div></section>}
  </main>
}
