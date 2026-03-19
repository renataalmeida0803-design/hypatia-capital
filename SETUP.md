# Hypatia Capital — Guia de Deploy Completo

## Visão Geral

Stack: **Next.js 14 + Supabase + Vercel**

- **Supabase**: banco de dados (PostgreSQL) + autenticação por magic link
- **Vercel**: hospedagem do app Next.js
- **LocalWeb**: domínio HypatiaCapital.com.br (você já possui)

---

## PASSO 1 — Criar projeto no Supabase

1. Acesse https://app.supabase.com e crie uma conta (gratuito)
2. Clique em **"New Project"**
3. Dê o nome `hypatia-capital`, escolha a região **South America (São Paulo)**
4. Salve a senha do banco (você vai precisar dela)
5. Aguarde o projeto inicializar (~2 min)

### Configurar o banco de dados

1. No painel do Supabase, clique em **SQL Editor** (ícone de banco no menu lateral)
2. Cole o conteúdo do arquivo `supabase/schema.sql` e execute
3. Vá em **Authentication → Policies** e confirme que a tabela `dashboards` aparece com RLS ativado

### Configurar o email de autenticação (magic link)

1. Vá em **Authentication → Email Templates**
2. Em **"Magic Link"**, personalize o template:
   - **Subject**: `Seu acesso à Hypatia Capital`
   - **Body** (sugestão):
     ```
     <h2>Hypatia Capital</h2>
     <p>Clique no botão abaixo para acessar seu relatório personalizado.</p>
     <a href="{{ .ConfirmationURL }}">Acessar meu relatório</a>
     <p>O link expira em 1 hora.</p>
     ```
3. Vá em **Authentication → URL Configuration**
   - **Site URL**: `https://hypatiacapital.com.br`
   - **Redirect URLs**: adicione `https://hypatiacapital.com.br/auth/callback`

### Obter as chaves da API

1. Vá em **Settings → API**
2. Copie:
   - **Project URL** (ex: `https://xyzxyz.supabase.co`)
   - **anon public key** (a chave longa que começa com `eyJ...`)

---

## PASSO 2 — Configurar variáveis de ambiente locais

Na pasta do projeto, copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Abra `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...sua-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=seuemail@hypatiacapital.com.br
NEXT_PUBLIC_SITE_URL=https://hypatiacapital.com.br
```

> **Importante**: `NEXT_PUBLIC_ADMIN_EMAIL` é o email que você usa para fazer login — ele terá acesso ao painel Admin.

---

## PASSO 3 — Testar localmente

```bash
cd "C:\Users\Jack\Desktop\CONSULTORIA JRL\hypatia-app"
npm install
npm run dev
```

Abra http://localhost:3000 no navegador.

- Digite seu email de admin → receba o magic link → acesse o painel Admin
- Faça upload de um HTML de teste para um email de cliente
- Abra uma aba anônima, acesse http://localhost:3000, use o email do cliente → veja o dashboard

---

## PASSO 4 — Deploy no Vercel

### Criar conta e importar projeto

1. Acesse https://vercel.com e crie uma conta (gratuito, use o GitHub)
2. No GitHub, crie um repositório privado e faça push do projeto:

```bash
cd "C:\Users\Jack\Desktop\CONSULTORIA JRL\hypatia-app"
git init
git add .
git commit -m "Initial commit - Hypatia Capital app"
```

