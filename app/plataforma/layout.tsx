import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PlatformShell from '@/components/PlatformShell'

export default async function PlataformaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect('/')
  }

  return <PlatformShell user={user}>{children}</PlatformShell>
}
