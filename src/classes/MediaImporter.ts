import { App, TFile, stringifyYaml } from "obsidian";
import { Media } from "../types";
import { MediaMagicSettings, OnDuplicateAction } from "../settings";

export class MediaImporter {
    constructor(
        private readonly app: App,
        private readonly settings: MediaMagicSettings
    ) { }

    async import(media: Media): Promise<TFile | null> {
        const folder = this.resolveFolder(media);

        const filePath = this.buildFilePath(media, folder);

        await this.ensureFolderStructure(filePath);

        const existing = this.app.vault.getAbstractFileByPath(filePath);

        if (existing instanceof TFile) {
            return this.handleDuplicate(existing, media);
        }

        const content = this.buildFrontmatter(media);

        return this.app.vault.create(filePath, content);
    }

    private async ensureFolderStructure(filePath: string) {
        const parts = filePath.split("/");
        parts.pop(); // remove filename

        let current = "";

        for (const part of parts) {
            current = current ? `${current}/${part}` : part;

            const exists = this.app.vault.getAbstractFileByPath(current);

            if (!exists) {
                await this.app.vault.createFolder(current);
            }
        }
    }

    private resolveFolder(media: Media): string {
        return media.type === "anime"
            ? this.settings.animeFolder
            : this.settings.mangaFolder;
    }

    private buildFilePath(media: Media, folder: string): string {
        const safeTitle = this.sanitizeFileName(media.title);

        const safeFolder = folder.replace(/\/+$/, ""); // remove trailing /

        return `${safeFolder}/${safeTitle}.md`;
    }

    private sanitizeFileName(name: string): string {
        return name.replace(/[\\/:*?"<>|]/g, "").trim();
    }

    /**
     * FRONTMATTER ONLY
     */
    private buildFrontmatter(media: Media): string {
        const yaml: Record<string, any> = {
            title: media.title,
            type: media.type,
            status: media.status,
            genres: media.genres,
            creators: media.creators,
        };

        if (media.englishTitle) {
            yaml.englishTitle = media.englishTitle;
        }

        if (media.nativeTitle) {
            yaml.nativeTitle = media.nativeTitle;
        }

        if (media.releaseYear) {
            yaml.releaseYear = media.releaseYear;
        }

        if (media.rating) {
            yaml.rating = media.rating;
        }

        if (media.cover) {
            yaml.cover = media.cover;
        }

        return this.toYamlFrontmatter(yaml);
    }

    private toYamlFrontmatter(obj: Record<string, any>): string {
        return `---\n${stringifyYaml(obj)}---\n`;
    }

    private serializeYamlValue(value: any): string {
        if (Array.isArray(value)) {
            return `[${value.map(v => `"${v}"`).join(", ")}]`;
        }

        if (typeof value === "string") {
            return `"${value}"`;
        }

        return String(value);
    }

    private async handleDuplicate(
        file: TFile,
        media: Media
    ): Promise<TFile | null> {
        switch (this.settings.onDuplicate) {
            case OnDuplicateAction.Ignore:
                return file;

            case OnDuplicateAction.Overwrite:
                await this.app.vault.modify(
                    file,
                    this.buildFrontmatter(media)
                );
                return file;

            case OnDuplicateAction.Ask:
                return file;
        }
    }
}