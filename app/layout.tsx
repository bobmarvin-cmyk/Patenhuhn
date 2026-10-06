import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Patenhuhn – dein Huhn, deine Eier',
  description: 'Hühnerpatenschaften mit echten Eiern, digitalem Hühnerstall und regionalen Höfen.'
}

const bobsUrl = 'https://bob-eier.jimdoweb.com/'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <div className="shell">
          <header className="header">
            <Link href="/" className="brand"><span className="brandMark">🐔</span><span>Patenhuhn</span></Link>
            <nav className="nav">
              <Link href="/bestellen">Patenhuhn bestellen</Link>
              <Link href="/anbieter">Für Höfe</Link>
              <Link href="/stall">Mein Stall</Link>
              <Link className="navLogin" href="/login">Anmelden</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div className="footerInner">
              <div className="footerBrandBlock">
                <div><strong>Patenhuhn</strong><div className="muted">Echte Patenschaft. Echte Eier.</div></div>
                <a className="bobsBadge" href={bobsUrl} target="_blank" rel="noreferrer" aria-label="BoBs Eier öffnen">
                  <img className="bobsLogoImage" src="https://image.jimcdn.com/app/cms/image/transf/dimension%3D734x10000%3Aformat%3Djpg/path/se5b8378e38e04df8/image/id23a424faf4dee80/version/1555863151/image.jpg" alt="BoBs Eier"/><span><b>BoBs Eier</b><small>Unser Hofprojekt</small></span>
                </a>
              </div>
              <div className="footerLinks">
                <a href={bobsUrl} target="_blank" rel="noreferrer">BoBs Eier</a>
                <Link href="/kontakt">Kontakt</Link>
                <Link href="/impressum">Impressum</Link>
                <Link href="/datenschutz">Datenschutz</Link>
                <Link href="/admin">Administration</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
