#!/usr/bin/env python3
"""
Hypatia Capital — Deploy Automático Completo
============================================
Este script configura TUDO automaticamente:
  1. Cria projeto no Supabase via Management API
  2. Cria a tabela dashboards e políticas RLS
  3. Configura autenticação (magic link)
  4. Cria repositório no GitHub e faz push do código
  5. Cria projeto no Vercel e deploya
  6. Configura variáveis de ambiente no Vercel
  7. Exibe instruções de DNS para a LocalWeb

Pré-requisitos: preencher setup/.env.setup com os tokens.
"""

import os, sys, time, json, subprocess, shutil
from pathlib import Path

# Força UTF-8 no terminal Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    import requests
except ImportError:
    print("Instalando requests...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

# ─── Configuração ────────────────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent.resolve()
ENV_FILE = Path(__file__).parent / ".env.setup"

def load_env():
    if not ENV_FILE.exists():
        print(f"\n❌  Arquivo não encontrado: {ENV_FILE}")
        print(    "    Copie setup/.env.setup.example para setup/.env.setup e preencha os tokens.\n")
        sys.exit(1)
    env = {}
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env

def require(env, *keys):
    missing = [k for k in keys if not env.get(k)]
    if missing:
        print(f"\n❌  Faltam as seguintes variáveis em .env.setup:")
        for k in missing:
            print(f"    • {k}")
        sys.exit(1)

# ─── Helpers HTTP ────────────────────────────────────────────────────────────

def sb_mgmt(method, path, token, **kwargs):
    """Supabase Management API"""
    r = requests.request(
        method,
        f"https://api.supabase.com{path}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        **kwargs
    )
    if not r.ok:
        print(f"\n❌  Supabase API erro {r.status_code}: {r.text}\n")
        sys.exit(1)
    return r.json() if r.text else {}

def gh(method, path, token, **kwargs):
    """GitHub API"""
    r = requests.request(
        method,
        f"https://api.github.com{path}",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        },
        **kwargs
    )
    if not r.ok and r.status_code not in (201, 204):
        print(f"\n❌  GitHub API erro {r.status_code}: {r.text}\n")
        sys.exit(1)
    return r.json() if r.text else {}

def vc(method, path, token, **kwargs):
    """Vercel API"""
    r = requests.request(
        method,
        f"https://api.vercel.com{path}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        **kwargs
    )
    if not r.ok:
        # Vercel retorna 409 se projeto já existe — tratamos depois
        if r.status_code == 409:
            return r.json()
        print(f"\n❌  Vercel API erro {r.status_code}: {r.text}\n")
        sys.exit(1)
    return r.json() if r.text else {}

# ─── PASSO 1 — Supabase: criar projeto ───────────────────────────────────────

def create_supabase_project(env):
    print("\n[1/6] Supabase — verificando organização...")
    orgs = sb_mgmt("GET", "/v1/organizations", env["SUPABASE_ACCESS_TOKEN"])
    if not orgs:
        print("❌  Nenhuma organização encontrada. Crie uma em app.supabase.com.")
        sys.exit(1)
    org_id = orgs[0]["id"]
    org_name = orgs[0]["name"]
    print(f"     Organização: {org_name} ({org_id})")

    print("[1/6] Supabase — criando projeto hypatia-capital...")
    # Verifica se já existe
    projects = sb_mgmt("GET", "/v1/projects", env["SUPABASE_ACCESS_TOKEN"])
    existing = next((p for p in projects if p["name"] == "hypatia-capital"), None)

    if existing:
        print(f"     Projeto já existe: {existing['id']} — reutilizando.")
        return existing["id"], existing["region"]

    payload = {
        "name": "hypatia-capital",
        "organization_id": org_id,
        "region": "sa-east-1",
        "plan": "free",
        "db_pass": env["SUPABASE_DB_PASSWORD"]
    }
    proj = sb_mgmt("POST", "/v1/projects", env["SUPABASE_ACCESS_TOKEN"], json=payload)
    proj_ref = proj["id"]
    print(f"     Projeto criado: {proj_ref}")

    print("     Aguardando inicialização (~90s)...")
    for i in range(30):
        time.sleep(5)
        status = sb_mgmt("GET", f"/v1/projects/{proj_ref}", env["SUPABASE_ACCESS_TOKEN"])
        if status.get("status") == "ACTIVE_HEALTHY":
            print("     Projeto pronto!")
            break
        print(f"     Status: {status.get('status', '...')} ({(i+1)*5}s)")
    else:
        print("⚠️   Timeout aguardando projeto. Continue mesmo assim.")

    return proj_ref, "sa-east-1"

