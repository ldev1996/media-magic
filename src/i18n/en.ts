export default {
    settings: {
        query: "Query",
        files: "Files",
        display: "Display",
        covers: "Covers",
        misc: "Misc",

        showAdultContent: "Show Adult Content",
        igdbClientId: "IGDB Client ID",
        igdbClientSecret: "IGDB Client Secret",
        testConnection: "Test Connection",

        animeFolder: "Anime Folder",
        mangaFolder: "Manga Folder",
        gamesFolder: "Game Folder",
        onDuplicate: "On Duplicate",

        ratingDisplay: "Rating Display",
        titleLanguage: "Title Language",
        defaultMediaType: "Default media type",

        coverMode: "Cover Mode",
        animeCoversFolder: "Anime Covers Folder",
        mangaCoversFolder: "Manga Covers Folder",
        gamesCoversFolder: "Games Covers Folder",

        openOnStartup: "Open on Startup",
    },

    settingsDesc: {
        testConnection: "Verify that your IGDB credentials are valid.",
    },

    onDuplicate: {
        ask: "Ask",
        overwrite: "Overwrite",
        ignore: "Ignore",
    },

    RatingDisplay: {
        emoji: "Emoji",
        word: "Word",
        emojiWord: "Emoji + Word",
        number: "Number",
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
        game: "Game",
    },

    import: {
        addMediaFrom: "Add Media From",
        search: "Search",
        searchPlaceholder: "Search…",
        searching: "Searching…",
        import: "Import",
        imported: "{title} successfully imported!",
        importError: "Import failed!",
    },

    igdb: {
        testingConnection: "Testing...",
        connectionSuccessful: "IGDB connection successful.",
        connectionFailed: "IGDB connection failed.",
    },

    status: {
        all: "All Statuses",
        watching: "Watching",
        reading: "Reading",
        playing: "Playing",
        planned: "Planned",
        on_hold: "On Hold",
        waiting: "Waiting",
        dropped: "Dropped",
        completed: "Completed",
        completed_100: "100% Completed",
    },

    rating: {
        all: "All Ratings",
        none: "Unrated",
        1: "Terrible",
        2: "Bad",
        3: "Weak",
        4: "Meh",
        5: "Okay",
        6: "Decent",
        7: "Good",
        8: "Great",
        9: "Awesome",
        10: "Masterpiece",
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
        noResults: "There're no results for your search!",
        igdbClientRequired: "IGDB Client ID and Client Secret are required!",
        igdbAuthError: "IGDB authentication failed with status {status}!",
    },
} as const;