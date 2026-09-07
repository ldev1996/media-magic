import { requestUrl } from "obsidian";
import { t } from "../i18n/i18n";

export interface IGDBAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export class IGDBClient {
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    async authenticate(): Promise<IGDBAuthResponse> {
        if (!this.clientId || !this.clientSecret) {
            throw new Error(t("error.igdbClientRequired"));
        }

        const response = await requestUrl({
            url: "https://id.twitch.tv/oauth2/token",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
            }).toString(),
        });

        if (response.status < 200 || response.status >= 300) {
            throw new Error(
                t("error.igdbAuthError", { status: `${response.status}` })
            );
        }

        return response.json as IGDBAuthResponse;
    }
}