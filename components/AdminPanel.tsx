'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

const MONTHS = ['','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

type DashboardRow = {
  id: string
  client_email: string
  title: string
  month: number
  year: number
  is_active: boolean
  created_at: string
}

export default function AdminPanel({ user, dashboards }: { user: User; dashboards: DashboardRow[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [clientEmail, setClientEmail] = useState('')
  const [clientName, setClientName] = useState('')
  const [title, setTitle] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [sendEmail, setSendEmail] = useState(true)

  const logout = async () => {
    await createClient().auth.signOut()
    router.push('/')
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setMsg(null)

    try {
      const html = await file.text()
      const supabase = createClient()

      // Insere o dashboard
      const { error } = await supabase.from('dashboards').insert({
        client_email: clientEmail.trim().toLowerCase(),
        client_name: clientName.trim(),
        title: title.trim() || `Relatório ${MONTHS[month]}/${year}`,
        month,
        year,
        html_content: html,
        is_active: true
      })

      if (error) throw error

      // Envia email de notificação ao cliente (via edge function do Supabase ou apenas link)
      if (sendEmail) {
        await supabase.auth.signInWithOtp({
          email: clientEmail.trim().toLowerCase(),
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
            data: { notification: true }
          }
        })
      }

      setMsg({ type: 'ok', text: `Dashboard publicado${sendEmail ? ' e email enviado' : ''} para ${clientEmail}.` })
      setClientEmail('')
      setClientName('')
      setTitle('')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setMsg({ type: 'err', text: message })
    }
    setLoading(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('dashboards').update({ is_active: !current }).eq('id', id)
    router.refresh()
  }

  const deleteDashboard = async (id: string) => {
    if (!confirm('Remover este dashboard?')) return
    const supabase = createClient()
    await supabase.from('dashboards').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-white px-6 py-3 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-bold">Hypatia Capital · Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-70">{user.email}</span>
          <button onClick={logout} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg">Sair</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">+</span>
            Publicar novo dashboard para um cliente
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Email do cliente *</label>
                <input required type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  placeholder="pedro@email.com"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Nome do cliente</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="Pedro Silva"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Mês</label>
                <select value={month} onChange={e => setMonth(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {MONTHS.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Ano</label>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))}
                  min={2024} max={2030}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Título (opcional)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Relatório Fev/2026"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Arquivo HTML do dashboard *</label>
              <input ref={fileRef} required type="file" accept=".html"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600
                           file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0
                           file:bg-blue-50 file:text-blue-700 file:font-semibold file:text-xs" />
              <p className="text-xs text-slate-400 mt-1">Selecione o arquivo .html gerado pelo JRL MarketSense.</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="sendEmail" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
                className="rounded" />
              <label htmlFor="sendEmail" className="text-sm text-slate-600">
                Notificar cliente por email (envia magic link automaticamente)
              </label>
            </div>

            {msg && (
              <div className={`px-4 py-3 rounded-xl text-sm ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {msg.text}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition"
              style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
              {loading ? 'Publicando...' : '📤 Publicar dashboard'}
            </button>
          </form>
        </div>

        {/* Lista de dashboards publicados */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-700 mb-4">
            Dashboards publicados ({dashboards.length})
          </h2>

          {dashboards.length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhum dashboard publicado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Título</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Período</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboards.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-medium">{d.client_email}</td>
                      <td className="py-2.5 px-3 text-slate-600">{d.title}</td>
                      <td className="py-2.5 px-3 text-slate-500">{MONTHS[d.month]}/{d.year}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {d.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 flex gap-2">
                        <button onClick={() => toggleActive(d.id, d.is_active)}
                          className="text-xs text-blue-600 hover:underline">
                          {d.is_active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onClick={() => deleteDashboard(d.id)}
                          className="text-xs text-red-500 hover:underline">
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
