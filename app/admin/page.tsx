import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPanel from '@/components/AdminPanel'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect('/')
  }

  // Busca todos os dashboards com email do cliente
  const { data: dashboards } = await supabase
    .from('dashboards')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminPanel user={user} dashboards={dashboards ?? []} />
}
