'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { createClient } from '@/lib/supabase/client'
import {Certificate,downloadCertificatePdf} from '@/app/components/Certificate'

type Sponsorship = {
  id:string; eggs_per_week:number; start_date:string; chicken_id:string; certificate_for:string|null; certificate_style:string|null; certificate_issued_at:string|null;
  chickens:{id:string;name:string;photo_url:string|null;farms:{id:string;name:string;city:string|null}|null}|null;
  balance:number;weekEggs:number
}
type Redemption={id:string;sponsorship_id:string;egg_count:number;code:string;status:string;expires_at:string;created_at:string}

function CertificateBlock({s,signature}:{s:Sponsorship;signature:string}){
 const ref=useRef<HTMLDivElement|null>(null);const[open,setOpen]=useState(false)
 async function download(){if(!ref.current)return;await downloadCertificatePdf(ref.current,`Patenhuhn.de-Urkunde-${s.chickens?.name||'Patenhuhn'}.pdf`)}
 return <div className="certificateProfile"><div className="certificateProfileHead"><div><div className="eyebrow">PATENSCHAFTSURKUNDE</div><h3>{s.certificate_for||'Deine Urkunde'}</h3></div><div className="certificateProfileActions"><button className="btn ghost" onClick={()=>setOpen(v=>!v)}>{open?'Urkunde schließen':'Urkunde ansehen'}</button><button className="btn" onClick={download}>PDF herunterladen</button></div></div><div className={open?'certificateProfilePreview open':'certificateProfilePreview'}><Certificate ref={ref} styleName={s.certificate_style} chickenName={s.chickens?.name||'Patenhuhn'} certificateFor={s.certificate_for||''} issuedAt={s.certificate_issued_at||s.start_date} photoUrl={s.chickens?.photo_url} signatureDataUrl={signature}/></div>{!open&&<div className="certificatePrintSource" aria-hidden="true"><Certificate ref={ref} styleName={s.certificate_style} chickenName={s.chickens?.name||'Patenhuhn'} certificateFor={s.certificate_for||''} issuedAt={s.certificate_issued_at||s.start_date} photoUrl={s.chickens?.photo_url} signatureDataUrl={signature}/></div>}</div>
}

