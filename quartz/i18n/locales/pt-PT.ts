import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Sem título",
    description: "Sem descrição",
  },
  components: {
    callout: {
      note: "Nota",
      abstract: "Resumo",
      info: "Informação",
      todo: "A fazer",
      tip: "Dica",
      success: "Sucesso",
      question: "Pergunta",
      warning: "Aviso",
      failure: "Falha",
      danger: "Perigo",
      bug: "Erro",
      example: "Exemplo",
      quote: "Citação",
    },
    backlinks: {
      title: "Ligações inversas",
      noBacklinksFound: "Nenhuma ligação inversa encontrada",
    },
    themeToggle: {
      lightMode: "Modo claro",
      darkMode: "Modo escuro",
    },
    readerMode: {
      title: "Modo de leitura",
    },
    explorer: {
      title: "Explorador",
    },
    footer: {
      createdWith: "Criado com",
    },
    graph: {
      title: "Vista de grafo",
    },
    recentNotes: {
      title: "Notas recentes",
      seeRemainingMore: ({ remaining }) => `Ver mais ${remaining} →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Transclusão de ${targetSlug}`,
      linkToOriginal: "Ligação para o original",
    },
    search: {
      title: "Pesquisar",
      searchBarPlaceholder: "Pesquisar algo",
    },
    tableOfContents: {
      title: "Índice",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `Leitura de ${minutes} min`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Notas recentes",
      lastFewNotes: ({ count }) => `Últimas ${count} notas`,
    },
    error: {
      title: "Não encontrado",
      notFound: "Esta página é privada ou não existe.",
      home: "Voltar à página inicial",
    },
    folderContent: {
      folder: "Pasta",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 item nesta pasta." : `${count} itens nesta pasta.`,
    },
    tagContent: {
      tag: "Etiqueta",
      tagIndex: "Índice de etiquetas",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 item com esta etiqueta." : `${count} itens com esta etiqueta.`,
      showingFirst: ({ count }) => `A mostrar as primeiras ${count} etiquetas.`,
      totalTags: ({ count }) => `Encontradas ${count} etiquetas no total.`,
    },
  },
} as const satisfies Translation
