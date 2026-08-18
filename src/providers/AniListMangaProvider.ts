import { MediaMagicSettings } from "../settings";
import {
    MediaProvider,
    MediaSearchResult,
    Media,
    Status
} from "../types";
import { requestUrl } from "obsidian";

export class AniListMangaProvider implements MediaProvider {
    readonly id = "anilist-manga";
    readonly name = "AniList (Manga)";
    readonly type = "manga" as const;

    async search(query: string, settings: MediaMagicSettings): Promise<MediaSearchResult[]> {
        const adultFilter = settings.showAdult ? "" : ", isAdult: false";

        const graphqlQuery = `
            query ($search: String) {
                Page(perPage: 10) {
                    media(search: $search, type: MANGA${adultFilter}) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            medium
                        }
                    }
                }
            }`;

        const res = await requestUrl({
            url: "https://graphql.anilist.co",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables: {
                    search: query
                }
            })
        });

        const data = res.json.data.Page.media;

        return data.map((item: any) => ({
            id: item.id,
            title: item.title.romaji,
            englishTitle: item.title.english,
            nativeTitle: item.title.native,
            cover: item.coverImage?.medium,
            type: "manga"
        }));
    }

    async getMedia(result: MediaSearchResult): Promise<Media> {
        const graphqlQuery = `
            query ($id: Int) {
                Media(id: $id, type: MANGA) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    staff {
                        nodes {
                            name {
                                full
                            }
                        }
                    }
                    genres
                    startDate {
                        year
                    }
                    coverImage {
                        large
                    }
                }
            }
        `;

        const res = await requestUrl({
            url: "https://graphql.anilist.co",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables: { id: result.id }
            })
        });

        const item = res.json.data?.Media;

        if (!item) {
            throw new Error("AniList: media not found");
        }

        return {
            title: item.title.romaji,
            englishTitle: item.title.english,
            nativeTitle: item.title.native,
            type: "manga",
            creators: item.staff?.nodes?.map((s: any) => s.name.full) ?? [],
            genres: item.genres ?? [],
            releaseYear: item.startDate?.year,
            cover: item.coverImage?.large,
            status: Status.Planned,
            rating: undefined
        };
    }
}