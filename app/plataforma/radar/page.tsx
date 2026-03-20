import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const MONTHS = ['','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default async function RadarPage() {
  const supabase = await createClient()
  const { data: dashboards } = await supabase
    .from('dashboards')
    .select('id, client_email, client_name, title, month, year, is_active, created_at')
    .order('created_at', { ascending: false })

  // Agrupa por cliente
  const byClient: Record<string, typeof dashboards> = {}
  for (const d of dashboards ?? []) {
    if (!byClient[d.client_email]) byClient[d.client_email] = []
    byClient[d.client_email]!.push(d)
  }

  const totalAtivos = (dashboards ?? []).filter(d => d.is_active).length

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🧭 IA Advisors — Radar Patrimonial</h1>
          <p className="text-slate-500 text-sm mt-1">
            Arquivo completo de carteiras por cliente · {Object.keys(byClient).length} clientes · {totalAtivos} relatórios ativos
          </p>
        </div>
        <Link href="/admin"
          className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition"
          style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
          + Publicar carteira
        </Link>
      </div>

      {Object.keys(byClient).length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-medium">Nenhuma carteira publicada ainda.</p>
          <Link href="/admin" className="mt-3 text-blue-600 text-sm hover:underline inline-block">
            Ir para o painel admin →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byClient).map(([email, items]) => {
            const nome = items![0]?.client_name || email
            const ativos = items!.filter(d => d.is_active).length
            return (
              <div key={email} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header cliente */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
                     style={{ background: 'linear-gradient(90deg,#f0f5ff,#ffffff)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                         style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
                      {nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{nome}</p>
                      <p className="text-xs text-slate-400">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{items!.length} relatório{items!.length > 1 ? 's' : ''}</span>
                    <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                      {ativos} ativo{ativos !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Timeline de meses */}
                <div className="px-6 py-4">
                  <div className="flex gap-3 flex-wrap">
                    {items!.map(d => (
                      <Link
                        key={d.id}
                        href={`/admin?view=${d.id}`}
                        className={`flex flex-col items-center px-4 py-3 rounded-xl border text-center transition hover:shadow-md
                          ${d.is_active
                            ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                        <span className={`text-xs font-bold uppercase ${d.is_active ? 'text-blue-600' : 'text-slate-400'}`}>
                          {MONTHS[d.month]}
                        </span>
                        <span className={`text-lg font-bold leading-tight ${d.is_active ? 'text-slate-800' : 'text-slate-400'}`}>
                          {d.year}
                        </span>
                        <span className={`text-[10px] mt-0.5 font-semibold ${d.is_active ? 'text-blue-500' : 'text-slate-300'}`}>
                          {d.is_active ? '● Ativo' : '○ Inativo'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
