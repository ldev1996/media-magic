import { getLanguage } from "obsidian";
import en from "./en";
import ptBR from "./pt-BR";

const locales = {
    en,
    "pt-BR": ptBR,
} as const;

type Locale = keyof typeof locales;

type FlattenKeys<T, Prefix extends string = ""> = {
    [K in keyof T & string]:
    T[K] extends Record<string, unknown>
    ? FlattenKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`
}[keyof T & string];

export type TranslationKey = FlattenKeys<typeof en>;

let currentLocale: Locale = "en";

export function initI18n(): void {
    const language = getLanguage();

    currentLocale = language in locales
        ? language as Locale
        : "en";
}

export function t(
    path: TranslationKey,
    variables?: Record<string, string>
): string {
    let value = getValue(locales[currentLocale], path)
        ?? getValue(en, path)
        ?? path;

    if (variables) {
        for (const [key, replacement] of Object.entries(variables)) {
            value = value.replaceAll(`{${key}}`, replacement);
        }
    }

    return value;
}

function getValue(
    dictionary: Record<string, unknown>,
    path: string
): string | undefined {
    const value = path
        .split(".")
        .reduce<unknown>((current, key) => {
            if (
                typeof current !== "object" ||
                current === null
            ) {
                return undefined;
            }

            return (current as Record<string, unknown>)[key];
        }, dictionary);

    return typeof value === "string" ? value : undefined;
}