#!/usr/bin/env node
// Injects European Portuguese (pt-PT) translations into @quartz-community
// plugin bundles. Quartz ships pt-BR only, and each plugin bundles its own
// locale table, so pt-PT would otherwise fall back to English.
//
// Re-run after `npm install` (wired to postinstall) or after reinstalling
// plugins. Safe to run repeatedly.
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const pluginDir = path.join(root, "node_modules", "@quartz-community")

const patches = {
  backlinks: [
    "{",
    "  components: {",
    "    backlinks: {",
    '      title: "Ligações inversas",',
    '      noBacklinksFound: "Nenhuma ligação inversa encontrada"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  "content-meta": [
    "{",
    "  components: {",
    "    contentMeta: {",
    "      readingTime: ({ minutes }) => `Leitura de ${minutes} min`",
    "    }",
    "  }",
    "}",
  ].join("\n"),
  darkmode: [
    "{",
    "  components: {",
    "    themeToggle: {",
    '      darkMode: "Modo escuro",',
    '      lightMode: "Modo claro"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  explorer: [
    "{",
    "  components: {",
    "    explorer: {",
    '      title: "Explorador"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  "folder-page": [
    "{",
    "  pages: {",
    "    folderContent: {",
    '      folder: "Pasta",',
    "      itemsUnderFolder: ({ count }) =>",
    '        count === 1 ? "1 item nesta pasta." : `${count} itens nesta pasta.`',
    "    }",
    "  },",
    "  components: {}",
    "}",
  ].join("\n"),
  footer: [
    "{",
    "  components: {",
    "    footer: {",
    '      createdWith: "Criado com"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  graph: [
    "{",
    "  components: {",
    "    graph: {",
    '      title: "Vista de grafo"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  "reader-mode": [
    "{",
    "  components: {",
    "    readerMode: {",
    '      title: "Modo de leitura"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  "recent-notes": [
    "{",
    "  components: {",
    "    recentNotes: {",
    '      title: "Notas recentes",',
    "      seeRemainingMore: ({ remaining }) => `Ver mais ${remaining} →`",
    "    }",
    "  }",
    "}",
  ].join("\n"),
  search: [
    "{",
    "  components: {",
    "    search: {",
    '      title: "Pesquisar",',
    '      searchBarPlaceholder: "Pesquisar algo",',
    '      noResults: "Sem resultados.",',
    '      noResultsHint: "Tente outro termo de pesquisa?",',
    '      tagFilterHint: "Filtrar por etiqueta",',
    '      noTagsFound: "Nenhuma etiqueta encontrada"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  "table-of-contents": [
    "{",
    "  components: {",
    "    tableOfContents: {",
    '      title: "Índice"',
    "    }",
    "  }",
    "}",
  ].join("\n"),
  "tag-page": [
    "{",
    "  pages: {",
    "    tagContent: {",
    '      tag: "Etiqueta",',
    '      tagIndex: "Índice de etiquetas",',
    "      itemsUnderTag: ({ count }) =>",
    '        count === 1 ? "1 item com esta etiqueta." : `${count} itens com esta etiqueta.`,',
    "      showingFirst: ({ count }) => `A mostrar as primeiras ${count} etiquetas.`,",
    "      totalTags: ({ count }) => `Encontradas ${count} etiquetas no total.`",
    "    }",
    "  },",
    "  components: {}",
    "}",
  ].join("\n"),
}

function listJsFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listJsFiles(full))
    else if (entry.name.endsWith(".js")) out.push(full)
  }
  return out
}

// Hardcoded (non-i18n) strings in plugin component markup.
const replacements = [
  { plugin: "graph", from: '"aria-label": "Global Graph"', to: '"aria-label": "Grafo global"' },
  {
    plugin: "search",
    from: 'u2("title", { children: "Search" })',
    to: 'u2("title", { children: "Pesquisar" })',
  },
]

let patched = 0
for (const [name, objectLiteral] of Object.entries(patches)) {
  const dist = path.join(pluginDir, name, "dist")
  if (!fs.existsSync(dist)) continue
  for (const file of listJsFiles(dist)) {
    let src = fs.readFileSync(file, "utf8")
    if (!src.includes('"pt-BR": pt_BR_default,')) continue
    if (src.includes('"pt-PT": pt_PT_default,')) continue

    const lines = src.split("\n")
    const declIdx = lines.findIndex((l) => l.startsWith("var pt_BR_default = {"))
    if (declIdx === -1) continue
    let nextLocaleIdx = -1
    for (let i = declIdx + 1; i < lines.length; i++) {
      if (lines[i].startsWith("// src/i18n/")) {
        nextLocaleIdx = i
        break
      }
    }
    if (nextLocaleIdx === -1) continue

    const mapLine = lines.find((l) => l.trim() === '"pt-BR": pt_BR_default,')
    if (!mapLine) continue
    const indent = mapLine.match(/^\s*/)[0]

    lines.splice(nextLocaleIdx, 0, `var pt_PT_default = ${objectLiteral};`, "")
    const mapIdx = lines.findIndex((l) => l.trim() === '"pt-BR": pt_BR_default,')
    lines.splice(mapIdx + 1, 0, `${indent}"pt-PT": pt_PT_default,`)

    fs.writeFileSync(file, lines.join("\n"))
    console.log(`patched ${path.relative(root, file)}`)
    patched++
  }
}

console.log(`pt-PT: patched ${patched} plugin file(s).`)

let replaced = 0
for (const { plugin, from, to } of replacements) {
  const dist = path.join(pluginDir, plugin, "dist")
  if (!fs.existsSync(dist)) continue
  for (const file of listJsFiles(dist)) {
    const src = fs.readFileSync(file, "utf8")
    if (!src.includes(from)) continue
    fs.writeFileSync(file, src.split(from).join(to))
    console.log(`patched ${path.relative(root, file)}`)
    replaced++
  }
}
console.log(`pt-PT: patched ${replaced} hardcoded string(s).`)
