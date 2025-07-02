# YouTube Ad Skipper

A Chrome extension that automatically skips advertisements on YouTube videos by fast-forwarding them to completion, providing an uninterrupted viewing experience while respecting YouTube's ad delivery requirements.

## Overview

This extension serves as an alternative to traditional ad blockers by allowing ads to load and play briefly before automatically advancing them to completion. This approach helps bypass YouTube's anti-adblock detection systems while still minimizing viewing interruptions.

## Features

- **Automatic Ad Detection**: Monitors DOM changes to identify when ads begin playing
- **Smart Skip Logic**: Attempts to click skip buttons when available, falls back to fast-forwarding
- **Consecutive Ad Handling**: Detects and processes multiple ads in sequence
- **Non-Intrusive**: Works silently in the background without affecting normal video playback
- **Performance Optimized**: Uses efficient mutation observers and targeted polling

## How It Works

1. **Detection**: The extension monitors YouTube's DOM for ad overlay elements and skip buttons
2. **Skip Attempt**: When an ad is detected, it first tries to click available skip buttons
3. **Fast-Forward Fallback**: If no skip button is available after 2 seconds, it fast-forwards the video to near completion
4. **Cleanup**: Automatically stops processing when the ad ends and resets for the next potential ad

## Installation

### Manual Installation (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/Youtube-AdSkipper.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the project directory

5. The extension should now appear in your extensions list and be active on YouTube

### Usage

Once installed, the extension works automatically on any YouTube page. No configuration is required.

- **Active Status**: Check the extension popup to see if it's active on the current YouTube page
- **Console Logs**: Open browser developer tools to view detailed operation logs

## Project Structure

```
Youtube-AdSkipper/
├── README.md
├── manifest.json              # Extension configuration
└── popup/
    ├── popup.html            # Extension popup interface
    ├── popup.css             # Popup styling
    ├── popup.js              # Popup functionality
    ├── content.js            # Main ad detection and skipping logic
    └── background.js         # Background script for tab management
```

## Technical Details

### Core Components

- **Content Script** (`content.js`): Handles ad detection, skip button clicking, and video manipulation
- **Background Script** (`background.js`): Manages tab updates and cross-tab communication
- **Popup Interface** (`popup.html/js/css`): Provides user interface and status display

### Detection Methods

- **Mutation Observer**: Monitors DOM changes for ad-related elements
- **Polling Mechanism**: Backup detection system for edge cases
- **Element Selectors**: Comprehensive list of skip button selectors for different YouTube layouts

### Permissions

- `tabs`: Monitor tab updates for YouTube navigation
- `host_permissions`: Access to YouTube domains for content script injection

## Browser Compatibility

- **Chrome**: Fully supported (Manifest V3)
- **Chromium-based browsers**: Compatible (Edge, Brave, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## Disclaimer

This extension is for educational purposes and personal use. Users should be aware of YouTube's Terms of Service and use this tool responsibly. The extension does not block ads entirely but rather accelerates their completion.

**Note**: This extension requires YouTube to be loaded in the browser tab to function. It does not work with embedded YouTube videos on other websites.