import Link from 'next/link'

const styles = [
  { key:'klassisch', title:'Klassisch', sub:'Zeitlos und elegant', text:'Schlichte, ruhige Gestaltung mit feinen Linien und zurückhaltenden Naturdetails.' },
  { key:'natur', title:'Natur', sub:'Frisch und lebendig', text:'Blumen, Grün und ein freundlicher Hofcharakter – passend zur Freilandhaltung.' },
  { key:'mittelalter', title:'Mittelalter', sub:'Rustikal und besonders', text:'Pergament-Optik, kräftige Rahmen und ein markanter, historischer Charakter.' },
  { key:'comic', title:'Comic', sub:'Modern und liebevoll', text:'Illustrativer, freundlicher Stil mit etwas mehr Farbe – ohne kindlich zu wirken.' },
]

export default function UrkundenPage(){
  return <main>
    <section className="certificateHero">
      <div className="main certificateHeroInner">
        <div>
          <div className="eyebrow">PATENHUHN.DE URKUNDEN</div>
          <h1>Deine Patenschaft bekommt ihre eigene Urkunde.</h1>
          <p>Bei jeder Patenschaft wählst du einen Urkundenstil. Hühnername, Name der Patin oder des Paten, Foto und Ausstellungsdatum werden automatisch eingesetzt. Die fertige Urkunde erscheint im persönlichen Hühnerstall und kann als PDF heruntergeladen werden.</p>
          <div className="actions"><Link className="btn" href="/bestellen">Patenhuhn anfragen</Link><Link className="btn ghost" href="/stall">Mein Stall</Link></div>
        </div>
        <div className="certificateShowcaseFrame"><img src="/urkunden-muster.png" alt="Vier Patenhuhn.de Urkundenstile und Ablauf der digitalen Urkunde"/></div>
      </div>
    </section>

    <section className="main section">
      <div className="sectionIntro"><div className="eyebrow">VIER STILE</div><h2>Welche Urkunde passt zu deiner Patenschaft?</h2><p className="muted">Alle Varianten enthalten dieselben persönlichen Daten. Nur das Erscheinungsbild unterscheidet sich.</p></div>
      <div className="publicCertificateGrid">
        {styles.map(s=><article className={`publicCertificateCard ${s.key}`} key={s.key}>
          <div className={`publicCertificatePreview ${s.key}`}><span>Patenhuhn.de</span><strong>Urkunde</strong><div>🐔</div></div>
          <h3>{s.title}</h3><b>{s.sub}</b><p>{s.text}</p>
        </article>)}
      </div>
    </section>

    <section className="warmSection">
      <div className="main">
        <div className="sectionIntro"><div className="eyebrow">SO ENTSTEHT SIE</div><h2>Vom Hühnerfoto bis zur fertigen PDF.</h2></div>
        <div className="certificateFlow">
          <article><span>1</span><h3>Patenschaft bestellen</h3><p>Du wählst deinen Urkundenstil und gibst an, für wen die Urkunde ausgestellt werden soll.</p></article>
          <article><span>2</span><h3>Henne zuordnen</h3><p>Im Adminbereich werden Henne, Foto, Startdatum und die Daten deiner Patenschaft ergänzt.</p></article>
          <article><span>3</span><h3>Optional digital unterschreiben</h3><p>Die Urkunde kann digital unterschrieben werden. Ohne digitale Signatur bleibt eine Linie für eine handschriftliche Unterschrift.</p></article>
          <article><span>4</span><h3>Im Patenprofil verfügbar</h3><p>Du kannst deine Urkunde jederzeit ansehen und als PDF herunterladen.</p></article>
        </div>
      </div>
    </section>
  </main>
}
