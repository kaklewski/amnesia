<p align="center">
  <img src="./icons/icon-with-bg.svg" alt="Amnesia Logo" width="128"/>
</p>

# Amnesia - History Cleaner for Mozilla Firefox

A lightweight **Firefox extension** that removes browsing history older than a specified number of days.

Ideal for users who value **privacy** and keeping their **browser clean**.

## ✨ Features

- Clears browsing history older than a specified number of days.
- Offers an option to automatically clear browsing history on browser startup.
- Operates fully offline — no data is collected or transmitted.
- Adapts automatically to the system dark/light color scheme.
- Provides a clean, minimal, and lightweight UI.

## 📦 Installation

Amnesia is available on the official Mozilla Add-ons store:  
[**Get it on Firefox Add-ons**](https://addons.mozilla.org/addon/amnesia-cleaner/)

## 🌐 Translations

The extension currently supports **English 🇬🇧** and **Polish 🇵🇱**.  
Contributions for additional languages are welcome!

To add a translation:

1. Fork this repository.
2. Copy the file `_locales/en/messages.json` into a new folder named after your target locale code (for example: `_locales/de/messages.json` for German, `_locales/it/messages.json` for Italian).
3. Translate the values of the `"message"` and `"description"` fields for each entry.
4. Submit a pull request.

For reference, see [MDN – Internationalization in extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization).

## 💻 Development

### Setup (for contributors)

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Install [web-ext](https://github.com/mozilla/web-ext) globally:

   ```bash
   npm install --global web-ext
   ```

3. Clone and open the repository:
   ```bash
   git clone https://github.com/kaklewski/amnesia
   cd amnesia
   ```
4. Run the extension in Firefox using `web-ext`:

   ```bash
   web-ext run
   ```

   On Linux, if you use the [Flatpak](https://flatpak.org/) version of Firefox, run:

   ```bash
   web-ext run --firefox=flatpak:org.mozilla.firefox
   ```

### Linting

Before building the extension, check for common issues:

```bash
web-ext lint
```

### Building

To create a distributable package:

```bash
web-ext build
```

This will generate a `.zip` file in the `web-ext-artifacts` folder.

## 🎨 Credits

- **Main icon** – [History Toggle](https://tabler.io/icons/icon/history-toggle) from [Tabler Icons](https://tabler.io/icons) (MIT License).
- **Clearing overlay** – [Reload](https://tabler.io/icons/icon/reload) from [Tabler Icons](https://tabler.io/icons) (MIT License).