export default function StallPage(){
 const router=useRouter();const[items,setItems]=useState<Sponsorship[]>([]),[codes,setCodes]=useState<Redemption[]>([]),[loading,setLoading]=useState(true),[msg,setMsg]=useState(''),[amounts,setAmounts]=useState<Record<string,number>>({}),[signature,setSignature]=useState('')
 useEffect(()=>{load()},[])
 async function load(){setLoading(true);setMsg('');const supabase=createClient();const{data:{user}}=await supabase.auth.getUser();if(!user){router.push('/login');return}
  const[{data:sponsorships,error},{data:sig}]=await Promise.all([
   supabase.from('sponsorships').select('id,eggs_per_week,start_date,chicken_id,certificate_for,certificate_style,certificate_issued_at,chickens(id,name,photo_url,farms(id,name,city))').eq('user_id',user.id).eq('status','active').order('created_at',{ascending:true}),
   supabase.from('site_settings').select('value').eq('key','certificate_signature_data_url').maybeSingle()
  ]);if(error){setMsg(error.message);setLoading(false);return}setSignature(sig?.value||'')
  const enriched:Sponsorship[]=[];for(const raw of (sponsorships||[]) as any[]){await supabase.rpc('credit_weekly_eggs',{p_sponsorship_id:raw.id});const{data:tx}=await supabase.from('egg_transactions').select('amount,type,week_start').eq('sponsorship_id',raw.id);const balance=(tx||[]).reduce((n:number,r:any)=>n+Number(r.amount||0),0);const monday=new Date();const day=monday.getDay();monday.setDate(monday.getDate()-day+(day===0?-6:1));const week=monday.toISOString().slice(0,10);const weekly=(tx||[]).find((r:any)=>r.type==='weekly_credit'&&r.week_start===week);enriched.push({...raw,balance,weekEggs:Math.min(Number(raw.eggs_per_week||6),Math.max(0,Number(weekly?.amount||0)))})}
  setItems(enriched);const ids=enriched.map(x=>x.id);if(ids.length){const{data:r}=await supabase.from('redemptions').select('id,sponsorship_id,egg_count,code,status,expires_at,created_at').in('sponsorship_id',ids).order('created_at',{ascending:false});setCodes((r||[]) as Redemption[])}else setCodes([]);setLoading(false)}
 async function createCode(s:Sponsorship){const amount=amounts[s.id]||6;if(amount<1||amount>s.balance){setMsg('Bitte eine gültige Eiermenge wählen.');return}const supabase=createClient();const{data:settings}=await supabase.from('site_settings').select('value').eq('key','redemption_valid_days').maybeSingle();const days=Number(settings?.value||7);const{error}=await supabase.rpc('create_redemption',{p_sponsorship_id:s.id,p_egg_count:amount,p_valid_days:days});if(error){setMsg(error.message);return}setMsg(`Abholcode für ${amount} Eier erstellt.`);await load()}
 async function cancelCode(id:string){const supabase=createClient();const{error}=await supabase.rpc('cancel_redemption',{p_redemption_id:id});if(error){setMsg(error.message);return}setMsg('Code storniert, Eier wurden zurückgebucht.');await load()}
 async function logout(){const supabase=createClient();await supabase.auth.signOut();router.push('/');router.refresh()}
 if(loading)return <main className="main page"><div className="card">Hühnerstall wird geöffnet…</div></main>
 return <main className="main page"><div className="stallTop"><div><div className="eyebrow">MEIN PATENHUHN.DE STALL</div><h1 className="pageTitle">Deine Hühner & dein digitales Nest</h1><p className="muted">Jedes Patenhuhn legt 6 Eier pro Woche für dein digitales Nest. Nicht abgeholte Eier bleiben erhalten.</p></div><button className="btn secondary" onClick={logout}>Abmelden</button></div>{msg&&<div className="notice">{msg}</div>}
 {!items.length&&<div className="card"><h2>Noch keine aktive Patenschaft</h2><p className="muted">Sobald deine Anfrage bestätigt und ein Huhn zugeordnet wurde, erscheint es hier.</p><Link className="btn" href="/bestellen">Patenhuhn bestellen</Link></div>}
 <div className="stallList">{items.map(s=><section className="card patronCard" key={s.id}><div className="chickenCardV2"><div>{s.chickens?.photo_url?<img className="profileChickenPhoto" src={s.chickens.photo_url} alt={s.chickens.name}/>:<div className="chickenAvatar">🐔</div>}</div><div className="chickenMain"><div className="muted">{s.chickens?.farms?.name||'Patenhuhn-Hof'}{s.chickens?.farms?.city?` · ${s.chickens.farms.city}`:''}</div><h2>{s.chickens?.name||'Patenhuhn'}</h2><div className="eggRow">{Array.from({length:s.eggs_per_week},(_,i)=><span key={i} className={'egg '+(i<s.weekEggs?'':'empty')}/>)}</div><strong>{s.weekEggs} von {s.eggs_per_week} Eiern diese Woche</strong></div><div className="balanceBox"><span className="muted">Im digitalen Nest</span><strong>{s.balance} 🥚</strong><div className="redeemRow"><input type="number" min={1} max={Math.max(1,s.balance)} value={amounts[s.id]||Math.min(6,Math.max(1,s.balance))} onChange={e=>setAmounts(a=>({...a,[s.id]:Number(e.target.value)}))}/><button className="btn" disabled={s.balance<1} onClick={()=>createCode(s)}>Abholcode</button></div></div></div><CertificateBlock s={s} signature={signature}/></section>)}</div>
 {!!codes.length&&<section style={{marginTop:30}}><div className="eyebrow">ABHOLCODES</div><h2 className="sectionTitle">Deine Codes</h2><div className="codeGrid">{codes.map(c=><article className="card codeCard" key={c.id}><div><span className={'statusBadge '+c.status}>{c.status==='open'?'gültig':c.status==='redeemed'?'eingelöst':c.status==='cancelled'?'storniert':'abgelaufen'}</span><h3>{c.egg_count} Eier</h3><div className="bigCode">{c.code}</div><p className="small muted">Gültig bis {new Date(c.expires_at).toLocaleString('de-DE')}</p>{c.status==='open'&&<button className="btn ghost" onClick={()=>cancelCode(c.id)}>Code stornieren</button>}</div><div className="qrBox"><QRCodeSVG value={c.code} size={128}/></div></article>)}</div></section>}
 </main>
}
