import { App, PluginSettingTab, Setting } from 'obsidian';
import MediaMagicPlugin from './main';
import { MEDIA_VIEW_TYPE, MediaView } from './components/MediaView';

export enum RatingDisplay {
	Numeric = "numeric",
	Emoji = "emoji",
	Stars = "stars",
	Tier = "tier"
}

export enum OnDuplicateAction {
	Ask = "ask",
	Overwrite = "overwrite",
	Ignore = "ignore"
}

export enum CoverMode {
	Download = "download",
	Link = "link",
	Skip = "skip"
}

export enum TitleLanguage {
	Canonical = "canonical",
	English = "english",
	Native = "native"
}

export interface MediaMagicSettings {
	// Query
	showAdult: boolean;

	// Files
	animeFolder: string;
	mangaFolder: string;
	onDuplicate: OnDuplicateAction;

	// Display
	ratingDisplay: RatingDisplay;
	titleLanguage: TitleLanguage;

	// Covers
	coverMode: CoverMode;
	animeCoversFolder: string;
	mangaCoversFolder: string;

	// Misc
	openOnStartup: boolean;
}

export const DEFAULT_SETTINGS: MediaMagicSettings = {
	// Query
	showAdult: false,

	// Files
	animeFolder: "Media/Anime",
	mangaFolder: "Media/Manga",
	onDuplicate: OnDuplicateAction.Ask,

	// Display
	ratingDisplay: RatingDisplay.Stars,
	titleLanguage: TitleLanguage.Canonical,

	// Covers
	coverMode: CoverMode.Link,
	animeCoversFolder: "Media/Covers/Anime",
	mangaCoversFolder: "Media/Covers/Manga",

	// Misc
	openOnStartup: false,
};

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
			text: "Query"
		});

		new Setting(containerEl)
			.setName("Show Adult Content")
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.showAdult)
					.onChange(async value => {
						this.plugin.settings.showAdult = value;
						await this.plugin.saveSettings();
					})
			});

		// -------------------------------------------- Files
		containerEl.createEl("h2", {
			text: "Files"
		});

		new Setting(containerEl)
			.setName("Anime Folder")
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
			.setName("Manga Folder")
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
			.setName("On Duplicate")
			.addDropdown(dropdown =>
				dropdown
					.addOption(
						OnDuplicateAction.Ask,
						"Ask"
					)
					.addOption(
						OnDuplicateAction.Overwrite,
						"Overwrite"
					)
					.addOption(
						OnDuplicateAction.Ignore,
						"Ignore"
					)
					.setValue(this.plugin.settings.onDuplicate)
					.onChange(async value => {
						this.plugin.settings.onDuplicate = value as OnDuplicateAction;
						await this.plugin.saveSettings();
					})
			);

		// -------------------------------------------- Display
		containerEl.createEl("h2", {
			text: "Display"
		});

		new Setting(containerEl)
			.setName("Rating Display")
			.addDropdown(dropdown =>
				dropdown
					.addOption(
						RatingDisplay.Stars,
						"Stars"
					)
					.addOption(
						RatingDisplay.Emoji,
						"Emoji"
					)
					.addOption(
						RatingDisplay.Numeric,
						"Numeric"
					)
					.addOption(
						RatingDisplay.Tier,
						"Tier"
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
			.setName("Title Language")
			.addDropdown(dropdown =>
				dropdown
					.addOption(
						TitleLanguage.Canonical,
						"Canonical"
					)
					.addOption(
						TitleLanguage.English,
						"English"
					)
					.addOption(
						TitleLanguage.Native,
						"Native"
					)
					.setValue(this.plugin.settings.titleLanguage)
					.onChange(async value => {
						this.plugin.settings.titleLanguage = value as TitleLanguage;
						await this.plugin.saveSettings();

						const view = this.app.workspace.getLeavesOfType(MEDIA_VIEW_TYPE)[0]?.view as MediaView;
						view?.onSettingsChange();
					})
			);

		// -------------------------------------------- Covers
		containerEl.createEl("h2", {
			text: "Covers"
		});

		new Setting(containerEl)
			.setName("Cover Mode")
			.addDropdown(dropdown =>
				dropdown
					.addOption(
						CoverMode.Download,
						"Download covers"
					)
					.addOption(
						CoverMode.Link,
						"Use URLs"
					)
					.addOption(
						CoverMode.Skip,
						"Don't use covers"
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
				.setName("Anime Covers Folder")
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
				.setName("Manga Covers Folder")
				.addText(text =>
					text
						.setPlaceholder("Media/Covers/Manga")
						.setValue(this.plugin.settings.mangaCoversFolder)
						.onChange(async value => {
							this.plugin.settings.mangaCoversFolder = value;
							await this.plugin.saveSettings();
						})
				);
		}

		// -------------------------------------------- Misc
		containerEl.createEl("h2", {
			text: "Misc"
		});

		new Setting(containerEl)
			.setName("Open on Startup")
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