3. Crie o repositório no GitHub (https://github.com/new) e siga as instruções do `git remote add origin`
4. No Vercel, clique em **"Add New Project"** → **"Import Git Repository"** → selecione o repositório

### Configurar variáveis de ambiente no Vercel

Na tela de configuração do deploy (ou em **Settings → Environment Variables** após o deploy):

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://SEU-PROJETO.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `seuemail@hypatiacapital.com.br` |
| `NEXT_PUBLIC_SITE_URL` | `https://hypatiacapital.com.br` |

5. Clique em **Deploy** — o Vercel vai gerar uma URL provisória como `hypatia-app.vercel.app`

---

## PASSO 5 — Apontar o domínio (LocalWeb → Vercel)

### No Vercel

1. Vá em **Settings → Domains**
2. Adicione `hypatiacapital.com.br` e também `www.hypatiacapital.com.br`
3. O Vercel vai mostrar os registros DNS que você precisa configurar

### No painel da LocalWeb

1. Acesse o painel da LocalWeb (https://painel.localweb.com.br)
2. Vá em **Domínios → Gerenciar DNS** do domínio HypatiaCapital.com.br
3. Apague os registros A e CNAME existentes (se houver)
4. Adicione os registros indicados pelo Vercel:

**Opção recomendada (CNAME para www + A para raiz):**

| Tipo | Nome | Valor |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> Os IPs do Vercel podem variar — sempre use os valores exatos que o Vercel indicar na tela de Domains.

5. Salve e aguarde a propagação DNS (pode levar de 30 min a 24h)

### Atualizar o Supabase com o domínio final

Depois que o domínio propagar:

1. Supabase → **Authentication → URL Configuration**
2. Confirme que **Site URL** está como `https://hypatiacapital.com.br`
3. Em **Redirect URLs**, confirme `https://hypatiacapital.com.br/auth/callback`

---

## PASSO 6 — Configurar RLS do admin no Supabase

A política de admin no `schema.sql` usa `current_setting('app.admin_email')`. Para simplificar, é mais confiável substituir pela versão com email hardcoded:

1. Supabase → **SQL Editor** → execute:

```sql
-- Remover política existente e criar versão simplificada
drop policy if exists "Admin tem acesso total" on dashboards;

create policy "Admin tem acesso total"
  on dashboards for all
  using (auth.jwt() ->> 'email' = 'SEU-EMAIL-ADMIN@hypatiacapital.com.br')
  with check (auth.jwt() ->> 'email' = 'SEU-EMAIL-ADMIN@hypatiacapital.com.br');
```

> Substitua `SEU-EMAIL-ADMIN@hypatiacapital.com.br` pelo seu email real.

---

## Fluxo de uso (dia a dia)

```
1. Você acessa hypatiacapital.com.br
2. Digita seu email de admin → recebe magic link → acessa painel Admin
3. Preenche: email do cliente, nome, mês/ano, arquivo HTML → clica "Publicar"
4. O cliente recebe email com magic link (se marcou a opção)
5. Cliente clica no link → acessa automaticamente o próprio dashboard
6. Dashboard renderiza o HTML que você fez upload
```

---

## Estrutura do projeto

```
hypatia-app/
├── app/
│   ├── page.tsx              # Login (magic link)
│   ├── auth/callback/        # Troca de código por sessão
│   ├── dashboard/page.tsx    # Área do cliente
│   └── admin/page.tsx        # Painel do advisor
├── components/
│   ├── AdminPanel.tsx        # Upload + lista de dashboards
│   └── DashboardViewer.tsx   # Visualizador (iframe)
├── lib/supabase/
│   ├── client.ts             # Supabase client-side
│   └── server.ts             # Supabase server-side
├── middleware.ts             # Proteção de rotas
├── supabase/schema.sql       # Schema do banco
└── .env.local.example        # Template de variáveis
```

---

## Troubleshooting

**Magic link não chega:**
- Verifique spam/lixo eletrônico
- No Supabase → Authentication → Logs, veja se o email foi enviado
- Confirme que o Redirect URL está exatamente como `https://hypatiacapital.com.br/auth/callback`

**Cliente vê "Nenhum relatório disponível":**
- Confirme que o email no upload é idêntico ao email de login do cliente (lowercase)
- Verifique se `is_active = true` no Supabase → Table Editor → dashboards

**Erro 500 no deploy:**
- Confirme que todas as 4 variáveis de ambiente estão preenchidas no Vercel
- Veja os logs em Vercel → Deployments → clicar no deploy → Functions

**Domínio não aponta para o Vercel:**
- Use https://dnschecker.org para verificar a propagação
- Aguarde até 24h após alterar DNS na LocalWeb
