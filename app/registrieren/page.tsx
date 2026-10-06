'use client'
import {FormEvent,useState} from 'react'
import Link from 'next/link'
import {createClient} from '@/lib/supabase/client'

export default function RegisterPage(){
 const[firstName,setFirstName]=useState('');const[lastName,setLastName]=useState('');const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[msg,setMsg]=useState('');const[ok,setOk]=useState(false)
 async function submit(e:FormEvent){
  e.preventDefault();setMsg('');setOk(false)
  const supabase=createClient()
  const redirectTo=`${window.location.origin}/login?confirmed=1`
  const{data,error}=await supabase.auth.signUp({email,password,options:{data:{first_name:firstName,last_name:lastName},emailRedirectTo:redirectTo}})
  if(error){setMsg(error.message);return}
  setOk(true)
  if(data.session){setMsg('Dein Konto wurde direkt angelegt. Für dieses Supabase-Projekt ist keine E-Mail-Bestätigung erforderlich. Du kannst dich jetzt anmelden.')}
  else{setMsg(`Konto angelegt. Supabase hat – sofern „Confirm email“ aktiviert ist und der Mailversand eingerichtet ist – eine Bestätigung an ${email} ausgelöst. Bitte auch den Spam-Ordner prüfen.`)}
 }
 return <main className="main page"><div className="pageHead"><div className="eyebrow">KUNDENKONTO</div><h1 className="pageTitle">Dein digitaler Hühnerstall.</h1><p>Einmal registrieren – danach verwaltest du Patenschaft, digitales Nest, Urkunden und Abholcodes bequem in deinem Konto.</p></div><div className="card formCard">{msg&&<div className={'notice '+(ok?'success':'error')}>{msg}</div>}<form onSubmit={submit}><div className="formGrid"><div className="field"><label>Vorname</label><input value={firstName} onChange={e=>setFirstName(e.target.value)} required/></div><div className="field"><label>Nachname</label><input value={lastName} onChange={e=>setLastName(e.target.value)} required/></div><div className="field full"><label>E-Mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div className="field full"><label>Passwort</label><input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required/><span className="hint small">Mindestens 8 Zeichen.</span></div></div><button className="btn">Konto anlegen</button></form><p className="small muted">Schon registriert? <Link href="/login"><strong>Anmelden</strong></Link></p></div></main>
}
