export type Client = {
  id: string
  email: string
  name: string
  created_at: string
}

export type Dashboard = {
  id: string
  client_id: string
  title: string
  month: number
  year: number
  html_content: string
  is_active: boolean
  created_at: string
  clients?: Client
}
