import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hypatia Capital — MarketSense Advisors',
  description: 'Portal de visualização de carteiras — acesso exclusivo para clientes'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800">
        {children}
      </body>
    </html>
  )
}
