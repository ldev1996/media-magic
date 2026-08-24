import { setIcon } from "obsidian";
import { MediaMagicSettings } from "../settings";
import { ProviderRegistry, Media, Status, RatingValue } from "../types";
import { App } from "obsidian";
import { MediaImporter } from "../classes/MediaImporter";
import { ImportMediaModal } from "./ImportMediaModal";
import { MediaStatsModal } from "./MediaStatsModal";
import { resolveRating } from "../functions";

export interface MediaFilters {
    query: string;
    type: string;
    status: Status | null;
    rating: RatingValue | "unrated" | null;
}

export class MediaHeader {
    private searchEl: HTMLInputElement | null = null;
    private typeSelect: HTMLSelectElement | null = null;
    private statusSelect: HTMLSelectElement | null = null;
    private ratingSelect: HTMLSelectElement | null = null;

    constructor(
        private readonly container: HTMLElement,
        private readonly app: App,
        private readonly settings: MediaMagicSettings,
        private readonly providerRegistry: ProviderRegistry,
        private readonly allMedia: Media[],
        private readonly onFilter: (filters: MediaFilters) => void
    ) { }

    build(currentFilters: MediaFilters): void {
        this.container.empty();

        const top = this.container.createDiv({ cls: "media-magic-header-top" });
        const bottom = this.container.createDiv({ cls: "media-magic-header-bottom" });

        // SEARCH
        this.searchEl = top.createEl("input", {
            type: "text",
            placeholder: "Search…"
        });
        this.searchEl.value = currentFilters.query;

        // BUTTONS
        const statsBtn = top.createEl("button");
        setIcon(statsBtn, "bar-chart-2");
        statsBtn.addEventListener("click", () => {
            new MediaStatsModal(this.app, this.allMedia, this.settings).open();
        });

        const addBtn = top.createEl("button");
        setIcon(addBtn, "circle-plus");
        addBtn.addClass("media-magic-button");
        addBtn.addEventListener("click", () => {
            new ImportMediaModal(
                this.app,
                this.providerRegistry,
                this.settings,
                async (media: Media) => {
                    const importer = new MediaImporter(this.app, this.settings);
                    await importer.import(media);
                }
            ).open();
        });

        // TYPE
        this.typeSelect = bottom.createEl("select", { cls: "media-magic-select" });
        [
            { value: "anime", label: "Anime" },
            { value: "manga", label: "Manga" }
        ].forEach(({ value, label }) => {
            const opt = this.typeSelect!.createEl("option", { text: label });
            opt.value = value;
            if ((currentFilters.type ?? "") === value) opt.selected = true;
        });

        // STATUS
        this.statusSelect = bottom.createEl("select", { cls: "media-magic-select" });
        [
            { value: "", label: "All statuses" },
            ...Object.values(Status).map(s => ({ value: s, label: s }))
        ].forEach(({ value, label }) => {
            const opt = this.statusSelect!.createEl("option", { text: label });
            opt.value = value;
            if ((currentFilters.status ?? "") === value) opt.selected = true;
        });

        // RATING
        this.ratingSelect = bottom.createEl("select", { cls: "media-magic-select" });
        [
            { value: "", label: "All ratings" },
            { value: "unrated", label: "Unrated" },
            ...[5, 4, 3, 2, 1].map(i => ({
                value: String(i),
                label: resolveRating(i as RatingValue, this.settings.ratingDisplay)
            }))
        ].forEach(({ value, label }) => {
            const opt = this.ratingSelect!.createEl("option", { text: label });
            opt.value = value;
            if ((currentFilters.rating ?? "") === value) opt.selected = true;
        });

        // EMIT — lê todos os elementos no momento do evento
        const emitFilters = () => {
            this.onFilter({
                query: this.searchEl?.value ?? "",
                type: this.typeSelect?.value || "anime",
                status: (this.statusSelect?.value as Status) || null,
                rating: this.ratingSelect?.value
                    ? (this.ratingSelect.value === "unrated"
                        ? "unrated"
                        : Number(this.ratingSelect.value) as RatingValue)
                    : null
            });
        };

        this.searchEl.addEventListener("input", emitFilters);
        this.typeSelect.addEventListener("change", emitFilters);
        this.statusSelect.addEventListener("change", emitFilters);
        this.ratingSelect.addEventListener("change", emitFilters);
    }
}