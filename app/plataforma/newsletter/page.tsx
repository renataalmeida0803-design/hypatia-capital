'use client'

import { useState } from 'react'

const DESTINATARIOS_SIMULADOS = [
  { nome: 'Pedro', email: 'pedro@hypatiacapital.com.br', whatsapp: '', ativo: true },
  { nome: 'Mariana', email: 'mariana@hypatiacapital.com.br', whatsapp: '', ativo: true },
]

export default function NewsletterPage() {
  const [assunto, setAssunto] = useState('MarketSense Weekly — ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }))
  const [corpo, setCorpo] = useState('')
  const [canal, setCanal] = useState<'email' | 'whatsapp' | 'ambos'>('email')

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">✉️ Newsletter Semanal</h1>
        <p className="text-slate-500 text-sm mt-1">
          Envio por email e WhatsApp · Clientes cadastrados · Resumo executivo semanal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Editor */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Composição da Newsletter</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Assunto / Título</label>
                <input
                  value={assunto}
                  onChange={e => setAssunto(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Conteúdo</label>
                <textarea
                  value={corpo}
                  onChange={e => setCorpo(e.target.value)}
                  rows={10}
                  placeholder={'Resumo da semana:\n\n• SELIC: 14,75% — próxima reunião Copom em 07/05\n• IPCA acumulado 12m: 5,48%\n• Fatos relevantes: Raízen RJ confirmada, Camil pagou cupom D3...\n\nDestaques de crédito:\n...\n\nBom final de semana!'}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Canal de envio</label>
                <div className="flex gap-2">
                  {(['email', 'whatsapp', 'ambos'] as const).map(c => (
                    <button key={c}
                      onClick={() => setCanal(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition
                        ${canal === c ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {c === 'ambos' ? 'Email + WhatsApp' : c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold opacity-60 cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)' }}
                disabled>
                Enviar newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Lista de destinatários */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-3">
              Destinatários ({DESTINATARIOS_SIMULADOS.length})
            </h2>
            <div className="space-y-2">
              {DESTINATARIOS_SIMULADOS.map(d => (
                <div key={d.email} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {d.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700">{d.nome}</p>
                    <p className="text-[10px] text-slate-400 truncate">{d.email}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Ativo" />
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-xs text-teal-600 hover:underline py-1.5 border border-dashed border-teal-200 rounded-xl">
              + Adicionar destinatário
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Integrações</h2>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-amber-500">○</span>
                <span><strong>Resend / SendGrid</strong> — email transacional</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500">○</span>
                <span><strong>Z-API / Evolution API</strong> — WhatsApp Business</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500">○</span>
                <span><strong>Cron semanal</strong> — envio automático sextas 08h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl px-6 py-4 flex gap-3">
        <span className="text-xl">🔧</span>
        <div>
          <p className="font-bold text-teal-800 text-sm">Módulo em desenvolvimento</p>
          <p className="text-xs text-teal-700 mt-0.5">
            Integração com Resend (email) e Z-API (WhatsApp) em desenvolvimento. Cron de envio automático semanal e gestão de lista de destinatários baseada nos clientes cadastrados.
          </p>
        </div>
      </div>
    </div>
  )
}
