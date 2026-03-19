'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type DashboardRow = {
  id: string
  title: string
  month: number
  year: number
  html_content: string
  client_email: string
}

const MONTHS = ['','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default function DashboardViewer({
  user, latest, history
}: {
  user: User
  latest: DashboardRow | null
  history: DashboardRow[]
}) {
  const [selected, setSelected] = useState<DashboardRow | null>(latest)
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Topbar */}
      <header className="text-white px-6 py-3 flex items-center justify-between shadow-lg"
              style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-bold text-base">Hypatia Capital</span>
          <span className="opacity-60 text-sm hidden sm:inline">· MarketSense Advisors</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs opacity-75 hidden sm:inline">{user.email}</span>
          <button onClick={logout}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition">
            Sair
          </button>
        </div>
      </header>

      {/* Histórico de relatórios (se houver mais de 1) */}
      {history.length > 1 && (
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 self-center mr-1 whitespace-nowrap">Relatórios:</span>
          {history.map(d => (
            <button key={d.id}
              onClick={() => setSelected(d)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition font-medium
                ${selected?.id === d.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {MONTHS[d.month]}/{d.year}
            </button>
          ))}
        </div>
      )}

      {/* Dashboard HTML */}
      <main className="flex-1">
        {selected ? (
          <iframe
            srcDoc={selected.html_content}
            className="w-full border-0"
            style={{ height: 'calc(100vh - 56px)', minHeight: 800 }}
            title={selected.title}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">Nenhum relatório disponível ainda.</p>
            <p className="text-xs mt-1">Seu advisor publicará em breve.</p>
          </div>
        )}
      </main>
    </div>
  )
}
