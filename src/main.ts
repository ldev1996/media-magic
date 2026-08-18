import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MediaMagicSettings, MediaMagicSettingTab } from "./settings";
import { ImportMediaModal } from "./components/ImportMediaModal";
import { ProviderRegistry } from "./types";
import { MyAnimeListAnimeProvider } from "./providers/MyAnimeListAnimeProvider";
import { MediaImporter } from "./classes/MediaImporter";
import { AniListAnimeProvider } from "./providers/AniListAnimeProvider";
import { MEDIA_VIEW_TYPE, MediaView } from "./components/MediaView";
import { AniListMangaProvider } from "./providers/AniListMangaProvider";

export default class MediaMagicPlugin extends Plugin {
	settings!: MediaMagicSettings;
	importer!: MediaImporter;
	providerRegistry!: ProviderRegistry;

	async onload() {
		await this.loadSettings();

		this.importer = new MediaImporter(this.app, this.settings);
		this.providerRegistry = new ProviderRegistry();
		this.providerRegistry.register(new AniListAnimeProvider);
		this.providerRegistry.register(new MyAnimeListAnimeProvider);
		this.providerRegistry.register(new AniListMangaProvider);

		// -------------------------------------------- Settings
		this.addSettingTab(
			new MediaMagicSettingTab(
				this.app,
				this
			)
		);

		// -------------------------------------------- Views
		this.registerView(
			MEDIA_VIEW_TYPE,
			(leaf) => new MediaView(leaf, this.settings, this.providerRegistry, this.app)
		);

		// -------------------------------------------- Commands
		this.addCommand({
			id: "open-media-view",
			name: "Open Media View",
			callback: () => {
				this.activateView();
			}
		});

		this.addCommand({
			id: "add-media",
			name: "Add Media",
			callback: () => {
				this.addMedia();
			}
		});

		// -------------------------------------------- Ribbons
		this.addRibbonIcon(
			"library",
			"Open Media Magic View",
			() => {
				this.activateView()
			}
		)

		this.addRibbonIcon(
			"circle-plus",
			"Add Media Magic",
			() => {
				this.addMedia();
			}
		)

		// -------------------------------------------- Startup
		if (this.settings.openOnStartup) {
			this.app.workspace.onLayoutReady(() => {
				this.activateView();
			});
		}
	}

	async loadSettings() {
		const data = await this.loadData();

		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			isValidSettings(data) ? data : {}
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		const [firstLeaf] = this.app.workspace.getLeavesOfType(MEDIA_VIEW_TYPE);

		if (firstLeaf) {
			this.app.workspace.revealLeaf(firstLeaf);
			return;
		}

		const leaf = this.app.workspace.getLeaf("tab");

		await leaf.setViewState({
			type: MEDIA_VIEW_TYPE,
			active: true
		});

		this.app.workspace.setActiveLeaf(leaf, { focus: true });
	}

	addMedia() {
		new ImportMediaModal(
			this.app,
			this.providerRegistry,
			this.settings,

			async media => {
				console.log(media);

				const importer = new MediaImporter(this.app, this.settings);
				await importer.import(media);
			}
		).open();
	}
}

function isValidSettings(data: any): data is Partial<MediaMagicSettings> {
	return data && typeof data === "object";
}