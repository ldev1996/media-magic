import { Media, RatingValue, Status } from "./types";
import { MediaMagicSettings, RatingDisplay, TitleLanguage } from "./settings";

const EMOJIS = ["🤮", "☹️", "😐", "🙂", "😍"] as const;
const TIERS = ["D", "C", "B", "A", "S"] as const;

const titleResolvers = {
    [TitleLanguage.English]: (m: Media) =>
        m.englishTitle ?? m.title,

    [TitleLanguage.Native]: (m: Media) =>
        m.nativeTitle ?? m.title,

    [TitleLanguage.Canonical]: (m: Media) =>
        m.title,
} satisfies Record<TitleLanguage, (m: Media) => string>;

const ratingResolvers = {
    stars: (r: RatingValue) =>
        "★".repeat(r) + "☆".repeat(5 - r),

    emoji: (r: RatingValue) =>
        `${EMOJIS[r - 1]}`,

    tier: (r: RatingValue) =>
        `${TIERS[r - 1]}-tier`,

    numeric: (r: RatingValue) =>
        `${r}/5`,
} satisfies Record<RatingDisplay, (r: RatingValue) => string>;

const statusIcons = {
    [Status.Planned]: "circle",
    [Status.Reading]: "book-open",
    [Status.Watching]: "play",
    [Status.Waiting]: "clock",
    [Status.Dropped]: "x",
    [Status.Completed]: "check",
} satisfies Record<Status, string>;

// ---------------------------------------------------- Export Functions
export function resolveMediaTitle(media: Media, settings: MediaMagicSettings): string {
    if (media.alias?.trim()) {
        return media.alias.trim();
    }
    return titleResolvers[settings.titleLanguage](media);
}

export function resolveStatusIcon(status: Status): string {
    return statusIcons[status];
}

export function resolveRating(rating: RatingValue, display: RatingDisplay) {
    return ratingResolvers[display](rating);
}