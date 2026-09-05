import { CoverMode, OnDuplicateAction, RatingDisplay, TitleLanguage } from './enums';
import { MediaMagicSettings } from "./settings";

export const DEFAULT_SETTINGS: MediaMagicSettings = {
    // Query
    showAdult: false,

    // Files
    animeFolder: "Media/Anime",
    mangaFolder: "Media/Manga",
    onDuplicate: OnDuplicateAction.Ask,

    // Display
    ratingDisplay: RatingDisplay.Stars,
    titleLanguage: TitleLanguage.Canonical,
    defaultMediaType: "anime",

    // Covers
    coverMode: CoverMode.Link,
    animeCoversFolder: "Media/Covers/Anime",
    mangaCoversFolder: "Media/Covers/Manga",

    // Misc
    openOnStartup: false,
};