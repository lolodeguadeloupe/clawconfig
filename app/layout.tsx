import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClawConfig — Configurez votre IA OpenClaw par métier',
  description: 'Générez votre configuration OpenClaw personnalisée en 2 minutes. Développeur, Agent immobilier, E-commerce, Commercial — prête à l\'emploi.',
  openGraph: {
    title: 'ClawConfig — Configuration OpenClaw par métier',
    description: 'Votre IA OpenClaw configurée et prête en 2 minutes.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
