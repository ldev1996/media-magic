import { MediaMagicSettings } from "../settings";
import {
    MediaProvider,
    MediaSearchResult,
    Media,
    Status
} from "../types";
import { requestUrl } from "obsidian";

export class MyAnimeListAnimeProvider implements MediaProvider {
    readonly id = "mal-anime";
    readonly name = "MyAnimeList (Anime)";
    readonly type = "anime" as const;

    async search(query: string, settings: MediaMagicSettings): Promise<MediaSearchResult[]> {
        const sfwParam = settings.showAdult ? "" : "&sfw=1";
        const res = await requestUrl({
            url: `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10${sfwParam}`
        });

        const data = res.json.data;

        return data.map((item: any) => ({
            title: item.title,
            cover: item.images?.jpg?.image_url,
            type: "anime"
        }));
    }

    async getMedia(result: MediaSearchResult): Promise<Media> {
        // Nota: Jikan já devolve quase tudo no search,
        // mas idealmente você buscaria details endpoint
        // para dados mais ricos.

        const searchRes = await requestUrl({
            url: `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(result.title)}&limit=1`
        });

        const item = searchRes.json.data?.[0];

        return {
            title: item.title,
            englishTitle: item.title_english,
            nativeTitle: item.title_japanese,

            type: "anime",

            creators: [
                ...(item.studios?.map((s: any) => s.name) ?? []),
                ...(item.producers?.map((p: any) => p.name) ?? [])
            ],

            releaseYear: item.year,

            genres: item.genres?.map((g: any) => g.name) ?? [],

            cover: item.images?.jpg?.image_url,

            status: Status.Planned,

            rating: undefined
        };
    }
}
