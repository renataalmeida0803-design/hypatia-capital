'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const siteUrl = window.location.origin

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl}/auth/callback` }
    })

    if (error) {
      setError('Email não autorizado ou erro ao enviar. Tente novamente.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'email'
    })

    if (error) {
      setError('Código inválido ou expirado. Solicite um novo.')
      setVerifying(false)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      router.push(user?.email === adminEmail ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
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

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          {!sent ? (
            <>
              <h2 className="text-lg font-semibold text-slate-700 mb-1">Acesso seguro</h2>
              <p className="text-slate-500 text-sm mb-6">
                Digite seu email. Enviaremos um link e um código de acesso.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Email</label>
                  <input
                    type="email" required value={email}
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
                <button type="submit" disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
                  {loading ? 'Enviando...' : 'Enviar código de acesso'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-700">Email enviado!</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Verifique <strong>{email}</strong> e use o link <strong>ou</strong> o código de 6 dígitos abaixo.
                </p>
              </div>

              <form onSubmit={handleOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                    Codigo de verificacao (6 digitos)
                  </label>
                  <input
                    type="text" required value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="123456"
                    maxLength={8}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-center
                               tracking-[0.5em] font-mono text-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder:text-slate-300 placeholder:tracking-normal placeholder:text-sm placeholder:font-sans"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={verifying || otp.length < 6}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
                  {verifying ? 'Verificando...' : 'Entrar'}
                </button>
              </form>

              <button onClick={() => { setSent(false); setEmail(''); setOtp(''); setError('') }}
                className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600">
                Usar outro email
              </button>
            </>
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
