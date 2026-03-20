'use client'

import { useState } from 'react'

export default function RendaFixaEmpresaPage() {
  const [cnpj, setCnpj] = useState('')
  const [empresa, setEmpresa] = useState('')

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">🏢 Análise de Empresa — Renda Fixa</h1>
        <p className="text-slate-500 text-sm mt-1">
          Análise forense buy-side · Scraping CVM/BACEN · Método JRL — Divergência EBITDA vs FCO
        </p>
      </div>

      {/* Campo de busca */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Buscar empresa para análise</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={empresa}
            onChange={e => setEmpresa(e.target.value)}
            placeholder="Nome da empresa (ex: Raízen, Camil, Iguatemi...)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            value={cnpj}
            onChange={e => setCnpj(e.target.value)}
            placeholder="CNPJ (opcional)"
            className="w-44 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            className="px-5 py-3 rounded-xl text-white text-sm font-semibold transition opacity-60 cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}
            disabled>
            Analisar
          </button>
        </div>
      </div>

      {/* Módulos da análise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: '📊', title: 'Demonstrativos CVM', desc: 'ITR/DFP, Notas Explicativas, Atas de Assembleia via rad.cvm.gov.br e dados.cvm.gov.br' },
          { icon: '🔍', title: 'Divergência EBITDA vs FCO', desc: 'Detecção automática de discrepâncias entre EBITDA ajustado e Fluxo de Caixa Operacional real' },
          { icon: '⚠️', title: 'Matriz de Rebaixamento', desc: '5 gatilhos: troca de auditoria, renúncia de conselheiros, rolagem excessiva de dívida, RJ, CVM flags' },
          { icon: '📰', title: 'Card Jornalístico JRL', desc: 'Contexto macro, geopolítico, stress de taxa SELIC, taxa mínima Damodaran + ANBIMA BDI' },
          { icon: '💧', title: 'Análise de Liquidez', desc: 'Runway em 3 cenários SELIC: +0bps, +200bps, +400bps. Ponto de insolvência técnica calculado' },
          { icon: '📁', title: 'Arquivo JRL', desc: 'Toda análise salva em nuvem como base de treinamento e referência histórica por emissor' },
        ].map(m => (
          <div key={m.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4">
            <span className="text-2xl flex-shrink-0">{m.icon}</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{m.title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status de desenvolvimento */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl px-6 py-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔧</span>
          <div>
            <p className="font-bold text-indigo-800 text-sm">Módulo em desenvolvimento</p>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              A integração com <strong>CVM (rad.cvm.gov.br + dados.cvm.gov.br)</strong> e <strong>BACEN</strong> está sendo programada.
              O pipeline de análise segue o método JRL: extração de ITR/DFP → validação Python → diagnóstico forense → arquivo na nuvem.
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {['Scraping CVM', 'Parser ITR/DFP', 'Motor de divergência FCO', 'Matriz Damodaran', 'Card Jornalístico'].map(t => (
                <span key={t} className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
