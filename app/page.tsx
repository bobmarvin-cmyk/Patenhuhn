import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <section className="heroBand">
        <div className="hero main">
          <div>
            <div className="eyebrow">REGIONAL · FAIR · DIGITAL</div>
            <h1>Lieber gleich<br/><em>das eigene Huhn.</em></h1>
            <p className="lead">Übernimm eine Patenschaft für ein Huhn aus artgerechter Freilandhaltung. Dein Patenhuhn <strong>legt 6 echte Eier pro Woche</strong> – und dein Anspruch darauf landet übersichtlich in deinem digitalen Hühnerstall.</p>
            <div className="actions">
              <Link className="btn" href="/bestellen">Patenhuhn bestellen</Link>
              <Link className="btn ghost" href="/stall">Digitalen Stall ansehen</Link>
            </div>
            <div className="trustRow"><span>✓ Freilandhaltung</span><span>✓ Mobile Ställe</span><span>✓ Persönliches Patenhuhn</span></div>
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
        <div className="sectionIntro"><div className="eyebrow">SO FUNKTIONIERT'S</div><h2>Vom Patenhuhn bis zum Frühstücksei.</h2></div>
        <div className="steps">
          <article><b>01</b><h3>Patenschaft anfragen</h3><p>Wähle Eiergröße, Anzahl deiner Patenhühner und auf Wunsch das Premium-Paket.</p></article>
          <article><b>02</b><h3>Eier sammeln</h3><p>Jedes aktive Patenhuhn legt im Patenschaftsmodell 6 Eier pro Woche für dein Eierguthaben.</p></article>
          <article><b>03</b><h3>Code einlösen</h3><p>Du erzeugst einen Abholcode und erhältst damit die reservierten echten Eier.</p></article>
        </div>
      </section>

      <section className="warmSection">
        <div className="main split">
          <div><div className="eyebrow">MEHR ALS EIER</div><h2>Eine Verbindung zwischen Huhn und Mensch.</h2><p>Zu deiner Patenschaft gehören dein persönliches Patenhuhn, eine Patenschaftsurkunde und transparente Haltung. Die Tiere leben im Freiland mit mobilen Ställen und Hähnen.</p><a className="inlineLink" href="https://bob-eier.jimdoweb.com/" target="_blank" rel="noreferrer">Mehr über BoBs Eier →</a></div>
          <div className="benefitList"><div>🥚 <span><strong>6 Eier je Woche</strong><small>ansparbar im digitalen Stall</small></span></div><div>🌿 <span><strong>Freiland & Mobilstall</strong><small>mit Hähnen und naturnaher Haltung</small></span></div><div>📜 <span><strong>Patenschaftsurkunde</strong><small>für dich oder als Geschenk</small></span></div><div>⭐ <span><strong>Premium möglich</strong><small>Versand, Hühnerfoto, Kikeriki & mehr</small></span></div></div>
        </div>
      </section>
    </main>
  )
}
