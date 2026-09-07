# Media Magic

Media Magic is an Obsidian plugin for importing, organizing, and tracking anime, manga, and games from multiple APIs.

It provides a dedicated media interface where you can manage your library, track your progress, rate titles, and customize how your media is displayed.

## Features

* Import anime, manga, and games from supported APIs.
* Manage your media in a dedicated interface inside Obsidian.
* Track your progress with media-specific statuses.
* Rate media from 1 to 10.
* Assign custom aliases to media.
* Choose which title should be displayed:
  * Native title
  * Canonical title
  * English title
* Choose how ratings are displayed:
  * Word
  * Emoji
  * Emoji + Word
  * Number
* Toggle +18 content visibility.
* Filter your library by media type, status, rating, and title.
* Keep your media collection and tracking inside your Obsidian vault.

## Supported Media

Media Magic currently supports:

* Anime
* Manga
* Games

Supported providers include:

* AniList
* MyAnimeList
* IGDB

Media can be imported through the APIs supported by the plugin, allowing you to build your collection without manually entering every title.

## Media Tracking

Each title can have a progress status that reflects where you are in your consumption.

### Anime

| Status | Description |
| --- | --- |
| Planned | You intend to watch it. |
| Watching | You are currently watching it. |
| Completed | You have finished it. |
| Waiting | You cannot continue because you are waiting for new content or another external dependency. |
| On Hold | You stopped watching it temporarily and intend to resume. |
| Dropped | You started it but decided not to continue. |

### Manga

| Status | Description |
| --- | --- |
| Planned | You intend to read it. |
| Reading | You are currently reading it. |
| Completed | You have finished it. |
| Waiting | You cannot continue because you are waiting for new content or another external dependency. |
| On Hold | You stopped reading it temporarily and intend to resume. |
| Dropped | You started it but decided not to continue. |

### Games

| Status | Description |
| --- | --- |
| Planned | You intend to play it. |
| Playing | You are currently playing it. |
| Completed | You have finished it. |
| Completed 100% | You have completed the game at 100%. |
| Waiting | You cannot continue because you are waiting for new content or another external dependency. |
| On Hold | You stopped playing it temporarily and intend to resume. |
| Dropped | You started it but decided not to continue. |

> **Note:** For convenience, it is recommended not to use `Waiting` simply because a title is releasing new content on a weekly basis. Use `Waiting` when you are waiting for something that prevents you from continuing, such as a new season, the end of a hiatus, or a future update.

## Ratings

Media Magic uses a 1–10 rating scale:

| Rating | Emoji | Label |
| ---: | :---: | --- |
| 1 | 💀 | Terrible |
| 2 | 😓 | Bad |
| 3 | 🙁 | Weak |
| 4 | 😐 | Meh |
| 5 | 😶 | Okay |
| 6 | 🙂 | Decent |
| 7 | 😀 | Good |
| 8 | 😎 | Great |
| 9 | 😍 | Awesome |
| 10 | 🏆 | Masterpiece |

Ratings can be displayed in different formats depending on your preference:

* **Word**
* **Emoji**
* **Emoji + Word**
* **Number**

The rating value remains the same regardless of the selected display format.

## Custom Aliases

Media Magic allows you to assign your own aliases to titles.

This is useful when you prefer a shorter name, an alternate translation, or simply want to identify a title using a name that makes more sense to you.

## Title Display

Different databases can provide multiple names for the same title. Media Magic lets you choose which type of title should be displayed throughout the plugin:

* **Native** — the title in its original language.
* **Canonical** — the canonical title provided by the media database.
* **English** — the English title.

You can change this preference without changing the underlying media data.

## +18 Content

Media Magic includes a setting to control whether +18 content is shown when importing media.

You can enable or disable this content according to your preferences.

## Installation

You can install Media Magic manually by downloading the latest release and placing the plugin files in your vault's plugin directory: `.obsidian/plugins/media-magic/`

Make sure the required plugin files are present before enabling it in Obsidian.

## Configuration

Media Magic's settings allow you to customize how your library is displayed and handled.

Available options include:

| Setting | Description |
| --- | --- |
| +18 Content | Toggle the visibility of +18 media when importing. |
| Title Display | Choose between native, canonical, and English titles. |
| Rating Format | Choose word, emoji, emoji + word, or number-based ratings. |
| Anime Folder | Folder used for anime media. |
| Manga Folder | Folder used for manga media. |
| Game Folder | Folder used for game media. |
| Default Media Type | Choose the default media type used by the interface. |
| Open on Startup | Open the Media Magic interface when Obsidian starts. |

### IGDB

Game imports use IGDB.

You need to provide your own IGDB/Twitch application credentials in the plugin settings:

* IGDB Client ID
* IGDB Client Secret

The plugin includes a connection test to verify the configured credentials.

## Development

Media Magic is currently an early-stage project and was initially developed using a vibe-coding workflow.

Development is occasional and happens without a fixed schedule or public roadmap, so changes to the architecture, APIs, UI, and available features may occur at any time without prior notice.

## Current Limitations

* API availability depends on the services supported by the plugin.
* Some metadata depends on what is provided by the corresponding API.
* The project is still under development, so some features may change or behave differently between versions.

## Roadmap

Planned improvements may include:

* Additional API integrations.
* More customization options.
* Improved media discovery and filtering.
* Further improvements to the media interface.
* Additional tracking and library-management features.

## Contributing

Contributions, bug reports, feature requests, and feedback are welcome.

If you find a problem or have an idea for improving Media Magic, open an issue or submit a pull request.

## License

This project is licensed under the MIT License.