# ─── PASSO 2 — Supabase: executar SQL ────────────────────────────────────────

def setup_database(proj_ref, env):
    print("\n[2/6] Supabase — configurando banco de dados...")

    sql = f"""
-- Tabela de dashboards
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

create index if not exists idx_dashboards_client_email on dashboards(client_email);

alter table dashboards enable row level security;

drop policy if exists "Clientes veem seus proprios dashboards" on dashboards;
create policy "Clientes veem seus proprios dashboards"
  on dashboards for select
  using (client_email = auth.jwt() ->> 'email' and is_active = true);

drop policy if exists "Admin tem acesso total" on dashboards;
create policy "Admin tem acesso total"
  on dashboards for all
  using (auth.jwt() ->> 'email' = '{env["ADMIN_EMAIL"]}')
  with check (auth.jwt() ->> 'email' = '{env["ADMIN_EMAIL"]}');
"""

    # Usa a API de SQL do Supabase (requer service_role via API de banco)
    r = requests.post(
        f"https://api.supabase.com/v1/projects/{proj_ref}/database/query",
        headers={
            "Authorization": f"Bearer {env['SUPABASE_ACCESS_TOKEN']}",
            "Content-Type": "application/json"
        },
        json={"query": sql}
    )
    if r.ok:
        print("     Tabela e políticas RLS criadas com sucesso.")
    else:
        print(f"⚠️   Não foi possível executar SQL via API ({r.status_code}): {r.text}")
        print("     Execute manualmente o arquivo supabase/schema.sql no SQL Editor do Supabase.")

    # Configura URL de redirecionamento
    print("     Configurando Auth redirect URLs...")
    site_url = env.get("SITE_URL", f"https://hypatiacapital.com.br")
    r2 = requests.patch(
        f"https://api.supabase.com/v1/projects/{proj_ref}/config/auth",
        headers={
            "Authorization": f"Bearer {env['SUPABASE_ACCESS_TOKEN']}",
            "Content-Type": "application/json"
        },
        json={
            "site_url": site_url,
            "uri_allow_list": f"{site_url}/auth/callback"
        }
    )
    if r2.ok:
        print(f"     Auth configurado: {site_url}")
    else:
        print(f"⚠️   Auth config parcial: {r2.status_code} — configure manualmente no painel.")

# ─── PASSO 3 — Obter credenciais do projeto Supabase ─────────────────────────

def get_supabase_keys(proj_ref, env):
    print("\n[3/6] Supabase — obtendo chaves da API...")
    keys = sb_mgmt("GET", f"/v1/projects/{proj_ref}/api-keys", env["SUPABASE_ACCESS_TOKEN"])
    anon_key = next((k["api_key"] for k in keys if k["name"] == "anon"), None)
    if not anon_key:
        print("❌  Não foi possível obter anon key. Copie manualmente de Settings → API.")
        sys.exit(1)
    proj_url = f"https://{proj_ref}.supabase.co"
    print(f"     URL: {proj_url}")
    print(f"     Anon key: {anon_key[:20]}...")
    return proj_url, anon_key

# ─── PASSO 4 — GitHub: criar repositório e push ──────────────────────────────

