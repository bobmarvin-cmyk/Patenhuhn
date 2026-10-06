'use client'
import {FormEvent,useEffect,useState} from 'react'
import Link from 'next/link'
import {createClient} from '@/lib/supabase/client'

export default function HofPage(){
 const[allowed,setAllowed]=useState<boolean|null>(null); const[code,setCode]=useState(''); const[msg,setMsg]=useState(''); const[result,setResult]=useState<any>(null)
 useEffect(()=>{(async()=>{const supabase=createClient();const{data:{user}}=await supabase.auth.getUser();if(!user){setAllowed(false);return}const{data:p}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();setAllowed(p?.role==='farm'||p?.role==='admin')})()},[])
 async function submit(e:FormEvent){e.preventDefault();setMsg('');setResult(null);const supabase=createClient();const{data,error}=await supabase.rpc('redeem_code',{p_code:code.trim().toUpperCase()});if(error){setMsg(error.message);return}setResult(data);setMsg('Code erfolgreich eingelöst. Eier können ausgegeben werden.');setCode('')}
 if(allowed===null)return <main className="main page">Hofzugang wird geprüft…</main>
 if(!allowed)return <main className="main page"><div className="card"><h1>Hofzugang</h1><p className="muted">Dieser Bereich ist nur für Hof- oder Administratorkonten vorgesehen.</p><Link className="btn" href="/login">Anmelden</Link></div></main>
 return <main className="main page"><div className="pageHead"><div className="eyebrow">EIERAUSGABE</div><h1 className="pageTitle">Abholcode einlösen</h1><p>Code vom Smartphone des Paten eingeben. Ein gültiger Code kann nur einmal eingelöst werden.</p></div><form className="card redeemForm" onSubmit={submit}><label>Abholcode</label><input value={code} onChange={e=>setCode(e.target.value)} placeholder="HUHN-AB12-CD34" autoCapitalize="characters" required/><button className="btn">Code prüfen & einlösen</button>{msg&&<div className={'notice '+(result?'success':'error')}>{msg}</div>}{result&&<div className="receipt"><strong>{result.egg_count} Eier</strong><span>{result.code}</span><span>eingelöst: {new Date(result.redeemed_at).toLocaleString('de-DE')}</span></div>}</form></main>
}
