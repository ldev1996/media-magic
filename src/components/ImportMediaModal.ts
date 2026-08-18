import {
    App,
    Modal,
    Notice,
    Setting,
    TextComponent
} from "obsidian";

import {
    Media,
    MediaProvider,
    MediaSearchResult,
    ProviderRegistry
} from "../types";
import { resolveMediaTitle } from "../functions";
import { MediaMagicSettings } from "../settings";

export class ImportMediaModal extends Modal {
    private provider?: MediaProvider;

    private query = "";

    private results: MediaSearchResult[] = [];

    private searchInput!: TextComponent;

    private resultsContainer!: HTMLElement;

    constructor(
        app: App,
        private readonly registry: ProviderRegistry,
        private readonly settings: MediaMagicSettings,
        private readonly onImport: (media: Media) => Promise<void>
    ) {
        super(app);
    }

    onOpen(): void {
        const { contentEl } = this;

        contentEl.empty();

        contentEl.createEl("h2", {
            text: "Add Media"
        });

        this.buildProviderSelector(contentEl);

        this.buildSearchField(contentEl);

        this.resultsContainer = contentEl.createDiv({
            cls: "media-magic-results"
        });
    }

    onClose(): void {
        this.contentEl.empty();
    }

    /**
     * Provider selector
     *
     * Ex:
     * Jikan Anime
     * Jikan Manga
     * AniList Anime
     */
    private buildProviderSelector(
        containerEl: HTMLElement
    ): void {
        new Setting(containerEl)
            .setName("Provider")
            .setDesc("Select a source")

            .addDropdown(dropdown => {
                const providers =
                    this.registry.getAll();

                dropdown.addOption(
                    "none",
                    "None"
                )

                providers.forEach(provider => {
                    dropdown.addOption(
                        provider.id,
                        provider.name
                    );
                });

                const firstProvider = providers[0];

                if (firstProvider) {
                    this.provider = firstProvider;

                    dropdown.setValue(firstProvider.id);
                } else {
                    dropdown.setValue("none")
                }

                dropdown.onChange(value => {
                    this.provider =
                        providers.find(
                            p => p.id === value
                        );

                    this.clearResults();
                });
            });
    }

    /**
     * Search input
     */
    private buildSearchField(
        containerEl: HTMLElement
    ): void {
        new Setting(containerEl)
            .setName("Search")

            .addText(text => {
                this.searchInput = text;

                text.setPlaceholder(
                    "Search..."
                );

                text.onChange(value => {
                    this.query = value;
                });

                text.inputEl.addEventListener(
                    "keydown",
                    async event => {
                        if (
                            event.key === "Enter"
                        ) {
                            await this.search();
                        }
                    }
                );
            })

            .addButton(button => {
                button
                    .setButtonText("Search")
                    .onClick(async () => {
                        await this.search();
                    });
            });
    }

    /**
     * Executes provider search
     */
    private async search(): Promise<void> {
        if (!this.provider) {
            new Notice(
                "No provider selected"
            );

            return;
        }

        const query = this.query.trim();

        if (!query.length) {
            return;
        }

        this.resultsContainer.empty();

        this.resultsContainer.createEl("p", {
            text: "Searching..."
        });

        try {
            this.results =
                await this.provider.search(
                    query,
                    this.settings
                );

            this.renderResults();
        } catch (error) {
            console.error(error);

            this.resultsContainer.empty();

            this.resultsContainer.createEl(
                "p",
                {
                    text: "Search failed"
                }
            );
        }
    }

    /**
     * Renders result list
     */
    private renderResults(): void {
        this.resultsContainer.empty();

        if (!this.results.length) {
            this.resultsContainer.createEl(
                "p",
                {
                    text: "No results"
                }
            );

            return;
        }

        for (const result of this.results) {
            this.renderResult(result);
        }
    }

    /**
     * Single search result card
     */
    private renderResult(
        result: MediaSearchResult
    ): void {
        const card =
            this.resultsContainer.createDiv({
                cls: "media-magic-result"
            });

        /**
         * Cover
         */
        if (result.cover) {
            card.createEl("img", {
                cls: "media-magic-result-cover",
                attr: {
                    src: result.cover
                }
            });
        }

        const info = card.createDiv({ cls: "media-magic-result-info" });

        /**
         * Title
         */
        info.createEl("h4", {
            text: resolveMediaTitle(result as any, this.settings),
            cls: "media-magic-result-title"
        });

        info.createEl("small", {
            text: result.type,
            cls: "media-magic-result-type"
        });

        /**
         * Import button
         */
        const actions =
            card.createDiv({
                cls: "media-magic-actions"
            });

        const button =
            actions.createEl("button", {
                text: "Import"
            });

        button.addEventListener(
            "click",
            async () => {
                await this.importResult(
                    result
                );
            }
        );
    }

    /**
     * Converts search result
     * into a Media object
     */
    private async importResult(
        result: MediaSearchResult
    ): Promise<void> {
        if (!this.provider) {
            return;
        }

        try {
            const media =
                await this.provider.getMedia(
                    result
                );

            await this.onImport(media);

            new Notice(
                `${resolveMediaTitle(media, this.settings)} imported`
            );

            this.close();
        } catch (error) {
            console.error(error);

            new Notice(
                "Import failed"
            );
        }
    }

    private clearResults(): void {
        this.results = [];

        this.resultsContainer.empty();
    }
}

