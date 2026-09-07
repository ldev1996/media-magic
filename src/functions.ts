import { Media, MediaType, RatingValue, Status } from "./types";
import { MediaMagicSettings, RatingDisplay, TitleLanguage } from "./settings";
import { t, TranslationKey } from "./i18n/i18n";

const EMOJIS = [
    "💀",
    "😓",
    "🙁",
    "😐",
    "😶",
    "🙂",
    "😀",
    "😎",
    "😍",
    "🏆"
] as const;

const getRatingWord = (rating: RatingValue): string =>
    t(`rating.${rating}` as TranslationKey);

function getRatingEmoji(rating: RatingValue): string {
    return EMOJIS[rating - 1]!;
}

const titleResolvers = {
    [TitleLanguage.English]: (m: Media) =>
        m.englishTitle ?? m.title,

    [TitleLanguage.Native]: (m: Media) =>
        m.nativeTitle ?? m.title,

    [TitleLanguage.Canonical]: (m: Media) =>
        m.title,
} satisfies Record<TitleLanguage, (m: Media) => string>;

const ratingResolvers = {
    word: (r: RatingValue) =>
        getRatingWord(r),
    emoji: (r: RatingValue) =>
        getRatingEmoji(r),
    emoji_word: (r: RatingValue) =>
        `${getRatingEmoji(r)} ${getRatingWord(r)}`,
    number: (r: RatingValue) =>
        `${r}`,
} satisfies Record<RatingDisplay, (r: RatingValue) => string>;

const statusIcons = {
    [Status.Planned]: "circle",
    [Status.Reading]: "book-open",
    [Status.Watching]: "play",
    [Status.Playing]: "gamepad-2",
    [Status.Waiting]: "clock",
    [Status.OnHold]: "pause",
    [Status.Dropped]: "x",
    [Status.Completed]: "check",
    [Status.Completed100]: "trophy",
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

export function getStatusesForType(type: MediaType): Status[] {
    switch (type) {
        case "anime":
            return [
                Status.Watching,
                Status.Planned,
                Status.OnHold,
                Status.Waiting,
                Status.Dropped,
                Status.Completed,
            ];
        case "manga":
            return [
                Status.Reading,
                Status.Planned,
                Status.OnHold,
                Status.Waiting,
                Status.Dropped,
                Status.Completed,
            ];
        case "game":
            return [
                Status.Playing,
                Status.Planned,
                Status.OnHold,
                Status.Waiting,
                Status.Dropped,
                Status.Completed,
                Status.Completed100,
            ];
        default:
            return [];
    }
}