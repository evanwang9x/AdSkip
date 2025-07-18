'use strict';

// Ad detection module
class AdDetection {
    static isAdPlaying() {
        const adBadge = document.querySelector(".ytp-ad-badge");
        if (adBadge && adBadge.textContent) {
            console.log("[YT Ad Skipper] Ad detected via: .ytp-ad-badge");
            return true;
        }

        const video = document.querySelector("video");
        if (video && video.classList.contains("ad-showing")) {
            console.log("[YT Ad Skipper] Ad detected via: video.ad-showing class");
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