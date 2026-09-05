export default {
    settings: {
        query: "Query",
        files: "Files",
        display: "Display",
        covers: "Covers",
        misc: "Misc",

        showAdultContent: "Show Adult Content",

        animeFolder: "Anime Folder",
        mangaFolder: "Manga Folder",
        // gameFolder: "Game Folder",
        onDuplicate: "On Duplicate",

        ratingDisplay: "Rating Display",
        titleLanguage: "Title Language",
        defaultMediaType: "Default media type",

        coverMode: "Cover Mode",
        animeCoversFolder: "Anime Covers Folder",
        mangaCoversFolder: "Manga Covers Folder",
        // gamesCoversFolder: "Games Covers Folder",

        openOnStartup: "Open on Startup",
    },

    onDuplicate: {
        ask: "Ask",
        overwrite: "Overwrite",
        ignore: "Ignore",
    },

    RatingDisplay: {
        numeric: "Numeric",
        emoji: "Emoji",
        stars: "Stars",
        tier: "Tier",
        // word: "Word",
    },

    titleLanguage: {
        canonical: "Canonical",
        english: "English",
        native: "Native",
    },

    coverMode: {
        download: "Download Covers",
        link: "Use URL",
        skip: "Don't Use Covers"
    },

    media: {
        anime: "Anime",
        manga: "Manga",
        // game: "Game",
    },

    import: {
        addMediaFrom: "Add Media From",
        search: "Search",
        searchPlaceholder: "Search…",
        searching: "Searching…",
        import: "Import",
        imported: "{title} successfully imported!"
    },

    status: {
        all: "All",
        planned: "Planned",
        reading: "Reading",
        watching: "Watching",
        waiting: "Waiting",
        dropped: "Dropped",
        completed: "Completed",
    },

    rating: {
        all: "All",
        none: "Unrated",
    },

    card: {
        setRating: "Set Rating",
        clearRating: "Clear Rating",
        setStatus: "Set Status",
        setAlias: "Set Alias",
        placeholder: "Enter an alias",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
    },

    stats: {
        stats: "Stats",
        byType: "By Type",
        byRating: "By Rating",
        byStatus: "By Status",
    },

    error: {
        noProvider: "No provider selected!",
        searchError: "Search failed!",
        importError: "Import failed!",
        noResults: "There're no results for your search!",
    },
} as const;