def setup_github(env, proj_url, anon_key):
    print("\n[4/6] GitHub — criando repositório privado...")

    # Obtém username
    user_info = gh("GET", "/user", env["GITHUB_TOKEN"])
    gh_user = user_info["login"]
    repo_name = "hypatia-capital"

    # Verifica se já existe
    r = requests.get(
        f"https://api.github.com/repos/{gh_user}/{repo_name}",
        headers={
            "Authorization": f"Bearer {env['GITHUB_TOKEN']}",
            "Accept": "application/vnd.github+json"
        }
    )
    if r.status_code == 404:
        gh("POST", "/user/repos", env["GITHUB_TOKEN"], json={
            "name": repo_name,
            "private": True,
            "description": "Hypatia Capital — Portal do Investidor MarketSense"
        })
        print(f"     Repositório criado: {gh_user}/{repo_name}")
    else:
        print(f"     Repositório já existe: {gh_user}/{repo_name}")

    repo_url = f"https://{env['GITHUB_TOKEN']}@github.com/{gh_user}/{repo_name}.git"

    # Cria .env.local com as credenciais reais
    env_local = ROOT / ".env.local"
    env_local.write_text(
        f"NEXT_PUBLIC_SUPABASE_URL={proj_url}\n"
        f"NEXT_PUBLIC_SUPABASE_ANON_KEY={anon_key}\n"
        f"NEXT_PUBLIC_ADMIN_EMAIL={env['ADMIN_EMAIL']}\n"
        f"NEXT_PUBLIC_SITE_URL={env.get('SITE_URL', 'https://hypatiacapital.com.br')}\n",
        encoding="utf-8"
    )

    # Cria .gitignore se não existir
    gitignore = ROOT / ".gitignore"
    if not gitignore.exists():
        gitignore.write_text(
            "node_modules/\n.next/\n.env.local\n.env*.local\nsetup/.env.setup\n*.log\n",
            encoding="utf-8"
        )

    git = shutil.which("git") or r"C:\Program Files\Git\cmd\git.exe"

    def run_git(*args, cwd=ROOT):
        result = subprocess.run([git, *args], cwd=cwd, capture_output=True, text=True)
        return result

    # Init e push
    run_git("init")
    run_git("config", "user.email", env["ADMIN_EMAIL"])
    run_git("config", "user.name", "Hypatia Capital")
    run_git("add", ".")
    run_git("commit", "-m", "feat: Hypatia Capital - Portal do Investidor v1.0")

    # Remove remote se existir e adiciona novo
    run_git("remote", "remove", "origin")
    run_git("remote", "add", "origin", repo_url)
    result = run_git("push", "-u", "origin", "main", "--force")
    if result.returncode != 0:
        # Tenta com master
        result2 = run_git("push", "-u", "origin", "master:main", "--force")
        if result2.returncode != 0:
            print(f"⚠️   Push falhou: {result.stderr}")
            print("     Faça o push manualmente: git push -u origin main")
    else:
        print(f"     Código publicado em github.com/{gh_user}/{repo_name}")

    return gh_user, repo_name

# ─── PASSO 5 — Vercel: criar projeto e configurar ────────────────────────────

