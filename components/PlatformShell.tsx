'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type NavItem = { href: string; label: string; icon: string; exact?: boolean }
type NavGroup = { group: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    group: 'Visão Geral',
    items: [
      { href: '/plataforma', label: 'Hub Principal', icon: '⚡', exact: true },
    ]
  },
  {
    group: 'Carteiras',
    items: [
      { href: '/plataforma/radar', label: 'IA Advisors — Radar', icon: '🧭' },
      { href: '/admin', label: 'Gerenciar Clientes', icon: '👥' },
    ]
  },
  {
    group: 'Renda Fixa',
    items: [
      { href: '/plataforma/renda-fixa/empresa', label: 'Análise de Empresa', icon: '🏢' },
      { href: '/plataforma/renda-fixa/papel', label: 'Análise por Papel', icon: '📄' },
    ]
  },
  {
    group: 'Ações',
    items: [
      { href: '/plataforma/acoes', label: 'Equity — Ações B3', icon: '📈' },
    ]
  },
  {
    group: 'Ferramentas',
    items: [
      { href: '/plataforma/relatorios', label: 'Relatórios em Lote', icon: '📋' },
      { href: '/plataforma/fatos', label: 'Fatos Relevantes CVM', icon: '📰' },
      { href: '/plataforma/newsletter', label: 'Newsletter', icon: '✉️' },
    ]
  },
]

export default function PlatformShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const logout = async () => {
    await createClient().auth.signOut()
    router.push('/')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* Topbar */}
      <header className="text-white h-14 flex items-center justify-between px-4 z-30 shadow-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#0f2544,#1e3a5f)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                 style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)' }}>H</div>
            <span className="font-bold text-sm">Hypatia Capital</span>
            <span className="opacity-40 text-xs hidden sm:inline">·</span>
            <span className="opacity-60 text-xs hidden sm:inline">MarketSense Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-60 hidden md:inline">{user.email}</span>
          <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-semibold">Admin</span>
          <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">Sair</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className={`flex-shrink-0 transition-all duration-200 overflow-y-auto
          ${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'}
          bg-white border-r border-slate-200 shadow-sm`}>
          <nav className="py-4 px-3 space-y-5">
            {NAV.map(group => (
              <div key={group.group}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">
                  {group.group}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(item => (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition
                        ${isActive(item.href, item.exact)
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}>
                      <span className="text-base leading-none">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer sidebar */}
          <div className="border-t border-slate-100 p-3 mt-4">
            <p className="text-[10px] text-slate-400 text-center">
              MarketSense Platform v1.0<br />© 2026 JRL Advisors
            </p>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
