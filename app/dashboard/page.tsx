import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardViewer from '@/components/DashboardViewer'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Busca o dashboard mais recente do cliente
  const { data: dashboards } = await supabase
    .from('dashboards')
    .select('*')
    .eq('client_email', user.email)
    .eq('is_active', true)
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  const latest = dashboards?.[0] ?? null
  const history = dashboards ?? []

  return <DashboardViewer user={user} latest={latest} history={history} />
}
