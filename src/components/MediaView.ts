import { App, ItemView, WorkspaceLeaf } from "obsidian";
import { Media, ProviderRegistry } from "../types";
import { MediaMagicSettings } from "../settings";
import { resolveMediaTitle } from "../functions";
import { MediaRepository } from "../classes/MediaRepository";
import { MediaFilters, MediaHeader } from "./MediaHeader";
import { MediaCard } from "./MediaCard";

export const MEDIA_VIEW_TYPE = "media-magic-view";

export class MediaView extends ItemView {
    private allMedia: Media[] = [];
    private filterQuery = "";
    private refreshTimeout?: number;

    private gridEl: HTMLElement | null = null;
    private header: MediaHeader | null = null;
    private repository: MediaRepository;

    constructor(
        leaf: WorkspaceLeaf,
        private readonly settings: MediaMagicSettings,
        private readonly providerRegistry: ProviderRegistry,
        app: App
    ) {
        super(leaf);
        this.repository = new MediaRepository(app, settings);
    }

    getViewType() { return MEDIA_VIEW_TYPE; }
    getDisplayText() { return "Media Magic"; }
    getIcon() { return "library"; }

    private filters: MediaFilters = {
        query: "",
        type: this.settings.defaultMediaType,
        status: null,
        rating: null
    };

    async onOpen(): Promise<void> {
        this.loadMedia();
        this.render();
        this.registerEvent(this.app.vault.on("modify", () => this.refresh()));
        this.registerEvent(this.app.vault.on("create", () => this.refresh()));
        this.registerEvent(this.app.vault.on("delete", () => this.refresh()));
    }

    async onClose(): Promise<void> {
        this.containerEl.empty();
    }

    onSettingsChange(): void {
        this.loadMedia();
        this.renderGrid();
    }

    private refresh(): void {
        if (this.refreshTimeout) window.clearTimeout(this.refreshTimeout);
        this.refreshTimeout = window.setTimeout(() => {
            this.loadMedia();
            this.renderGrid();
        }, 150);
    }

    private loadMedia(): void {
        this.allMedia = this.repository.getAll().sort((a, b) => {
            return resolveMediaTitle(a, this.settings)
                .localeCompare(resolveMediaTitle(b, this.settings), undefined, { sensitivity: "base" });
        });
    }

    private render(): void {
        this.containerEl.empty();

        const root = this.containerEl.createDiv({ cls: "media-magic-view" });
        const headerEl = root.createDiv({ cls: "media-magic-header" });
        const scroll = root.createDiv({ cls: "media-magic-scroll" });
        this.gridEl = scroll.createDiv({ cls: "media-magic-grid" });

        this.header = new MediaHeader(
            headerEl,
            this.app,
            this.settings,
            this.providerRegistry,
            this.allMedia,
            (filters) => {
                this.filters = filters;
                this.renderGrid();
            }
        );
        this.header.build(this.filters);
        this.renderGrid();
    }

    private renderGrid(): void {
        if (!this.gridEl) {
            return;
        }

        this.gridEl.empty();

        const card = new MediaCard(
            this.app,
            this.settings
        );

        for (const item of this.getFilteredMedia()) {
            card.render(
                this.gridEl,
                item
            );
        }
    }

    private getFilteredMedia(): Media[] {
        return this.allMedia.filter(m => {
            if (this.filters.query) {
                const q = this.filters.query.toLowerCase();

                const match = [
                    m.alias,
                    m.title,
                    m.englishTitle,
                    m.nativeTitle
                ]
                    .filter(Boolean)
                    .some(t => t!.toLowerCase().includes(q));

                if (!match) return false;
            }

            if (this.filters.type && m.type !== this.filters.type) {
                return false;
            }

            if (this.filters.status && m.status !== this.filters.status) {
                return false;
            }

            if (this.filters.rating !== null) {
                if (this.filters.rating === "unrated") {
                    if (m.rating) return false;
                } else {
                    if (m.rating !== this.filters.rating) return false;
                }
            }

            return true;
        });
    }
}