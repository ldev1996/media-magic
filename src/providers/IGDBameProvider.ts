import { MediaMagicSettings } from "../settings";
import {
    MediaProvider,
    MediaSearchResult,
    Media,
    Status
} from "../types";

import { requestUrl } from "obsidian";
import { IGDBClient } from "../classes/IGDBClient";

interface IGDBGame {
    id: number;
    name: string;

    first_release_date?: number;

    genres?: {
        name: string;
    }[];

    involved_companies?: {
        company: {
            name: string;
        };
        developer: boolean;
        publisher: boolean;
    }[];

    cover?: {
        image_id: string;
    };
}

interface IGDBGameSearchResult {
    id: number;
    name: string;

    cover?: {
        image_id: string;
    };
}

export class IGDBGameProvider implements MediaProvider {
    readonly id = "igdb-game";
    readonly name = "IGDB (Game)";
    readonly type = "game" as const;

    private readonly client: IGDBClient;
    private readonly clientId: string;

    constructor(settings: MediaMagicSettings) {
        this.clientId = settings.igdbClientId;

        this.client = new IGDBClient(
            settings.igdbClientId,
            settings.igdbClientSecret
        );
    }

    async search(
        query: string,
        settings: MediaMagicSettings
    ): Promise<MediaSearchResult[]> {
        const auth = await this.client.authenticate();

        const res = await requestUrl({
            url: "https://api.igdb.com/v4/games",
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${auth.access_token}`,
                "Content-Type": "text/plain"
            },
            body: `
                search "${this.escapeQuery(query)}";
                fields id, name, cover.image_id;
                where
                    game_type = 0
                    ${settings.showAdult ? "" : "& themes != (42)"};
                limit 10;
            `
        });

        const data = res.json as IGDBGameSearchResult[];

        return data.map(item => ({
            id: item.id,
            title: item.name,
            cover: this.buildCoverUrl(item.cover?.image_id),
            type: "game"
        }));
    }

    async getMedia(result: MediaSearchResult): Promise<Media> {
        const auth = await this.client.authenticate();

        const res = await requestUrl({
            url: "https://api.igdb.com/v4/games",
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${auth.access_token}`,
                "Content-Type": "text/plain"
            },
            body: `
                where id = ${result.id};
                fields
                    id,
                    name,
                    first_release_date,
                    genres.name,
                    involved_companies.company.name,
                    involved_companies.developer,
                    involved_companies.publisher,
                    cover.image_id;
            `
        });

        const item = (res.json as IGDBGame[])[0];

        if (!item) {
            throw new Error("IGDB: game not found");
        }

        return {
            title: item.name,

            type: "game",

            creators: this.getDevelopers(item),

            genres: item.genres?.map(genre => genre.name) ?? [],

            releaseYear: this.getReleaseYear(item.first_release_date),

            cover: this.buildCoverUrl(item.cover?.image_id),

            status: Status.Planned,
            rating: undefined
        };
    }

    private getDevelopers(game: IGDBGame): string[] {
        return [
            ...new Set(
                game.involved_companies
                    ?.filter(company => company.developer)
                    .map(company => company.company.name) ?? []
            )
        ];
    }

    private getReleaseYear(timestamp?: number): number | undefined {
        if (!timestamp) {
            return undefined;
        }

        return new Date(timestamp * 1000).getUTCFullYear();
    }

    private buildCoverUrl(imageId?: string): string | undefined {
        if (!imageId) {
            return undefined;
        }

        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
    }

    private escapeQuery(query: string): string {
        return query.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    }
}