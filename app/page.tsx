'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl}/auth/callback` }
    })

    if (error) {
      setError('Email não encontrado ou não autorizado.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
               style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Hypatia Capital</h1>
          <p className="text-slate-500 text-sm mt-1">Portal do Investidor · MarketSense Advisors</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          {!sent ? (
            <>
              <h2 className="text-lg font-semibold text-slate-700 mb-1">Acesso seguro</h2>
              <p className="text-slate-500 text-sm mb-6">
                Digite seu email cadastrado. Enviaremos um link de acesso instantâneo — sem senha.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder:text-slate-300"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm
                             transition-opacity disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}
                >
                  {loading ? 'Enviando...' : 'Enviar link de acesso'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-700 mb-2">Link enviado!</h2>
              <p className="text-slate-500 text-sm">
                Verifique sua caixa de entrada em <strong>{email}</strong>.
                Clique no link para acessar seu dashboard.
              </p>
              <p className="text-slate-400 text-xs mt-4">
                O link expira em 1 hora. Verifique também o spam.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-6 text-xs text-blue-600 hover:underline"
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Acesso exclusivo para clientes cadastrados.
          <br />© {new Date().getFullYear()} MarketSense Advisors · Hypatia Capital
        </p>
      </div>
    </div>
  )
}
