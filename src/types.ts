import { MediaMagicSettings } from "./settings";

export enum Status {
    Watching = "watching",
    Reading = "reading",
    Playing = "playing",
    Planned = "planned",
    OnHold = "on_hold",
    Waiting = "waiting",
    Dropped = "dropped",
    Completed = "completed",
    Completed100 = "completed_100",
}

export type MediaType = "anime" | "manga" | "game"

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Media {
    path?: string;

    title: string;
    englishTitle?: string;
    nativeTitle?: string;
    alias?: string;

    type: MediaType;
    creators: string[];
    releaseYear?: number;
    genres: string[];

    cover?: string; // path or URL

    status: Status;
    rating?: RatingValue;
}

export interface MediaSearchResult {
    id: number;
    title: string;
    englishTitle?: string;
    nativeTitle?: string;
    cover?: string;
    type: MediaType;
}

export interface MediaProvider {
    readonly id: string;
    readonly name: string;
    readonly type: MediaType;
    search(query: string, settings: MediaMagicSettings): Promise<MediaSearchResult[]>;
    getMedia(result: MediaSearchResult): Promise<Media>;
}

export class ProviderRegistry {
    private providers: MediaProvider[] = [];

    register(provider: MediaProvider) {
        this.providers.push(provider);
    }

    getAll() {
        return this.providers;
    }
}