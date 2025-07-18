'use strict';

// Main ad skipper controller
class AdSkipper {
    constructor() {
        this.adProcessed = false;
        this.lastAdTime = 0;
        this.skipAttempted = false;
        this.CHECK_INTERVAL = 200;
    }

    start() {
        console.log("[YT Ad Skipper] Starting ad skipper with fast forward...");
        this.startMainLoop();
    }

    startMainLoop() {
        setInterval(() => {
            this.checkForAds();
            this.checkForBannerAds();
        }, this.CHECK_INTERVAL);
    }

    checkForAds() {
        const video = AdDetection.getVideo();
        if (!video) return;

        const adDetected = AdDetection.isAdPlaying();
        
        if (adDetected) {
            if (!this.adProcessed || Math.abs(video.currentTime - this.lastAdTime) > 10) {
                console.log("[YT Ad Skipper] Ad detected, processing...");
                this.processAd(video);
            }
        } else {
            if (this.adProcessed) {
                console.log("[YT Ad Skipper] Ad ended, resetting...");
                this.reset();
            }
        }
    }

    processAd(video) {
        this.adProcessed = true;

        const targetTime = FastForward.initialFastForward(video);
        this.lastAdTime = targetTime;

        setTimeout(() => {
            if (ClickSkipButton.tryClickSkipButton()) {
                console.log("[YT Ad Skipper] Skip button clicked successfully");
                this.reset();
            } else {
                this.fastForwardToEnd(video);
            }
        }, 500);
    }

    fastForwardToEnd(video) {
        const targetTime = FastForward.fastForwardToEnd(video);
        
        if (targetTime !== false) {
            this.lastAdTime = targetTime;
            this.skipAttempted = true;

            setTimeout(() => {
                if (AdDetection.isAdPlaying()) {
                    console.log("[YT Ad Skipper] Second ad detected");
                    this.adProcessed = false;
                    this.processAd(video);
                } else {
                    this.reset();
                }
            }, FastForward.END_BUFFER_SECONDS * 1000 + 500);
        } else {
            setTimeout(() => this.fastForwardToEnd(video), 1000);
        }
    }

    checkForBannerAds() {
        ClickSkipButton.closeBannerAds();
    }

    reset() {
        this.adProcessed = false;
        this.lastAdTime = 0;
        this.skipAttempted = false;
        console.log("[YT Ad Skipper] State reset, monitoring for ads...");
    }
}

// Utility functions
function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function initialize() {
    if (isInIframe()) {
        console.log("[YT Ad Skipper] Running in iframe, skipping initialization");
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        .ytp-ad-preview-container { pointer-events: none !important; }
        .ytp-ad-text-overlay { pointer-events: none !important; }
    `;
    document.head.appendChild(style);

    const skipper = new AdSkipper();
    skipper.start();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}

let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log("[YT Ad Skipper] Page changed, reinitializing...");
        setTimeout(initialize, 1000);
    }
}).observe(document, { subtree: true, childList: true });