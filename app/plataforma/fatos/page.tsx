export const dynamic = 'force-dynamic'

// Dados simulados até o scraper CVM ser implementado
const FATOS_SIMULADOS = [
  {
    id: '1',
    data: '2026-03-18',
    hora: '17:42',
    empresa: 'Raízen S.A.',
    tipo: 'Recuperação Judicial',
    impacto: 'CRÍTICO',
    resumo: 'Raízen protocolou pedido de recuperação judicial junto à 1ª Vara Empresarial de São Paulo. Dívida total declarada de R$ 22,4 bi.',
    categoria: 'RJ',
  },
  {
    id: '2',
    data: '2026-03-18',
    hora: '14:15',
    empresa: 'Camil Alimentos S.A.',
    tipo: 'Pagamento de Cupom',
    impacto: 'INFO',
    resumo: 'Camil informa pagamento de juros da 3ª emissão de debentures — vencimento 15/03/2026. Valor: R$ 12,3 mi. CVM Processo 2026/0123.',
    categoria: 'CUPOM',
  },
  {
    id: '3',
    data: '2026-03-17',
    hora: '10:30',
    empresa: 'Iguatemi S.A.',
    tipo: 'Troca de Auditoria',
    impacto: 'ATENÇÃO',
    resumo: 'Iguatemi comunica substituição de auditoria independente: saída da Deloitte, entrada da Grant Thornton. Vigência a partir de 01/04/2026.',
    categoria: 'AUDITORIA',
  },
  {
    id: '4',
    data: '2026-03-17',
    hora: '09:00',
    empresa: 'Petrobras S.A.',
    tipo: 'Data Ex-Dividendo',
    impacto: 'INFO',
    resumo: 'Data ex-dividendo referente aos proventos de R$ 0,98/ação PETR4 — período base 4T25. Data de pagamento: 28/03/2026.',
    categoria: 'PROVENTO',
  },
  {
    id: '5',
    data: '2026-03-16',
    hora: '18:55',
    empresa: 'Grupo Zaffari',
    tipo: 'Renúncia de Conselheiro',
    impacto: 'ATENÇÃO',
    resumo: 'Renúncia do conselheiro independente Paulo R. Fonseca ao Conselho de Administração. Empresa não divulgou motivação.',
    categoria: 'GOVERNANÇA',
  },
]

const IMPACTO_COLORS: Record<string, string> = {
  'CRÍTICO': 'bg-red-100 text-red-700 border-red-200',
  'ATENÇÃO': 'bg-amber-100 text-amber-700 border-amber-200',
  'INFO': 'bg-slate-100 text-slate-600 border-slate-200',
}

const CAT_COLORS: Record<string, string> = {
  'RJ': 'bg-red-600',
  'CUPOM': 'bg-green-600',
  'AUDITORIA': 'bg-amber-600',
  'PROVENTO': 'bg-blue-600',
  'GOVERNANÇA': 'bg-violet-600',
}

export default function FatosPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📰 Fatos Relevantes CVM</h1>
          <p className="text-slate-500 text-sm mt-1">
            Atualizado 3x/dia · Scraping CVM · Classificados por impacto
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <span className="text-amber-500 text-xs">⚠</span>
          <span className="text-xs text-amber-700 font-semibold">Dados simulados — scraper em desenvolvimento</span>
        </div>
      </div>

      {/* Resumo por categoria */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { cat: 'RJ', label: 'Recuperação Judicial', count: 1 },
          { cat: 'CUPOM', label: 'Cupons / Pagamentos', count: 1 },
          { cat: 'AUDITORIA', label: 'Troca de Auditoria', count: 1 },
          { cat: 'PROVENTO', label: 'Proventos', count: 1 },
          { cat: 'GOVERNANÇA', label: 'Governança', count: 1 },
        ].map(c => (
          <div key={c.cat} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
            <div className={`w-6 h-6 rounded-full ${CAT_COLORS[c.cat]} text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1.5`}>
              {c.count}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Feed de fatos */}
      <div className="space-y-3">
        {FATOS_SIMULADOS.map(f => (
          <div key={f.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex">
              <div className={`w-1.5 flex-shrink-0 ${CAT_COLORS[f.categoria]}`} />
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">{f.empresa}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${IMPACTO_COLORS[f.impacto]}`}>
                      {f.impacto}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-700">{f.data.split('-').reverse().join('/')}</p>
                    <p className="text-[10px] text-slate-400">{f.hora}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-1">{f.tipo}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{f.resumo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status scraper */}
      <div className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4 flex gap-3">
        <span className="text-xl">🔧</span>
        <div>
          <p className="font-bold text-rose-800 text-sm">Scraper CVM em desenvolvimento</p>
          <p className="text-xs text-rose-700 mt-0.5">
            O scraping automático do portal CVM (3x/dia: 09h, 13h, 18h) está sendo programado.
            Classificação automática por impacto e alertas push para papéis em carteira estarão disponíveis em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
