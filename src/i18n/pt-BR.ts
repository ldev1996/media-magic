export default {
    settings: {
        query: "Consulta",
        files: "Arquivos",
        display: "Exibição",
        covers: "Capas",
        misc: "Diversos",

        showAdultContent: "Mostrar Conteúdo Adulto",

        animeFolder: "Pasta de Anime",
        mangaFolder: "Pasta de Mangá",
        // gameFolder: "Pasta de Jogos",
        onDuplicate: "Mídia Duplicada",

        ratingDisplay: "Exibição da Avaliação",
        titleLanguage: "Idioma do Título",
        defaultMediaType: "Tipo de Mídia Padrão",

        coverMode: "Modo das Capas",
        animeCoversFolder: "Pasta das Capas de Anime",
        mangaCoversFolder: "Pasta das Capas de Mangá",
        // gamesCoversFolder: "Pasta das apas de Jogos",

        openOnStartup: "Abrir ao iniciar",
    },

    onDuplicate: {
        ask: "Perguntar",
        overwrite: "Sobrescrever",
        ignore: "Ignorar",
    },

    RatingDisplay: {
        numeric: "Numérico",
        emoji: "Emoji",
        stars: "Estrelas",
        tier: "Tier",
        // word: "Palavra",
    },

    titleLanguage: {
        canonical: "Canônica",
        english: "Inglês",
        native: "Nativo",
    },

    coverMode: {
        download: "Baixar Capas",
        link: "Usar URL",
        skip: "Não Usar Capas"
    },

    media: {
        anime: "Anime",
        manga: "Mangá",
        // game: "Jogo",
    },

    import: {
        addMediaFrom: "Adicionar Mídia De",
        search: "Buscar",
        searchPlaceholder: "Buscar…",
        searching: "Buscando…",
        import: "Importar",
        imported: "{title} importado com sucesso!"
    },

    status: {
        all: "Todos",
        planned: "Planejado",
        reading: "Lendo",
        watching: "Assistindo",
        waiting: "Esperando",
        dropped: "Abandonado",
        completed: "Concluído",
    },

    rating: {
        all: "Todos",
        none: "Não avaliado",
    },

    card: {
        setRating: "Definir Avaliação",
        clearRating: "Limpar Avaliação",
        setStatus: "Definir Status",
        setAlias: "Definir Apelido",
        placeholder: "Digite um apelido",
        cancel: "Cancelar",
        save: "Salvar",
        delete: "Excluir",
    },

    stats: {
        stats: "Estatísticas",
        byType: "Por Tipo",
        byRating: "Por Avaliação",
        byStatus: "Por Status",
    },

    error: {
        noProvider: "Nenhum provedor selecionado!",
        searchError: "Falha na busca!",
        importError: "Falha na importação!",
        noResults: "Não há resultados para a sua busca!",
    },
} as const;