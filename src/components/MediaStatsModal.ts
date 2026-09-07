import { App, Modal, setIcon } from "obsidian";
import { Media, Status, RatingValue, MediaType } from "../types";
import { resolveStatusIcon, resolveRating } from "../functions";
import { MediaMagicSettings } from "../settings";
import { t } from "../i18n/i18n";

export class MediaStatsModal extends Modal {
    constructor(
        app: App,
        private readonly media: Media[],
        private readonly settings: MediaMagicSettings
    ) {
        super(app);
    }

    onOpen(): void {
        const el = this.contentEl;
        el.empty();

        el.createEl("h2", {
            text: t("stats.stats")
        });

        const stats = this.computeStats();

        this.renderTypeSection(stats.byType);
        this.renderRatingSection(stats.byRating);
        this.renderStatusSection(stats.byStatus);
    }

    // -------------------------
    // DATA
    // -------------------------
    private computeStats() {
        const byType: Record<MediaType, number> = {
            anime: 0,
            manga: 0,
            game: 0,
        };

        const byRating: Record<RatingValue | "unrated", number> = {
            "unrated": 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        const byStatus: Record<Status, number> = {
            [Status.Watching]: 0,
            [Status.Reading]: 0,
            [Status.Playing]: 0,
            [Status.Planned]: 0,
            [Status.OnHold]: 0,
            [Status.Waiting]: 0,
            [Status.Dropped]: 0,
            [Status.Completed]: 0,
            [Status.Completed100]: 0,
        };

        for (const m of this.media) {
            byType[m.type]++;
            byRating[m.rating ?? "unrated"]++;
            byStatus[m.status]++;
        }

        return { byType, byRating, byStatus };
    }

    // -------------------------
    // GRID HELPERS
    // -------------------------
    private createGrid(): HTMLElement {
        return this.contentEl.createDiv({
            cls: "media-magic-stats-grid"
        });
    }

    private createCard(
        container: HTMLElement,
        label: string,
        value: string | number,
        icon?: string
    ) {
        const card = container.createDiv({
            cls: "media-magic-stat-card"
        });

        const header = card.createDiv({
            cls: "media-magic-stat-card-header"
        });

        if (icon) {
            const iconEl = header.createSpan({
                cls: "media-magic-stat-icon"
            });
            setIcon(iconEl, icon);
        }

        header.createSpan({
            text: label,
            cls: "media-magic-stat-label"
        });

        card.createDiv({
            text: String(value),
            cls: "media-magic-stat-value"
        });
    }

    // -------------------------
    // SECTIONS
    // -------------------------
    private renderTypeSection(data: Record<MediaType, number>) {
        this.contentEl.createEl("h3", {
            text: t("stats.byType")
        });

        const grid = this.createGrid();

        for (const [type, value] of Object.entries(data) as [MediaType, number][]) {
            this.createCard(
                grid,
                t(`media.${type}`),
                value
            );
        }
    }

    private renderRatingSection(data: Record<RatingValue | "unrated", number>) {
        this.contentEl.createEl("h3", { text: t("stats.byRating") });

        const grid = this.createGrid();

        for (const [key, value] of Object.entries(data) as [
            RatingValue | "unrated",
            number
        ][]) {
            const label =
                key === "unrated"
                    ? t("rating.none")
                    : resolveRating(key, this.settings.ratingDisplay);

            this.createCard(grid, label, value);
        }
    }

    private renderStatusSection(data: Record<Status, number>) {
        this.contentEl.createEl("h3", {
            text: t("stats.byStatus")
        });

        const grid = this.createGrid();

        for (const [status, value] of Object.entries(data) as [Status, number][]) {
            this.createCard(
                grid,
                t(`status.${status}`),
                value,
                resolveStatusIcon(status),
            );
        }
    }
}