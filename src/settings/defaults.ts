import { CoverMode, OnDuplicateAction, RatingDisplay, TitleLanguage } from './enums';
import { MediaMagicSettings } from "./settings";

export const DEFAULT_SETTINGS: MediaMagicSettings = {
    // Query
    showAdult: false,
    igdbClientId: "",
    igdbClientSecret: "",

    // Files
    animeFolder: "Media/Anime",
    mangaFolder: "Media/Manga",
    gamesFolder: "Media/Game",
    onDuplicate: OnDuplicateAction.Ask,

    // Display
    ratingDisplay: RatingDisplay.Stars,
    titleLanguage: TitleLanguage.Canonical,
    defaultMediaType: "anime",

    // Covers
    coverMode: CoverMode.Link,
    animeCoversFolder: "Covers/Anime",
    mangaCoversFolder: "Covers/Manga",
    gamesCoversFolder: "Covers/Games",

    // Misc
    openOnStartup: false,
};