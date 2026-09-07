import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import { MEDIA_VIEW_TYPE, MediaView } from '../components/MediaView';
import MediaMagicPlugin from '../main';
import { MediaType } from '../types';
import { CoverMode, OnDuplicateAction, RatingDisplay, TitleLanguage } from './enums';
import { t } from '../i18n/i18n';
import { IGDBClient } from '../classes/IGDBClient';

export class MediaMagicSettingTab extends PluginSettingTab {
    plugin: MediaMagicPlugin;

    constructor(app: App, plugin: MediaMagicPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        // -------------------------------------------- Query
        containerEl.createEl("h2", {
            text: t("settings.query")
        });

        new Setting(containerEl)
            .setName(t("settings.showAdultContent"))
            .addToggle(toggle => {
                toggle
                    .setValue(this.plugin.settings.showAdult)
                    .onChange(async value => {
                        this.plugin.settings.showAdult = value;
                        await this.plugin.saveSettings();
                    })
            });

        new Setting(containerEl)
            .setName(t("settings.igdbClientId"))
            .addText(text =>
                text
                    .setPlaceholder(t("settings.igdbClientId"))
                    .setValue(this.plugin.settings.igdbClientId)
                    .onChange(async value => {
                        this.plugin.settings.igdbClientId = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.igdbClientSecret"))
            .addText(text =>
                text
                    .setPlaceholder(t("settings.igdbClientSecret"))
                    .setValue(this.plugin.settings.igdbClientSecret)
                    .onChange(async value => {
                        this.plugin.settings.igdbClientSecret = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.testConnection"))
            .setDesc(t("settingsDesc.testConnection"))
            .addButton(button =>
                button
                    .setButtonText(t("settings.testConnection"))
                    .onClick(async () => {
                        button.setDisabled(true);
                        button.setButtonText(t("igdb.testingConnection"));

                        try {
                            const client = new IGDBClient(
                                this.plugin.settings.igdbClientId,
                                this.plugin.settings.igdbClientSecret
                            );

                            await client.authenticate();

                            new Notice(t("igdb.connectionSuccessful"));
                        } catch (error) {
                            console.error("IGDB connection failed:", error);

                            new Notice(t("igdb.connectionFailed"));
                        } finally {
                            button.setDisabled(false);
                            button.setButtonText(t("settings.testConnection"));
                        }
                    })
            );

        // -------------------------------------------- Files
        containerEl.createEl("h2", {
            text: t("settings.files")
        });

        new Setting(containerEl)
            .setName(t("settings.animeFolder"))
            .addText(text =>
                text
                    .setPlaceholder("Media/Anime")
                    .setValue(this.plugin.settings.animeFolder)
                    .onChange(async value => {
                        this.plugin.settings.animeFolder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.mangaFolder"))
            .addText(text =>
                text
                    .setPlaceholder("Media/Manga")
                    .setValue(this.plugin.settings.mangaFolder)
                    .onChange(async value => {
                        this.plugin.settings.mangaFolder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.gamesFolder"))
            .addText(text =>
                text
                    .setPlaceholder("Media/Games")
                    .setValue(this.plugin.settings.gamesFolder)
                    .onChange(async value => {
                        this.plugin.settings.gamesFolder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.onDuplicate"))
            .addDropdown(dropdown =>
                dropdown
                    .addOption(
                        OnDuplicateAction.Ask,
                        t("onDuplicate.ask")
                    )
                    .addOption(
                        OnDuplicateAction.Overwrite,
                        t("onDuplicate.overwrite")
                    )
                    .addOption(
                        OnDuplicateAction.Ignore,
                        t("onDuplicate.ignore")
                    )
                    .setValue(this.plugin.settings.onDuplicate)
                    .onChange(async value => {
                        this.plugin.settings.onDuplicate = value as OnDuplicateAction;
                        await this.plugin.saveSettings();
                    })
            );

        // -------------------------------------------- Display
        containerEl.createEl("h2", {
            text: t("settings.display")
        });

        new Setting(containerEl)
            .setName(t("settings.ratingDisplay"))
            .addDropdown(dropdown =>
                dropdown
                    .addOption(
                        RatingDisplay.Emoji,
                        t("RatingDisplay.emoji")
                    )
                    .addOption(
                        RatingDisplay.Word,
                        t("RatingDisplay.word")
                    )
                    .addOption(
                        RatingDisplay.EmojiWord,
                        t("RatingDisplay.emojiWord")
                    )
                    .addOption(
                        RatingDisplay.Number,
                        t("RatingDisplay.number")
                    )
                    .setValue(this.plugin.settings.ratingDisplay)
                    .onChange(async value => {
                        this.plugin.settings.ratingDisplay = value as RatingDisplay;
                        await this.plugin.saveSettings();

                        const view = this.app.workspace.getLeavesOfType(MEDIA_VIEW_TYPE)[0]?.view as MediaView;
                        view?.onSettingsChange();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.titleLanguage"))
            .addDropdown(dropdown =>
                dropdown
                    .addOption(
                        TitleLanguage.Canonical,
                        t("titleLanguage.canonical")
                    )
                    .addOption(
                        TitleLanguage.English,
                        t("titleLanguage.english")
                    )
                    .addOption(
                        TitleLanguage.Native,
                        t("titleLanguage.native")
                    )
                    .setValue(this.plugin.settings.titleLanguage)
                    .onChange(async value => {
                        this.plugin.settings.titleLanguage = value as TitleLanguage;
                        await this.plugin.saveSettings();

                        const view = this.app.workspace.getLeavesOfType(MEDIA_VIEW_TYPE)[0]?.view as MediaView;
                        view?.onSettingsChange();
                    })
            );

        new Setting(containerEl)
            .setName(t("settings.defaultMediaType"))
            .setDesc("Select which media type is selected when opening the Media Magic View.")
            .addDropdown(dropdown => {
                dropdown
                    .addOption("anime", t("media.anime"))
                    .addOption("manga", t("media.manga"))
                    .addOption("game", t("media.game"))
                    .setValue(this.plugin.settings.defaultMediaType)
                    .onChange(async value => {
                        this.plugin.settings.defaultMediaType = value as MediaType;
                        await this.plugin.saveSettings();
                    });
            });

        // -------------------------------------------- Covers
        containerEl.createEl("h2", {
            text: t("settings.covers")
        });

        new Setting(containerEl)
            .setName(t("settings.coverMode"))
            .addDropdown(dropdown =>
                dropdown
                    .addOption(
                        CoverMode.Download,
                        t("coverMode.download")
                    )
                    .addOption(
                        CoverMode.Link,
                        t("coverMode.link")
                    )
                    .addOption(
                        CoverMode.Skip,
                        t("coverMode.skip")
                    )
                    .setValue(this.plugin.settings.coverMode)
                    .onChange(async value => {
                        this.plugin.settings.coverMode = value as CoverMode;
                        await this.plugin.saveSettings();
                        this.display();
                    })
            );

        if (this.plugin.settings.coverMode === CoverMode.Download) {

            new Setting(containerEl)
                .setName(t("settings.animeCoversFolder"))
                .addText(text =>
                    text
                        .setPlaceholder("Media/Covers/Anime")
                        .setValue(this.plugin.settings.animeCoversFolder)
                        .onChange(async value => {
                            this.plugin.settings.animeCoversFolder = value;
                            await this.plugin.saveSettings();
                        })
                );

            new Setting(containerEl)
                .setName(t("settings.mangaCoversFolder"))
                .addText(text =>
                    text
                        .setPlaceholder("Media/Covers/Manga")
                        .setValue(this.plugin.settings.mangaCoversFolder)
                        .onChange(async value => {
                            this.plugin.settings.mangaCoversFolder = value;
                            await this.plugin.saveSettings();
                        })
                );

            new Setting(containerEl)
                .setName(t("settings.gamesCoversFolder"))
                .addText(text =>
                    text
                        .setPlaceholder("Media/Covers/Games")
                        .setValue(this.plugin.settings.gamesCoversFolder)
                        .onChange(async value => {
                            this.plugin.settings.gamesCoversFolder = value;
                            await this.plugin.saveSettings();
                        })
                );
        }

        // -------------------------------------------- Misc
        containerEl.createEl("h2", {
            text: t("settings.misc")
        });

        new Setting(containerEl)
            .setName(t("settings.openOnStartup"))
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.openOnStartup)
                    .onChange(async value => {
                        this.plugin.settings.openOnStartup = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}