import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patenhuhn',
  description: 'Dein digitales Patenhuhn mit echten Eiern vom Hof.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <div className="shell">
          <header className="header">
            <Link className="brand" href="/">🐔 Patenhuhn</Link>
            <nav className="nav">
              <Link href="/login">Login</Link>
              <Link className="btn" href="/stall">Mein Hühnerstall</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">Patenhuhn · Version 0.2</footer>
        </div>
      </body>
    </html>
  )
}
