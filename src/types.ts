import { MediaMagicSettings } from "./settings";

export enum Status {
    Planned = "planned",
    Reading = "reading",
    Watching = "watching",
    Waiting = "waiting",
    Dropped = "dropped",
    Completed = "completed"
}

export type MediaType = "anime" | "manga"

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Media {
    path?: string;

    title: string;
    englishTitle?: string;
    nativeTitle?: string;
    nickname?: string;

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