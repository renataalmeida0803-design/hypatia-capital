import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const MODULES = [
  {
    href: '/plataforma/radar',
    icon: '🧭',
    title: 'IA Advisors — Radar Patrimonial',
    desc: 'Consolide e visualize o histórico completo de carteiras por cliente. Upload de relatórios mensais e arquivo por período.',
    color: 'from-blue-600 to-blue-700',
    badge: 'Ativo',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    href: '/plataforma/renda-fixa/empresa',
    icon: '🏢',
    title: 'Renda Fixa — Análise de Empresa',
    desc: 'Análise forense buy-side com scraping CVM/BACEN. Identifica divergências EBITDA vs FCO, alertas preditivos e matriz de rebaixamento.',
    color: 'from-indigo-600 to-indigo-700',
    badge: 'Em construção',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/plataforma/renda-fixa/papel',
    icon: '📄',
    title: 'Renda Fixa — Análise por Papel',
    desc: 'Digite o código ISIN ou nome da empresa. Scraping ANBIMA, debentures.com e B3. 30 perguntas de due diligence + taxa mínima JRL (Damodaran).',
    color: 'from-violet-600 to-violet-700',
    badge: 'Em construção',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/plataforma/acoes',
    icon: '📈',
    title: 'Ações — Equity B3',
    desc: 'P/VP, WACC, ROA, LPA. Calendário de dividendos e ex-dividendo. Projeção min/max 36 meses. Análise setorial e fatores sazonais.',
    color: 'from-emerald-600 to-emerald-700',
    badge: 'Em construção',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/plataforma/relatorios',
    icon: '📋',
    title: 'Relatórios em Lote',
    desc: 'Analise múltiplos papéis ou empresas de uma vez. Busca por código, nome, vencimento, tipo (CRI/CRA/DEB). Compare com risco soberano por perfil.',
    color: 'from-sky-600 to-sky-700',
    badge: 'Em construção',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/plataforma/fatos',
    icon: '📰',
    title: 'Fatos Relevantes CVM',
    desc: 'Scraping automático 3x/dia. Pagamentos de cupons, RJ, troca de auditoria, renúncia de conselheiros, fatos materiais classificados por impacto.',
    color: 'from-rose-600 to-rose-700',
    badge: 'Em construção',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/plataforma/newsletter',
    icon: '✉️',
    title: 'Newsletter Semanal',
    desc: 'Envio automático por email e WhatsApp. Resumo executivo de mercado, alertas relevantes, fatos da semana — para todos os clientes cadastrados.',
    color: 'from-teal-600 to-teal-700',
    badge: 'Em construção',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
]

export default async function PlataformaPage() {
  const supabase = await createClient()
  const { data: dashboards } = await supabase
    .from('dashboards')
    .select('id, client_email, month, year')

  const totalClientes = new Set(dashboards?.map(d => d.client_email) ?? []).size
  const totalDashboards = dashboards?.length ?? 0

  return (
    <div className="p-8 max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">MarketSense Platform</h1>
        <p className="text-slate-500 text-sm mt-1">
          Plataforma integrada de análise patrimonial, crédito privado e equity — JRL Advisors
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Clientes ativos', value: totalClientes, icon: '👥' },
          { label: 'Carteiras arquivadas', value: totalDashboards, icon: '📁' },
          { label: 'Módulos disponíveis', value: '7', icon: '⚡' },
          { label: 'Plataforma', value: 'v1.0', icon: '🚀' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grade de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map(m => (
          <Link key={m.href} href={m.href}
            className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
            <div className={`h-2 bg-gradient-to-r ${m.color}`} />
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{m.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-blue-700 transition">
                {m.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">{m.desc}</p>
              <div className="mt-4 text-xs text-blue-600 font-semibold group-hover:underline">
                Acessar módulo →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Aviso módulos em construção */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex gap-3">
        <span className="text-amber-500 text-xl flex-shrink-0">🔧</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Módulos em desenvolvimento ativo</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Renda Fixa, Ações, Relatórios, Fatos Relevantes e Newsletter estão sendo programados agora.
            O módulo <strong>IA Advisors — Radar Patrimonial</strong> está 100% operacional.
          </p>
        </div>
      </div>
    </div>
  )
}
