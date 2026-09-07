import { App } from "obsidian";
import { Media } from "../types";
import { MediaMagicSettings } from "../settings";

export class MediaRepository {
    constructor(
        private readonly app: App,
        private readonly settings: MediaMagicSettings
    ) { }

    getAll(): Media[] {
        const files = this.app.vault.getMarkdownFiles();

        const mediaList: Media[] = [];

        for (const file of files) {
            if (!this.isInMediaFolder(file.path)) continue;

            const data = this.app.metadataCache.getFileCache(file);
            const fm = data?.frontmatter;

            if (!fm || !fm.type) continue;

            mediaList.push({
                path: file.path,

                title: fm.title,
                englishTitle: fm.englishTitle,
                nativeTitle: fm.nativeTitle,
                alias: fm.alias,

                type: fm.type,
                creators: fm.creators ?? [],
                genres: fm.genres ?? [],
                releaseYear: fm.releaseYear,
                cover: fm.cover,

                status: fm.status,
                rating: fm.rating
            });
        }

        return mediaList;
    }

    private isInMediaFolder(filePath: string): boolean {
        const animeFolder = this.settings.animeFolder.replace(/\/+$/, "");
        const mangaFolder = this.settings.mangaFolder.replace(/\/+$/, "");
        const gamesFolder = this.settings.gamesFolder.replace(/\/+$/, "");

        return (
            filePath.startsWith(animeFolder + "/") ||
            filePath.startsWith(mangaFolder + "/") ||
            filePath.startsWith(gamesFolder + "/")
        );
    }
}
