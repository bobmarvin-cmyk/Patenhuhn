import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <section className="heroBand">
        <div className="hero main">
          <div>
            <div className="eyebrow">REGIONAL · FAIR · DIGITAL</div>
            <h1>Lieber gleich<br/><em>das eigene Huhn.</em></h1>
            <p className="lead">Übernimm eine Patenschaft für ein Huhn aus artgerechter Freilandhaltung. Dein Patenhuhn steht für <strong>6 echte Eier pro Woche</strong> – gesammelt in deinem digitalen Hühnerstall.</p>
            <div className="actions">
              <Link className="btn" href="/bestellen">Patenhuhn auswählen</Link>
              <Link className="btn ghost" href="/stall">Digitalen Stall ansehen</Link>
            </div>
            <div className="trustRow"><span>✓ Freilandhaltung</span><span>✓ Mobile Ställe</span><span>✓ Regionale Vermittlung</span></div>
          </div>
          <div className="heroVisual">
            <div className="sun" />
            <div className="barnCard">
              <div className="barnTop"><span>Dein Patenhuhn</span><span className="statusDot">aktiv</span></div>
              <div className="hen">🐔</div>
              <h2>Lotta</h2>
              <p>Welsumer · BoBs Hühnerhof</p>
              <div className="nest"><span>🥚</span><span>🥚</span><span>🥚</span><span>🥚</span><span className="dim">🥚</span><span className="dim">🥚</span></div>
              <div className="progress"><i style={{width:'66%'}} /></div>
              <small>4 von 6 Eiern diese Woche</small>
            </div>
          </div>
        </div>
      </section>

      <section className="main section">
        <div className="sectionIntro"><div className="eyebrow">SO FUNKTIONIERT'S</div><h2>Vom Huhn bis zum Frühstücksei.</h2></div>
        <div className="steps">
          <article><b>01</b><h3>Patenschaft wählen</h3><p>Personalisiert oder flexibel, passende Eiergröße und auf Wunsch Premium.</p></article>
          <article><b>02</b><h3>Eier sammeln</h3><p>Pro aktivem Patenhuhn wachsen jede Woche 6 echte Eier in deinem digitalen Guthaben.</p></article>
          <article><b>03</b><h3>Code einlösen</h3><p>Du erzeugst einen Abholcode und erhältst damit deine Eier oder verfügbare Tauschprodukte.</p></article>
        </div>
      </section>

      <section className="warmSection">
        <div className="main split">
          <div><div className="eyebrow">MEHR ALS EIER</div><h2>Eine Verbindung zwischen Huhn und Mensch.</h2><p>Zur Patenschaft gehören Informationen zu deinem Huhn, freie Namenswahl bei personalisierten Patenschaften und transparente Haltung. Die Tiere leben im Freiland mit mobilen Ställen und Hähnen.</p></div>
          <div className="benefitList"><div>🥚 <span><strong>6 Eier je Woche</strong><small>ansparbar im digitalen Stall</small></span></div><div>🌿 <span><strong>Freiland & Mobilstall</strong><small>mit Hähnen und naturnaher Haltung</small></span></div><div>📜 <span><strong>Patenschaftsurkunde</strong><small>für dich oder als Geschenk</small></span></div><div>📍 <span><strong>Möglichst regional</strong><small>kurze Wege zu deinen Eiern</small></span></div></div>
        </div>
      </section>
    </main>
  )
}
