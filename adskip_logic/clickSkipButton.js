'use strict';

// Click skip button module
class ClickSkipButton {
    static SKIP_BUTTON_CLASSES = [
        "videoAdUiSkipButton",
        "ytp-ad-skip-button",
        "ytp-ad-skip-button-modern",
        "ytp-skip-ad-button"
    ];

    static BANNER_CLOSE_CLASSES = [
        "ytp-ad-overlay-close-button"
    ];

    static clickElement(element) {
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

    static findElements(classNames) {
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

    static tryClickSkipButton() {
        const skipButtons = ClickSkipButton.findElements(ClickSkipButton.SKIP_BUTTON_CLASSES);

        for (const button of skipButtons) {
            if (button && button.offsetParent !== null) {
                if (!button.disabled && !button.classList.contains('ytp-ad-skip-button-disabled')) {
                    if (ClickSkipButton.clickElement(button)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    static closeBannerAds() {
        const bannerCloseButtons = ClickSkipButton.findElements(ClickSkipButton.BANNER_CLOSE_CLASSES);
        let closed = false;
        
        bannerCloseButtons.forEach(button => {
            if (ClickSkipButton.clickElement(button)) {
                console.log("[YT Ad Skipper] Closed banner ad");
                closed = true;
            }
        });

        return closed;
    }
}

// Make available globally
window.ClickSkipButton = ClickSkipButton;