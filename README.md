# Media Magic

Media Magic is an Obsidian plugin for importing, organizing, and tracking anime and manga from multiple APIs.

It provides a dedicated media interface where you can manage your library, track your progress, rate titles, and customize how your media is displayed.

## Features

* Import anime and manga from multiple APIs.
* Manage your media in a dedicated interface inside Obsidian.
* Track your progress with the following statuses:
  * Planned
  * Watching / Reading
  * Completed
  * Waiting
  * Dropped
* Rate media from 1 to 5.
* Assign custom aliases to anime and manga.
* Choose which title should be displayed:
  * Native title
  * Canonical title
  * English title
* Choose how ratings are displayed:
  * Emoji
  * Tier
  * Number
  * Stars
* Toggle +18 content visibility.
* Keep your media collection and tracking inside your Obsidian vault.

## Supported Media

Media Magic supports both:

* Anime
* Manga

Media can be imported through the APIs supported by the plugin, allowing you to build your collection without manually entering every title.

## Media Tracking

Each title can have a progress status that reflects where you are in your consumption:

| Status             | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| Planned            | You intend to watch or read it.                                |
| Watching / Reading | You are currently watching or reading it.                      |
| Completed          | You have finished it.                                          |
| Waiting            | You are waiting for new episodes, chapters, or other releases. |
| Dropped            | You started it but decided not to continue.                    |

You can also give each title a rating from 1 to 5.

## Custom Aliases

Media Magic allows you to assign your own aliases to titles.

This is useful when you prefer a shorter name, an alternate translation, or simply want to identify a title using a name that makes more sense to you.

## Title Display

Different databases can provide multiple names for the same title. Media Magic lets you choose which type of title should be displayed throughout the plugin:

* **Native** — the title in its original language.
* **Canonical** — the canonical title provided by the media database.
* **English** — the English title.

You can change this preference without changing the underlying media data.

## Rating Formats

Ratings can be displayed in different formats depending on your preference:

* **Emoji**
* **Tier**
* **Number**
* **Stars**

The rating itself remains on a 1–5 scale; only its visual representation changes.

## +18 Content

Media Magic includes a setting to control whether +18 content is shown when importing media.

You can enable or disable this content according to your preferences.

## Installation

You can also install Media Magic manually by downloading the latest release and placing the plugin files in your vault's plugin directory:

```text
.obsidian/plugins/media-magic/
```

Make sure the required plugin files are present before enabling it in Obsidian.

## Configuration

Media Magic's settings allow you to customize how your library is displayed and handled.

Available options include:

| Setting       | Description                                           |
| ------------- | ----------------------------------------------------- |
| +18 Content   | Toggle the visibility of +18 media.                   |
| Title Display | Choose between native, canonical, and English titles. |
| Rating Format | Choose emoji, tier, number, or star-based ratings.    |

## Development

Media Magic is currently an early-stage project and was initially developed using a vibe-coding workflow.

Development is occasional and happens without a fixed schedule or public roadmap, so changes to the architecture, APIs, UI, and available features may occur at any time without prior notice.

## Current Limitations

* The user interface is currently available only in English.
* API availability depends on the services supported by the plugin.
* The project is still under development, so some features may change or behave differently between versions.

## Roadmap

Planned improvements may include:

* Additional API integrations.
* More customization options.
* Improved media discovery and filtering.
* Internationalization and additional languages.
* Further improvements to the media interface.
* Additional tracking and library-management features.

## Contributing

Contributions, bug reports, feature requests, and feedback are welcome.

If you find a problem or have an idea for improving Media Magic, open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
