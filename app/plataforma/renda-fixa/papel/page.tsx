'use client'

import { useState } from 'react'

const TIPOS = ['Debenture', 'CRI', 'CRA', 'FIDC', 'Todos']

export default function RendaFixaPapelPage() {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('Todos')

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">📄 Análise por Papel — Renda Fixa</h1>
        <p className="text-slate-500 text-sm mt-1">
          Scraping ANBIMA · debentures.com · B3 · 30 perguntas de due diligence · Taxa mínima JRL
        </p>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Buscar papel</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="ISIN, código B3, nome da empresa ou vencimento (ex: RAIZ14, CAMI12, BR0000...)"
            className="flex-1 min-w-64 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex gap-1">
            {TIPOS.map(t => (
              <button key={t}
                onClick={() => setTipo(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                  ${tipo === t ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t}
              </button>
            ))}
          </div>
          <button
            className="px-5 py-3 rounded-xl text-white text-sm font-semibold opacity-60 cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}
            disabled>
            Buscar
          </button>
        </div>
      </div>

      {/* 30 perguntas — estrutura */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Framework de Due Diligence — 30 perguntas JRL</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { cat: 'Emissor', perguntas: ['Rating atual e histórico', 'Alavancagem bruta/líquida', 'Cobertura de juros (EBIT/DF)', 'Rolagem de dívida curto prazo', 'Divergência EBITDA vs FCO'] },
            { cat: 'Estrutura da Emissão', perguntas: ['Tipo: CRI / CRA / DEB / FIDC', 'Garantias e colateral', 'Covenants financeiros', 'Cláusula de vencimento antecipado', 'Subordinação / seniority'] },
            { cat: 'Precificação', perguntas: ['Taxa contratada vs taxa mínima JRL', 'Spread vs NTN-B par', 'PU indicativo ANBIMA vs par', 'Duration e duration modificada', 'Liquidez no mercado secundário'] },
            { cat: 'Risco Macro', perguntas: ['Sensibilidade à SELIC (+200bps)', 'Exposição cambial', 'Vencimento vs ciclo de juros', 'Concentração setorial', 'Correlação com IPCA/IGP-M'] },
          ].map(bloco => (
            <div key={bloco.cat} className="border border-slate-100 rounded-xl p-4">
              <p className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2">{bloco.cat}</p>
              <ul className="space-y-1">
                {bloco.perguntas.map(p => (
                  <li key={p} className="text-xs text-slate-600 flex gap-2">
                    <span className="text-slate-300">○</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">+ 10 perguntas específicas por tipo de instrumento (CRI/CRA/DEB). Total: 30 perguntas respondidas automaticamente via scraping.</p>
      </div>

      {/* Taxa mínima JRL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Taxa Mínima JRL — Método Damodaran + ANBIMA BDI</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { step: '1', label: 'Risk-Free', desc: 'NTN-B mesmo vencimento (ANBIMA)' },
            { step: '2', label: 'Default Spread', desc: 'Por rating — AAA +0,5% até C/D +12%' },
            { step: '3', label: 'CRP Brasil', desc: 'EMBI+ Brasil ÷ 100' },
            { step: '4', label: 'Prêmio Liquidez', desc: '+0,5% a +1,0% (papel quirografário)' },
            { step: '5', label: 'Taxa Mínima JRL', desc: 'CDI + ou IPCA + spread total' },
            { step: '6', label: 'Veredicto', desc: '🟢 ATRATIVO / ⚠ NEUTRO / 🔴 EVITAR' },
          ].map(s => (
            <div key={s.step} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                {s.step}
              </div>
              <p className="text-xs font-semibold text-slate-700">{s.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-2xl px-6 py-4 flex gap-3">
        <span className="text-xl">🔧</span>
        <div>
          <p className="font-bold text-violet-800 text-sm">Integração em desenvolvimento</p>
          <p className="text-xs text-violet-700 mt-0.5">
            Scraping ANBIMA BDI, debentures.com e B3 sendo programado. A engine das 30 perguntas e o cálculo Damodaran automático estarão disponíveis na próxima versão.
          </p>
        </div>
      </div>
    </div>
  )
}
