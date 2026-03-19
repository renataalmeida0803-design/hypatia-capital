-- Hypatia Capital — Schema do banco de dados
-- Execute este script no SQL Editor do Supabase (https://app.supabase.com → SQL Editor)

-- Tabela principal de dashboards
create table if not exists dashboards (
  id            uuid        default gen_random_uuid() primary key,
  client_email  text        not null,
  client_name   text,
  title         text        not null,
  month         int         not null check (month between 1 and 12),
  year          int         not null check (year between 2024 and 2099),
  html_content  text        not null,
  is_active     boolean     default true,
  created_at    timestamptz default now()
);

-- Índice para busca rápida por email do cliente
create index if not exists idx_dashboards_client_email on dashboards(client_email);

-- Row Level Security (RLS): cada cliente vê apenas os próprios dashboards
alter table dashboards enable row level security;

-- Política: cliente autenticado vê apenas seus dashboards ativos
create policy "Clientes veem seus próprios dashboards"
  on dashboards for select
  using (
    client_email = auth.jwt() ->> 'email'
    and is_active = true
  );

-- Política: admin pode fazer tudo (leitura, insert, update, delete)
-- Substitua 'admin@hypatiacapital.com.br' pelo seu email de admin
create policy "Admin tem acesso total"
  on dashboards for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Alternativa mais simples para o admin (sem depender de configuração):
-- Descomente as linhas abaixo e remova as políticas acima se preferir
-- (substitua o email pelo seu)
--
-- drop policy if exists "Admin tem acesso total" on dashboards;
-- create policy "Admin tem acesso total"
--   on dashboards for all
--   using (auth.jwt() ->> 'email' = 'admin@hypatiacapital.com.br')
--   with check (auth.jwt() ->> 'email' = 'admin@hypatiacapital.com.br');
