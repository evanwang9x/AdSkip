# YouTube Ad Skipper

This project is a Chrome extension designed to automatically skip ads on YouTube videos. It listens for ad events and triggers the skip action when an ad is detected, enhancing the viewing experience by minimizing interruptions.

## Project Structure

```
youtube-ad-skipper
├── src
│   ├── content.js          # Script that runs in the context of the YouTube page
│   ├── background.js       # Manages background tasks for the extension
│   └── popup
│       ├── popup.html      # HTML structure for the extension's popup interface
│       ├── popup.js        # JavaScript logic for the popup interface
│       └── popup.css       # Styles for the popup interface
├── manifest.json           # Configuration file for the Chrome extension
├── icons
│   ├── icon16.png          # 16x16 pixel icon for the extension
│   ├── icon48.png          # 48x48 pixel icon for the extension
│   └── icon128.png         # 128x128 pixel icon for the extension
└── README.md               # Documentation for the project
```

## Installation

1. Clone the repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the `youtube-ad-skipper` directory.
5. The extension should now be loaded and ready to use.

## Usage

Once the extension is installed, it will automatically detect ads on YouTube and skip them as soon as they appear. You can access the popup interface by clicking on the extension icon in the Chrome toolbar, where you can view settings and information about the extension.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or new features.