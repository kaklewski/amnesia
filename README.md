<p align="center">
  <img src="./icons/icon-with-bg.svg" alt="Amnesia Logo" width="128"/>
</p>

<h1 align="center">Amnesia - History Cleaner for Mozilla Firefox</h1>

A lightweight **Firefox extension** that automatically removes browsing history older than a specified number of days.

Ideal for users who value **privacy** and keeping their **browser clean**.

## ✨ Features

- ✅ Deletes browsing history older than a specified number of days.
- ✅ Option to automatically clear history upon browser launch.
- ✅ Clean and minimal popup for quick setup.
- ✅ Works fully offline – no data is collected or sent anywhere.

## 💻 Development

### 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaklewski/amnesia
   cd amnesia
   ```
2. Run the extension in Firefox using [web-ext](https://github.com/mozilla/web-ext):

   ```bash
   web-ext run
   ```

   On Linux, if you use the [Flatpak](https://flatpak.org/) version of Firefox, run:

   ```bash
   web-ext run --firefox=flatpak:org.mozilla.firefox
   ```

### 🔍 Linting

Before building the extension, check for common issues:

```bash
web-ext lint
```

### 🏗️ Building

To create a distributable package:

```bash
web-ext build
```

This will generate a `.zip` file in the `web-ext-artifacts` folder.

## 🎨 Credits

- Icon: [History Toggle](https://tabler.io/icons/icon/history-toggle) from Tabler Icons.
