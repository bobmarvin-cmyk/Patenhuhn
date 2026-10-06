import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Patenhuhn – dein Huhn, deine Eier',
  description: 'Hühnerpatenschaften mit echten Eiern, digitalem Hühnerstall und regionalen Höfen.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <div className="shell">
          <header className="header">
            <Link href="/" className="brand"><span className="brandMark">🐔</span><span>Patenhuhn</span></Link>
            <nav className="nav">
              <Link href="/bestellen">Patenhuhn finden</Link>
              <Link href="/anbieter">Für Höfe</Link>
              <Link href="/stall">Mein Stall</Link>
              <Link className="navLogin" href="/login">Anmelden</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div className="footerInner">
              <div><strong>Patenhuhn</strong><div className="muted">Echte Patenschaft. Echte Eier.</div></div>
              <div className="footerLinks">
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
