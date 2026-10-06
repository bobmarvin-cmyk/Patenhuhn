import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="main">
      <section className="hero">
        <div>
          <div className="muted">Echte Patenschaft · echte Eier · digital verwaltet</div>
          <h1>Dein Huhn. Dein Stall. Deine Eier.</h1>
          <p>
            Mit Patenhuhn übernimmst du die Patenschaft für ein Huhn auf einem teilnehmenden Hof.
            Jede aktive Patenschaft bringt dir 6 echte Eier pro Woche. In deinem digitalen Hühnerstall
            siehst du dein Huhn, dein Eierguthaben und kannst deine Eier per Abholcode einlösen.
          </p>
          <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:22}}>
            <Link className="btn" href="/login">Jetzt einloggen</Link>
            <Link className="btn secondary" href="/stall">Demo-Stall ansehen</Link>
          </div>
        </div>
        <div className="card">
          <div className="chickenAvatar" style={{margin:'0 auto 18px'}}>🐔</div>
          <h2 style={{textAlign:'center', marginBottom:8}}>Lotta</h2>
          <p className="muted" style={{textAlign:'center'}}>Dein digitales Patenhuhn</p>
          <div className="eggRow" style={{justifyContent:'center'}}>
            <span className="egg"/><span className="egg"/><span className="egg"/><span className="egg"/>
            <span className="egg empty"/><span className="egg empty"/>
          </div>
          <div style={{textAlign:'center'}}><strong>4 von 6 Eiern diese Woche</strong></div>
        </div>
      </section>

      <section className="grid" style={{marginTop:28}}>
        <div className="card feature"><h3>🥚 6 Eier pro Woche</h3><p>Jede aktive Patenschaft erzeugt ein nachvollziehbares Eierguthaben.</p></div>
        <div className="card feature"><h3>📱 Digitaler Hühnerstall</h3><p>Sieh dein Patenhuhn, den Wochenstand und dein angespartes Guthaben.</p></div>
        <div className="card feature"><h3>🔐 Sichere Abholcodes</h3><p>Beim Einlösen werden Eier reserviert und erst bei Ausgabe endgültig verbucht.</p></div>
      </section>
    </main>
  )
}
