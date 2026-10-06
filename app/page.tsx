import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <section className="heroBand farmHero">
        <div className="hero main">
          <div className="heroCopy">
            <div className="eyebrow">REGIONAL · FAIR · PERSÖNLICH</div>
            <h1>Dein Patenhuhn.<br/><em>Deine Eier.</em></h1>
            <p className="lead">Übernimm eine Patenschaft für eine Henne aus Freilandhaltung. Dein Patenhuhn <strong>legt 6 Eier pro Woche</strong> – dein Anspruch landet übersichtlich in deinem digitalen Nest.</p>
            <div className="actions">
              <Link className="btn" href="/bestellen">Patenhuhn anfragen</Link>
              <Link className="btn ghost lightGhost" href="/stall">Digitalen Stall ansehen</Link>
            </div>
            <div className="trustRow"><span>✓ Freie Namenswahl</span><span>✓ Freiland & Mobilstall</span><span>✓ Persönliche Urkunde</span></div>
          </div>
          <div className="heroVisual">
            <div className="barnCard glassCard">
              <div className="barnTop"><span>Dein Patenhuhn</span><span className="statusDot">aktiv</span></div>
              <div className="hen">🐔</div>
              <h2>Lotta</h2>
              <p>BoBs Hühnerhof</p>
              <div className="nest"><span>🥚</span><span>🥚</span><span>🥚</span><span>🥚</span><span className="dim">🥚</span><span className="dim">🥚</span></div>
              <div className="progress"><i style={{width:'66%'}} /></div>
              <small>4 von 6 Eiern diese Woche</small>
            </div>
          </div>
        </div>
      </section>

      <section className="main section">
        <div className="sectionIntro"><div className="eyebrow">SO FUNKTIONIERT'S</div><h2>Vom Patenhuhn bis zum Frühstücksei.</h2></div>
        <div className="steps">
          <article><b>01</b><h3>Patenschaft anfragen</h3><p>Wähle Eiergröße, Anzahl deiner Patenhühner und auf Wunsch das Premium-Paket.</p></article>
          <article><b>02</b><h3>Digitales Nest füllen</h3><p>Jedes aktive Patenhuhn legt im Patenschaftsmodell 6 Eier pro Woche für dein digitales Nest.</p></article>
          <article><b>03</b><h3>Code einlösen</h3><p>Du erzeugst einen Abholcode und erhältst damit die reservierten Eier.</p></article>
        </div>
      </section>

      <section className="warmSection">
        <div className="main split">
          <div><div className="eyebrow">DEINE PATENSCHAFT</div><h2>Mehr als nur sechs Eier.</h2><p>Du bekommst eine persönliche Verbindung zu deiner Henne und unterstützt eine Haltung mit Freiland, mobilen Ställen, Hähnen und Schutz vor Fressfeinden.</p><a className="inlineLink" href="https://bob-eier.jimdoweb.com/" target="_blank" rel="noreferrer">Mehr über BoBs Eier →</a></div>
          <div className="benefitList">
            <div>✍️ <span><strong>Freie Wahl des Namens</strong><small>du gibst deiner Henne ihren Namen</small></span></div>
            <div>📜 <span><strong>Personalisierte Urkunde</strong><small>für dich oder als Geschenk</small></span></div>
            <div>🐔 <span><strong>Infos zu deiner Henne</strong><small>persönlich statt anonym</small></span></div>
            <div>🌿 <span><strong>Freiland & Mobilställe</strong><small>mit Hähnen und naturnaher Haltung</small></span></div>
            <div>🛡️ <span><strong>Pflege & Schutz</strong><small>Versorgung und Schutz vor Fressfeinden</small></span></div>
            <div>📅 <span><strong>Patenschaftszeit</strong><small>1 Jahr, danach monatlich</small></span></div>
          </div>
        </div>
      </section>
    </main>
  )
}
