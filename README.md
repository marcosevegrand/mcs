# Cybersec Notes Site (Quartz 5)

Static site for sharing master notes (Obsidian markdown + PDFs + images). Built with [Quartz](https://quartz.jzhao.xyz).

## Stack
- Quartz 5 — full Obsidian support: wikilinks, embeds, graph, backlinks, search
- `content/` is the Obsidian vault; output goes to `public/`
- VPS: `msc-web` container (Caddy static server) on the shared `web_network`; the global `caddy_proxy` reverse-proxies `mcs.marcosev.com` to it

## Local workflow
1. Open `content/` as Obsidian vault, write notes (each class is a folder with an `index.md`).
2. Drop PDFs/images inside the class folder.
3. Preview: `npx quartz build --serve` → http://localhost:8080 (auto-reloads).

Page titles come from frontmatter `title:` (Quartz falls back to the filename otherwise, which looks like `index`).

## Deploy
- Site: https://mcs.marcosev.com
- VPS: `ssh msc-vps` (key `~/.ssh/msc_vps`, alias in `~/.ssh/config`); project at `/opt/projects/msc` (git clone of this repo)
- Redeploy: `powershell -ExecutionPolicy Bypass -File deploy/update.ps1` (pulls `origin/master` on the VPS, then `docker compose build && docker compose up -d`)
- Manual: `git pull && docker compose build && docker compose up -d` in `/opt/projects/msc`

### Ops notes
- Edit content in Obsidian/an editor, **not** with PowerShell 5.1 `Get-Content`/`Set-Content` — it reads UTF-8 as ANSI and double-encodes accented characters.
- Folder names use UC initials (`gc`, `ascn`, `daa`, `sd`, `sr`, `ssc`); display names come from each `index.md` frontmatter `title`.
- Link assets relative to the **content root** (e.g. `[Slides](year-1/sem-1/gc/slides-01.pdf)`), not the current file — Quartz resolves relative links from the vault root.
- Global proxy config: `/opt/projects/proxy/Caddyfile` (container `caddy_proxy`, bind-mounted file).
  Never edit it with `sed -i` — that replaces the inode and the running container keeps seeing the old file.
  Write in place (or `cp` a temp over it) and run `docker exec caddy_proxy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile`.
- The site container serves `.html` via `try_files {path} {path}.html {path}/index.html` (`deploy/Caddyfile`), so extensionless URLs work.

## Config
- `quartz.config.yaml` — title, theme, plugins, `baseUrl: mcs.marcosev.com`
