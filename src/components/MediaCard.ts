import { App, Menu, Modal, TFile, setIcon } from "obsidian";
import { Media, RatingValue, Status } from "../types";
import { MediaMagicSettings } from "../settings";
import { resolveMediaTitle, resolveRating, resolveStatusIcon } from "../functions";
import { t } from "../i18n/i18n";

class AliasModal extends Modal {
    private value = "";
    private onSubmit: (value: string) => void;

    constructor(
        app: App,
        currentValue: string,
        onSubmit: (value: string) => void
    ) {
        super(app);
        this.value = currentValue;
        this.onSubmit = onSubmit;
    }

    onOpen(): void {
        const { contentEl } = this;

        contentEl.empty();
        contentEl.addClass("media-magic-alias-modal");

        contentEl.createEl("h2", {
            text: t("card.setAlias")
        });

        const input = contentEl.createEl("input", {
            type: "text",
            placeholder: t("card.placeholder"),
            cls: "media-magic-alias-input"
        });

        input.value = this.value;

        const buttons = contentEl.createDiv({
            cls: "media-magic-alias-buttons"
        });

        const cancelButton = buttons.createEl("button", {
            text: t("card.cancel")
        });

        cancelButton.addEventListener("click", () => {
            this.close();
        });

        const saveButton = buttons.createEl("button", {
            text: t("card.save"),
            cls: "mod-cta"
        });

        saveButton.addEventListener("click", () => {
            this.submit(input.value);
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.submit(input.value);
            }

            if (event.key === "Escape") {
                event.preventDefault();
                this.close();
            }
        });

        window.setTimeout(() => {
            input.focus();
            input.select();
        }, 0);
    }

    private submit(value: string): void {
        this.onSubmit(value.trim());
        this.close();
    }
}

export class MediaCard {
    constructor(
        private readonly app: App,
        private readonly settings: MediaMagicSettings
    ) { }

    render(container: HTMLElement, media: Media): void {
        const card = container.createDiv({ cls: "media-magic-card" });

        if (media.cover) {
            const img = card.createEl("img", {
                cls: "media-magic-card-cover"
            });
            img.src = media.cover;
        }

        const overlay = card.createDiv({ cls: "media-magic-overlay" });

        overlay.createEl("h3", {
            text: resolveMediaTitle(media, this.settings),
            cls: "media-magic-title"
        });

        const meta = overlay.createDiv({ cls: "media-magic-meta" });

        if (media.status) {
            const badge = meta.createSpan({
                cls: `media-magic-status media-magic-status--${this.slugify(media.status)}`
            });

            const iconEl = badge.createSpan({
                cls: "media-magic-status-icon"
            });

            setIcon(iconEl, resolveStatusIcon(media.status));
            badge.createSpan({ text: t(`status.${media.status}`) });
        }

        if (media.rating) {
            const ratingBadge = meta.createSpan({
                cls: "media-magic-rating"
            });

            ratingBadge.createSpan({
                text: resolveRating(
                    media.rating,
                    this.settings.ratingDisplay
                )
            });
        }

        card.addEventListener("click", () => this.openMedia(media));

        card.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this.openCardMenu(media, event);
        });
    }

    private openCardMenu(media: Media, event: MouseEvent): void {
        const menu = new Menu();

        menu.addItem(item =>
            item
                .setTitle(t("card.setAlias"))
                .setIcon("pencil")
                .onClick(() => this.openAliasModal(media))
        );

        menu.addItem(item =>
            item
                .setTitle(t("card.setRating"))
                .setIcon("star")
                .onClick(() => this.openRatingMenu(media, event))
        );

        menu.addItem(item =>
            item
                .setTitle(t("card.setStatus"))
                .setIcon("circle")
                .onClick(() => this.openStatusMenu(media, event))
        );

        menu.addSeparator();

        menu.addItem(item =>
            item
                .setTitle(t("card.delete"))
                .setIcon("trash")
                .setWarning(true)
                .onClick(() => this.deleteMedia(media))
        );

        menu.showAtMouseEvent(event);
    }

    private openAliasModal(media: Media): void {
        new AliasModal(
            this.app,
            media.alias ?? "",
            async (alias) => {
                await this.updateFrontmatter(media, {
                    alias: alias || undefined
                });
            }
        ).open();
    }

    private openRatingMenu(media: Media, event: MouseEvent): void {
        const menu = new Menu();

        for (let i = 5; i >= 1; i--) {
            menu.addItem(item =>
                item
                    .setTitle(resolveRating(i as RatingValue, this.settings.ratingDisplay))
                    .setChecked(media.rating === i)
                    .onClick(async () => {
                        await this.updateFrontmatter(media, {
                            rating: i as RatingValue
                        });
                    })
            );
        }

        menu.addSeparator();

        menu.addItem(item =>
            item
                .setTitle(t("card.clearRating"))
                .setIcon("x")
                .setWarning(true)
                .onClick(async () => {
                    await this.updateFrontmatter(media, {
                        rating: undefined
                    });
                })
        );

        menu.showAtMouseEvent(event);
    }

    private openStatusMenu(media: Media, event: MouseEvent): void {
        const menu = new Menu();

        for (const status of this.getAvailableStatuses(media)) {
            menu.addItem(item =>
                item
                    .setTitle(t(`status.${status}`))
                    .setIcon(resolveStatusIcon(status))
                    .setChecked(media.status === status)
                    .onClick(async () => {
                        await this.updateFrontmatter(media, { status });
                    })
            );
        }

        menu.showAtMouseEvent(event);
    }

    private getAvailableStatuses(media: Media): Status[] {
        return Object.values(Status).filter(status => {
            if (media.type === "anime" && status === Status.Reading) {
                return false;
            }

            if (media.type === "manga" && status === Status.Watching) {
                return false;
            }

            return true;
        });
    }

    private async updateFrontmatter(
        media: Media,
        update: Partial<Media>
    ): Promise<void> {
        if (!media.path) return;

        const file = this.app.vault.getAbstractFileByPath(media.path);

        if (!(file instanceof TFile)) return;

        await this.app.fileManager.processFrontMatter(file, (fm) => {
            Object.assign(fm, update);
        });
    }

    private async openMedia(media: Media): Promise<void> {
        if (!media.path) return;

        const file = this.app.vault.getAbstractFileByPath(media.path);

        if (!(file instanceof TFile)) return;

        const leaf = this.app.workspace.getMostRecentLeaf();

        if (!leaf) return;

        await leaf.openFile(file);
        this.app.workspace.revealLeaf(leaf);
    }

    private async deleteMedia(media: Media): Promise<void> {
        if (!media.path) return;

        const file = this.app.vault.getAbstractFileByPath(media.path);

        if (!(file instanceof TFile)) return;

        await this.app.vault.trash(file, true);
    }

    private slugify(value: string): string {
        return value
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    }
}