def setup_vercel(env, gh_user, repo_name, proj_url, anon_key):
    print("\n[5/6] Vercel — configurando deploy...")

    site_url = env.get("SITE_URL", "https://hypatiacapital.com.br")
    domain = site_url.replace("https://", "").replace("http://", "")

    # Criar projeto no Vercel
    payload = {
        "name": "hypatia-capital",
        "framework": "nextjs",
        "gitRepository": {
            "type": "github",
            "repo": f"{gh_user}/{repo_name}"
        },
        "environmentVariables": [
            {"key": "NEXT_PUBLIC_SUPABASE_URL",    "value": proj_url, "target": ["production","preview","development"]},
            {"key": "NEXT_PUBLIC_SUPABASE_ANON_KEY","value": anon_key, "target": ["production","preview","development"]},
            {"key": "NEXT_PUBLIC_ADMIN_EMAIL",      "value": env["ADMIN_EMAIL"], "target": ["production","preview","development"]},
            {"key": "NEXT_PUBLIC_SITE_URL",         "value": site_url, "target": ["production","preview","development"]},
        ]
    }

    proj_data = vc("POST", "/v10/projects", env["VERCEL_TOKEN"], json=payload)

    if proj_data.get("error", {}).get("code") == "project_already_exists":
        print("     Projeto Vercel já existe — atualizando variáveis...")
        # Busca o projeto existente
        existing = vc("GET", "/v9/projects/hypatia-capital", env["VERCEL_TOKEN"])
        vercel_proj_id = existing.get("id", "hypatia-capital")
    else:
        vercel_proj_id = proj_data.get("id", "hypatia-capital")
        print(f"     Projeto Vercel criado: {vercel_proj_id}")

    # Adicionar domínio customizado
    print(f"     Adicionando domínio: {domain}...")
    vc("POST", f"/v10/projects/{vercel_proj_id}/domains", env["VERCEL_TOKEN"],
       json={"name": domain})
    vc("POST", f"/v10/projects/{vercel_proj_id}/domains", env["VERCEL_TOKEN"],
       json={"name": f"www.{domain}"})

    # Buscar configuração de DNS
    dns_data = vc("GET", f"/v10/projects/{vercel_proj_id}/domains/{domain}", env["VERCEL_TOKEN"])

    return vercel_proj_id, dns_data

# ─── PASSO 6 — Resultado final ───────────────────────────────────────────────

def print_summary(env, proj_url, anon_key, gh_user, repo_name, vercel_proj_id):
    domain = env.get("SITE_URL", "https://hypatiacapital.com.br").replace("https://", "")

    print("\n" + "═"*60)
    print("  ✅  HYPATIA CAPITAL — DEPLOY CONCLUÍDO")
    print("═"*60)
    print(f"""
📦 Supabase
   URL:      {proj_url}
   Anon key: {anon_key[:30]}...

🐙 GitHub
   Repo:     https://github.com/{gh_user}/{repo_name}

🚀 Vercel
   App:      https://hypatia-capital.vercel.app
   Projeto:  {vercel_proj_id}

🌐 DNS — Configure na LocalWeb (painel.localweb.com.br)
   ┌─────────┬─────────┬──────────────────────────────┐
   │ Tipo    │ Nome    │ Valor                        │
   ├─────────┼─────────┼──────────────────────────────┤
   │ A       │ @       │ 76.76.21.21                  │
   │ CNAME   │ www     │ cname.vercel-dns.com          │
   └─────────┴─────────┴──────────────────────────────┘
   Propagação: até 24h

🔑 Acesso Admin
   URL:      https://{domain}
   Email:    {env['ADMIN_EMAIL']}
   (Você receberá o magic link no email)

📋 Próximo passo:
   1. Configure o DNS acima na LocalWeb
   2. Acesse https://{domain} após propagar
   3. Digite seu email → receba o magic link → faça upload do primeiro dashboard
""")
    print("═"*60 + "\n")

# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    print("╔══════════════════════════════════════════════════════╗")
    print("║     Hypatia Capital — Setup Automático v1.0          ║")
    print("╚══════════════════════════════════════════════════════╝")

    env = load_env()
    require(env,
        "SUPABASE_ACCESS_TOKEN",
        "SUPABASE_DB_PASSWORD",
        "GITHUB_TOKEN",
        "VERCEL_TOKEN",
        "ADMIN_EMAIL"
    )

    proj_ref, _ = create_supabase_project(env)
    setup_database(proj_ref, env)
    proj_url, anon_key = get_supabase_keys(proj_ref, env)
    gh_user, repo_name = setup_github(env, proj_url, anon_key)
    vercel_proj_id, _ = setup_vercel(env, gh_user, repo_name, proj_url, anon_key)
    print_summary(env, proj_url, anon_key, gh_user, repo_name, vercel_proj_id)

if __name__ == "__main__":
    main()
