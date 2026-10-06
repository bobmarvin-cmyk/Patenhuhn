'use client'

import { forwardRef } from 'react'

type Props = {
  styleName?: string | null
  chickenName: string
  certificateFor: string
  issuedAt: string
  photoUrl?: string | null
  signatureDataUrl?: string | null
  compact?: boolean
}

export const Certificate = forwardRef<HTMLDivElement, Props>(function Certificate({
  styleName='klassisch', chickenName, certificateFor, issuedAt, photoUrl, signatureDataUrl, compact=false
}, ref){
  const style = ['klassisch','natur','mittelalter','comic'].includes(styleName||'') ? styleName : 'klassisch'
  const date = new Date(issuedAt+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'})
  return <div ref={ref} className={`certificate certificate-${style} ${compact?'certificateCompact':''}`}>
    <div className="certificateInner">
      <div className="certificateBrand">🐔 <strong>Patenhuhn.de</strong></div>
      <h2>Patenschaftsurkunde</h2>
      <p className="certificateIntro">Hiermit bestätigen wir die Patenschaft für das Huhn</p>
      <div className="certificateChicken">{chickenName}</div>
      <div className="certificatePhoto">{photoUrl?<img src={photoUrl} alt={chickenName}/>:<span>🐔</span>}</div>
      <div className="certificateFor"><small>Urkunde ausgestellt für</small><strong>{certificateFor||'Hühnerpatin / Hühnerpate'}</strong></div>
      <p className="certificateText">Diese Patenschaft unterstützt eine artgerechte Freilandhaltung mit Mobilställen und trägt dazu bei, unsere Hühner gut zu versorgen und zu schützen.</p>
      <div className="certificateDate">Namborn, den {date}</div>
      <div className="certificateSignature">
        {signatureDataUrl?<img src={signatureDataUrl} alt="Digitale Unterschrift"/>:<div className="signatureLine"/>}
        <small>Unterschrift</small>
      </div>
      <div className="certificateFoot"><span>Ein Projekt von</span><img src="/bobs-eier-logo.png" alt="BoBs Eier"/></div>
    </div>
  </div>
})


export async function downloadCertificatePdf(element: HTMLElement, filename: string){
  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')
  const canvas = await html2canvas(element,{scale:2,useCORS:true,backgroundColor:'#fffdf7'})
  const img = canvas.toDataURL('image/png',1)
  const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
  const pageW=210, pageH=297
  const ratio=Math.min(pageW/canvas.width,pageH/canvas.height)
  const w=canvas.width*ratio, h=canvas.height*ratio
  pdf.addImage(img,'PNG',(pageW-w)/2,(pageH-h)/2,w,h)
  pdf.save(filename)
}
