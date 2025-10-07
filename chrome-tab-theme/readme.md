# Animated Clock Chrome Tab Theme

## Overview

This Chrome extension transforms your new tab page into an **animated digital clock** interface. It enhances productivity by showing **Google products** for quick access and allows users to add or remove **custom shortcut URLs**. The design is sleek, modern, and fully browser-specific, ensuring shortcuts and settings are stored locally.

---

## Features

* **Animated Digital Clock**: Displays live time with smooth animations.
* **Google Products Quick Access**: Direct links to popular Google services like Gmail, Drive, YouTube, and more.
* **Custom Shortcut URLs**: Add your frequently visited websites directly to the new tab page.
* **Shortcut Management**: Remove, edit, or reorder shortcuts anytime.
* **Browser-specific Storage**: All shortcuts and settings are stored locally in the browser.
* **Minimal & Modern Design**: Clean interface with focus on functionality and aesthetics.

---

## Installation

1. Download or clone the repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the extension folder.
5. Open a new tab to see your animated clock and quick access shortcuts.

---

## Usage

1. **View Time**: Open a new tab to see the animated digital clock.
2. **Access Google Products**: Click icons for Gmail, Drive, YouTube, etc., directly from the tab.
3. **Add Custom Shortcuts**: Enter the website name and URL to create a personalized shortcut.
4. **Remove Shortcuts**: Delete unwanted shortcuts easily via the shortcut settings menu.
5. **Persistent Settings**: All shortcuts and preferences remain saved locally for your browser only.

---

## File Structure

```
animated-clock-tab/
│
├─ manifest.json          # Chrome extension configuration
├─ newtab.html            # New tab UI with animated clock
├─ newtab.css             # Styles for clock and shortcuts
├─ newtab.js              # Logic for clock, Google products, and shortcuts
├─ icons/                 # Optional folder for shortcut icons
└─ README.md              # Documentation
```

---

## Notes

* Shortcuts are **browser-specific** and will not sync across devices.
* Only one new tab replacement is allowed per browser.

---

## License

MIT License

