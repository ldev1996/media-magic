import { MediaType } from '../types';
import { RatingDisplay, OnDuplicateAction, CoverMode, TitleLanguage } from './enums';

export interface MediaMagicSettings {
	// Query
	showAdult: boolean;
	igdbClientId: string;
	igdbClientSecret: string;

	// Files
	animeFolder: string;
	mangaFolder: string;
	gamesFolder: string;
	onDuplicate: OnDuplicateAction;

	// Display
	ratingDisplay: RatingDisplay;
	titleLanguage: TitleLanguage;
	defaultMediaType: MediaType;

	// Covers
	coverMode: CoverMode;
	animeCoversFolder: string;
	mangaCoversFolder: string;
	gamesCoversFolder: string;

	// Misc
	openOnStartup: boolean;
}
