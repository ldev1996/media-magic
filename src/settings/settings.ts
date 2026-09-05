import { MediaType } from '../types';
import { RatingDisplay, OnDuplicateAction, CoverMode, TitleLanguage } from './enums';

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
	defaultMediaType: MediaType;

	// Covers
	coverMode: CoverMode;
	animeCoversFolder: string;
	mangaCoversFolder: string;

	// Misc
	openOnStartup: boolean;
}
