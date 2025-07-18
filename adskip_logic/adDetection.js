'use strict';

// Ad detection module
class AdDetection {
    static isAdPlaying() {
        const adIndicators = [
            ".ytp-ad-player-overlay",
            ".ytp-ad-image-overlay",
            ".ytp-ad-text",
            ".ytp-ad-preview-container",
            ".ytp-ad-skip-button-container",
            ".ytp-ad-overlay-ad-info-dialog-container",
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

    static getVideo() {
        return document.querySelector('video');
    }
}

// Make available globally
window.AdDetection = AdDetection;