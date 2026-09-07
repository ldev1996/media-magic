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
    animeCoversFolder: "Media/Covers/Anime",
    mangaCoversFolder: "Media/Covers/Manga",
    gamesCoversFolder: "Media/Covers/Games",

    // Misc
    openOnStartup: false,
};