'use client'

import { useState } from 'react'

const TIPOS = ['Debenture', 'CRI', 'CRA', 'FIDC', 'Ação']
const PERFIS = ['Conservador', 'Moderado', 'Arrojado']

export default function RelatoriosPage() {
  const [papeis, setPapeis] = useState('')
  const [tipo, setTipo] = useState('')
  const [perfil, setPerfil] = useState('Conservador')

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">📋 Relatórios em Lote</h1>
        <p className="text-slate-500 text-sm mt-1">
          Analise múltiplos papéis de uma vez · Compare com risco soberano · Taxa mínima por perfil de investidor
        </p>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Configurar análise em lote</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">
              Papéis / Empresas (um por linha ou separados por vírgula)
            </label>
            <textarea
              value={papeis}
              onChange={e => setPapeis(e.target.value)}
              placeholder={'RAIZ14\nCAMI12\nIGTA11\nBR0000123456-7 (ISIN)\nNome da Empresa S.A.'}
              rows={5}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Tipo de instrumento</label>
              <div className="flex gap-1.5 flex-wrap">
                {['Todos', ...TIPOS].map(t => (
                  <button key={t}
                    onClick={() => setTipo(t === 'Todos' ? '' : t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                      ${(!tipo && t === 'Todos') || tipo === t
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Perfil do investidor</label>
              <div className="flex gap-1.5">
                {PERFIS.map(p => (
                  <button key={p}
                    onClick={() => setPerfil(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                      ${perfil === p ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold opacity-60 cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}
            disabled>
            Gerar relatório em lote
          </button>
        </div>
      </div>

      {/* O que o relatório incluirá */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">O relatório incluirá para cada papel</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Identificação automática por ISIN, código ou nome',
            'Tipo: CRI / CRA / Debenture / FIDC',
            'Emissor, garantidor, estrutura',
            'Rating atual + histórico de movimentos',
            'Taxa contratada vs taxa mínima JRL',
            'Spread vs NTN-B mesmo vencimento',
            'Veredicto: ATRATIVO / NEUTRO / EVITAR',
            'Comparativo com CDI e IPCA + X%',
            'Duration e vencimento',
            'Status: inadimplência, RJ, eventos relevantes',
          ].map(item => (
            <div key={item} className="flex gap-2 text-xs text-slate-600">
              <span className="text-blue-400 flex-shrink-0">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-2xl px-6 py-4 flex gap-3">
        <span className="text-xl">🔧</span>
        <div>
          <p className="font-bold text-sky-800 text-sm">Módulo em desenvolvimento</p>
          <p className="text-xs text-sky-700 mt-0.5">
            O motor de análise em lote e o comparativo automático com risco soberano por perfil estarão disponíveis na próxima versão.
          </p>
        </div>
      </div>
    </div>
  )
}
