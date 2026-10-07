'use client'

import {useEffect,useMemo,useRef,useState} from 'react'
import {createClient} from '@/lib/supabase/client'
import {Certificate,downloadCertificatePdf} from '@/app/components/Certificate'

type Sponsorship = any

type Props={
  sponsorships:Sponsorship[]
  signature:string
  onMessage:(message:string)=>void
  onReload:()=>Promise<void>|void
}

export default function CertificateStudio({sponsorships,signature,onMessage,onReload}:Props){
  const active = useMemo(()=>sponsorships.filter(s=>s.status==='active'),[sponsorships])
  const [selectedId,setSelectedId]=useState('')
  const [draft,setDraft]=useState({certificate_for:'',certificate_style:'klassisch',certificate_issued_at:'',chicken_name:'',photo_url:''})
  const certRef=useRef<HTMLDivElement>(null)
  const selected=useMemo(()=>active.find(s=>s.id===selectedId)||null,[active,selectedId])

  useEffect(()=>{
    if(!selectedId && active[0]) setSelectedId(active[0].id)
  },[active,selectedId])

  useEffect(()=>{
    if(!selected)return
    setDraft({
      certificate_for:selected.certificate_for||`${selected.profiles?.first_name||''} ${selected.profiles?.last_name||''}`.trim(),
      certificate_style:selected.certificate_style||'klassisch',
      certificate_issued_at:selected.certificate_issued_at||selected.start_date||new Date().toISOString().slice(0,10),
      chicken_name:selected.chickens?.name||'Patenhuhn',
      photo_url:selected.chickens?.photo_url||''
    })
  },[selected])

  async function save(){
    if(!selected)return
    const supabase=createClient()
    const [{error:sErr},{error:cErr}]=await Promise.all([
      supabase.from('sponsorships').update({
        certificate_for:draft.certificate_for.trim(),
        certificate_style:draft.certificate_style,
        certificate_issued_at:draft.certificate_issued_at
      }).eq('id',selected.id),
      supabase.from('chickens').update({name:draft.chicken_name.trim()||'Patenhuhn'}).eq('id',selected.chickens?.id)
    ])
    const error=sErr||cErr
    if(error){onMessage(error.message);return}
    onMessage('Urkundendaten gespeichert. Die Vorschau und das Patenprofil verwenden jetzt diese Werte.')
    await onReload()
  }

  async function uploadPhoto(file:File){
    if(!selected?.chickens?.id)return
    const supabase=createClient()
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase()
    const path=`${selected.chickens.id}/${Date.now()}.${ext}`
    const{error:uploadError}=await supabase.storage.from('chicken-photos').upload(path,file,{upsert:true})
    if(uploadError){onMessage(uploadError.message);return}
    const{data}=supabase.storage.from('chicken-photos').getPublicUrl(path)
    const{error}=await supabase.from('chickens').update({photo_url:data.publicUrl}).eq('id',selected.chickens.id)
    if(error){onMessage(error.message);return}
    setDraft(d=>({...d,photo_url:data.publicUrl}))
    onMessage('Hühnerfoto gespeichert und in die Urkunde übernommen.')
    await onReload()
  }

  async function download(){
    if(!certRef.current)return
    await downloadCertificatePdf(certRef.current,`Patenhuhn.de-Urkunde-${draft.chicken_name||'Patenhuhn'}.pdf`)
  }

  if(active.length===0)return <section id="certificate-studio" className="card" style={{marginTop:24}}><h2>Urkundenstudio</h2><p className="muted">Sobald eine aktive Patenschaft angelegt wurde, kannst du hier ihre Urkunde bearbeiten und als PDF prüfen.</p></section>

  return <section id="certificate-studio" className="card" style={{marginTop:24}}>
    <div className="studioHead"><div><div className="eyebrow">URKUNDENSTUDIO</div><h2>Urkunde fertigstellen & prüfen</h2><p className="muted">Patenschaft auswählen, Daten und Foto einsetzen und die fertige Urkunde direkt prüfen. Die gespeicherte digitale Unterschrift wird automatisch eingeblendet.</p></div><button className="btn" type="button" onClick={download}>PDF herunterladen</button></div>
    <div className="certificateStudioGrid">
      <div className="certificateStudioControls">
        <div className="field"><label>Patenschaft</label><select value={selectedId} onChange={e=>setSelectedId(e.target.value)}>{active.map(s=><option key={s.id} value={s.id}>{s.profiles?.first_name} {s.profiles?.last_name} · {s.chickens?.name}</option>)}</select></div>
        <div className="field"><label>Hühnername</label><input value={draft.chicken_name} onChange={e=>setDraft(d=>({...d,chicken_name:e.target.value}))}/></div>
        <div className="field"><label>Urkunde ausgestellt für</label><input value={draft.certificate_for} onChange={e=>setDraft(d=>({...d,certificate_for:e.target.value}))}/></div>
        <div className="field"><label>Vom Kunden gewählte Urkundenvorlage</label><div className="adminCertificateStyleChoices">{['klassisch','natur','mittelalter','comic'].map(style=><button type="button" key={style} onClick={()=>setDraft(d=>({...d,certificate_style:style}))} className={'adminCertificateStyleChoice '+(draft.certificate_style===style?'selected':'')}><div className="adminCertificateMini"><Certificate compact styleName={style} chickenName={draft.chicken_name||'Lotta'} certificateFor={draft.certificate_for||'Max Mustermann'} issuedAt={draft.certificate_issued_at||new Date().toISOString().slice(0,10)} photoUrl={draft.photo_url||null}/></div><span>{style==='klassisch'?'Klassisch':style==='natur'?'Natur':style==='mittelalter'?'Mittelalter':'Comic'}</span>{draft.certificate_style===style&&<b>✓</b>}</button>)}</div><p className="small muted">Die beim Bestellen gewählte Vorlage ist bereits vorausgewählt. Du kannst sie bei Bedarf vor dem Erstellen der Urkunde ändern.</p></div>
        <div className="field"><label>Ausstellungsdatum</label><input type="date" value={draft.certificate_issued_at} onChange={e=>setDraft(d=>({...d,certificate_issued_at:e.target.value}))}/></div>
        <div className="field"><label>Hühnerfoto</label><label className="uploadBtn certificateUpload">Foto auswählen<input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)uploadPhoto(f)}}/></label>{draft.photo_url&&<span className="hint small">Foto ist hinterlegt.</span>}</div>
        <button className="btn" type="button" onClick={save}>Urkunde fertigstellen & speichern</button>
        <p className="small muted">Digitale Unterschrift: {signature?'gespeichert ✓':'nicht gespeichert – die Urkunde bleibt mit Unterschriftslinie zum Ausdrucken.'}</p>
      </div>
      <div className="certificateStudioPreview"><div className="previewLabel">Fertige Urkunde · Live-Vorschau</div><Certificate ref={certRef} styleName={draft.certificate_style} chickenName={draft.chicken_name||'Patenhuhn'} certificateFor={draft.certificate_for} issuedAt={draft.certificate_issued_at||new Date().toISOString().slice(0,10)} photoUrl={draft.photo_url||null} signatureDataUrl={signature||null}/></div>
    </div>
  </section>
}
