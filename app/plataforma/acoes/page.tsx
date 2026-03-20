'use client'

import { useState } from 'react'

export default function AcoesPage() {
  const [ticker, setTicker] = useState('')

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">📈 Ações — Equity B3</h1>
        <p className="text-slate-500 text-sm mt-1">
          P/VP · WACC · ROA · LPA · Calendário de dividendos · Projeção 36 meses · Análise setorial
        </p>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Buscar ação</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            placeholder="Ticker B3 (ex: PETR4, ITUB4, VALE3...)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            maxLength={6}
          />
          <button
            className="px-5 py-3 rounded-xl text-white text-sm font-semibold opacity-60 cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}
            disabled>
            Analisar
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: '💰', label: 'P/VP', desc: 'Preço / Valor Patrimonial por ação' },
          { icon: '📐', label: 'WACC', desc: 'Custo médio ponderado de capital' },
          { icon: '📊', label: 'ROA', desc: 'Retorno sobre ativos totais' },
          { icon: '💵', label: 'LPA', desc: 'Lucro por ação — últimos 12 meses' },
          { icon: '📅', label: 'Dividendos', desc: 'Calendário ex-dividendo e pagamento' },
          { icon: '📉', label: 'Min/Max 36m', desc: 'Projeção histórica e estimada de preço' },
          { icon: '🏭', label: 'Setor B3', desc: 'GICS setor e subsetor na B3' },
          { icon: '📆', label: 'Data IPO', desc: 'Data de listagem na B3' },
          { icon: '🔄', label: 'Sazonalidade', desc: 'Padrão pré/pós-cupom e ciclos setoriais' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3 items-start">
            <span className="text-xl">{m.icon}</span>
            <div>
              <p className="font-bold text-slate-800 text-sm">{m.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nota metodológica */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3">Metodologia de Análise — Equity Brasil</h2>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>📌 O mercado de ações no Brasil é fortemente influenciado por <strong>movimentos de subida que antecedem pagamentos de proventos</strong> e queda após a data ex-dividendo — comportamento diferente de mercados maduros.</p>
          <p>📌 <strong>Projeção de balanço:</strong> o mercado frequentemente precifica dados isolados (ex: EBITDA pontual) sem considerar o contexto do fluxo de caixa livre real — aqui fazemos o cruzamento completo.</p>
          <p>📌 <strong>Calendário de proventos:</strong> datas ex, pagamento, yield projetado vs. histórico 12/24/36 meses.</p>
          <p>📌 <strong>Min/Max 36 meses:</strong> range histórico + projeção com modelos de regressão baseada em resultados trimestrais.</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex gap-3">
        <span className="text-xl">🔧</span>
        <div>
          <p className="font-bold text-emerald-800 text-sm">Módulo em desenvolvimento</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Integração com B3 (dados públicos), scraping de calendário de proventos e cálculo automático de indicadores em desenvolvimento.
          </p>
        </div>
      </div>
    </div>
  )
}
