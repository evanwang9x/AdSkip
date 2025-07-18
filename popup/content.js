'use strict';

// Configuration
const FAST_FORWARD_SECONDS = 6; // Seconds to fast forward when ad starts
const CHECK_INTERVAL = 200; // Milliseconds between checks
const END_BUFFER_SECONDS = 1; // Seconds before end to skip to

// Skip button class names
const SKIP_BUTTON_CLASSES = [
    "videoAdUiSkipButton",
    "ytp-ad-skip-button",
    "ytp-ad-skip-button-modern",
    "ytp-skip-ad-button"
];

// Banner close button classes
const BANNER_CLOSE_CLASSES = [
    "ytp-ad-overlay-close-button"
];

// Utility functions
function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function clickElement(element) {
    if (!element) return false;

    try {
        element.click();
        return true;
    } catch (e) {
        try {
            const clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", true, false);
            element.dispatchEvent(clickEvent);
            return true;
        } catch (e2) {
            console.error("[YT Ad Skipper] Failed to click element:", e2);
            return false;
        }
    }
}

function findElements(classNames) {
    const elements = [];
    for (const className of classNames) {
        const byClass = document.getElementsByClassName(className);
        for (let elem of byClass) {
            if (!elements.includes(elem)) {
                elements.push(elem);
            }
        }

        const bySelector = document.querySelectorAll(`.${className.replace(/\s+/g, '.')}`);
        for (let elem of bySelector) {
            if (!elements.includes(elem)) {
                elements.push(elem);
            }
        }
    }
    return elements;
}

// Ad detection
function isAdPlaying() {
    const adIndicators = [
        ".ytp-ad-player-overlay",
        ".ytp-ad-image-overlay",
        ".ytp-ad-text",
        ".ytp-ad-preview-container",
        ".ytp-ad-skip-button-container",
        ".ytp-ad-overlay-ad-info-dialog-container",
        ".ytp-ad-progress-list",
        ".ad-showing",
        ".ytp-ad-simple-ad-badge"
    ];

    for (const selector of adIndicators) {
        if (document.querySelector(selector)) {
            return true;
        }
    }

    const adBadge = document.querySelector(".ytp-ad-badge");
    if (adBadge && adBadge.textContent) {
        return true;
    }

    const video = document.querySelector("video");
    if (video && video.classList.contains("ad-showing")) {
        return true;
    }

    return false;
}

// Get video element
function getVideo() {
    return document.querySelector('video');
}

// Main ad skipper class
class AdSkipper {
    constructor() {
        this.adProcessed = false;
        this.lastAdTime = 0;
        this.skipAttempted = false;
    }

    start() {
        console.log("[YT Ad Skipper] Starting ad skipper with fast forward...");
        this.startMainLoop();
    }

    startMainLoop() {
        setInterval(() => {
            this.checkForAds();
            this.checkForBannerAds();
        }, CHECK_INTERVAL);
    }

    checkForAds() {
        const video = getVideo();
        if (!video) return;

        const adDetected = isAdPlaying();

        if (adDetected) {
            // Check if this is a new ad or continuation
            if (!this.adProcessed || Math.abs(video.currentTime - this.lastAdTime) > 10) {
                console.log("[YT Ad Skipper] Ad detected, processing...");
                this.processAd(video);
            }
        } else {
            // No ad playing, reset state
            if (this.adProcessed) {
                console.log("[YT Ad Skipper] Ad ended, resetting...");
                this.reset();
            }
        }
    }

    processAd(video) {
        this.adProcessed = true;

        // Step 1: Fast forward by 5 seconds
        const targetTime = video.currentTime + FAST_FORWARD_SECONDS;
        console.log(`[YT Ad Skipper] Fast forwarding from ${video.currentTime}s to ${targetTime}s`);
        video.currentTime = targetTime;
        this.lastAdTime = targetTime;

        // Step 2: Try to click skip button after a short delay
        setTimeout(() => {
            if (this.tryClickSkipButton()) {
                console.log("[YT Ad Skipper] Skip button clicked successfully");
                this.reset();
            } else {
                // Step 3: If no skip button, fast forward to near the end
                this.fastForwardToEnd(video);
            }
        }, 500); // Small delay to let the skip button appear
    }

    tryClickSkipButton() {
        const skipButtons = findElements(SKIP_BUTTON_CLASSES);

        for (const button of skipButtons) {
            if (button && button.offsetParent !== null) {
                // Check if button is actually clickable
                if (!button.disabled && !button.classList.contains('ytp-ad-skip-button-disabled')) {
                    if (clickElement(button)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    fastForwardToEnd(video) {
        // Try to get ad duration
        const duration = video.duration;

        if (duration && !isNaN(duration) && duration > 0) {
            // Fast forward to 1 second before the end
            const targetTime = Math.max(0, duration - END_BUFFER_SECONDS);
            console.log(`[YT Ad Skipper] No skip button found, fast forwarding to ${targetTime}s (1s before end)`);
            video.currentTime = targetTime;
            this.lastAdTime = targetTime;

            // Set a flag to handle potential second ad
            this.skipAttempted = true;

            // Reset after the buffer time
            setTimeout(() => {
                if (isAdPlaying()) {
                    // Second ad detected, process it
                    console.log("[YT Ad Skipper] Second ad detected");
                    this.adProcessed = false; // Allow reprocessing
                    this.processAd(video);
                } else {
                    this.reset();
                }
            }, END_BUFFER_SECONDS * 1000 + 500);
        } else {
            console.log("[YT Ad Skipper] Could not determine ad duration");
            // Try again in a bit
            setTimeout(() => this.fastForwardToEnd(video), 1000);
        }
    }

    checkForBannerAds() {
        // Remove banner/overlay ads immediately
        const bannerCloseButtons = findElements(BANNER_CLOSE_CLASSES);
        bannerCloseButtons.forEach(button => {
            if (clickElement(button)) {
                console.log("[YT Ad Skipper] Closed banner ad");
            }
        });
    }

    reset() {
        this.adProcessed = false;
        this.lastAdTime = 0;
        this.skipAttempted = false;
        console.log("[YT Ad Skipper] State reset, monitoring for ads...");
    }
}

// Initialize when DOM is ready
function initialize() {
    if (isInIframe()) {
        console.log("[YT Ad Skipper] Running in iframe, skipping initialization");
        return;
    }

    // Add some CSS to hide ad overlays that might block our controls
    const style = document.createElement('style');
    style.textContent = `
        /* Hide ad countdown overlays that might interfere */
        .ytp-ad-preview-container { pointer-events: none !important; }
        .ytp-ad-text-overlay { pointer-events: none !important; }
    `;
    document.head.appendChild(style);

    const skipper = new AdSkipper();
    skipper.start();
}

// Start when DOM is loaded
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