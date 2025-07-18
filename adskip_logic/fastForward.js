'use strict';

// Fast forward module
class FastForward {
    static FAST_FORWARD_SECONDS = 7;
    static END_BUFFER_SECONDS = 1;

    static fastForwardToTime(video, seconds) {
        if (!video) return false;
        
        const targetTime = video.currentTime + seconds;
        console.log(`[YT Ad Skipper] Fast forwarding from ${video.currentTime}s to ${targetTime}s`);
        video.currentTime = targetTime;
        return targetTime;
    }

    static fastForwardToEnd(video) {
        if (!video) return false;

        const duration = video.duration;
        if (duration && !isNaN(duration) && duration > 0) {
            const targetTime = Math.max(0, duration - FastForward.END_BUFFER_SECONDS);
            console.log(`[YT Ad Skipper] Fast forwarding to ${targetTime}s (1s before end)`);
            video.currentTime = targetTime;
            return targetTime;
        }
        
        console.log("[YT Ad Skipper] Could not determine ad duration");
        return false;
    }

    static initialFastForward(video) {
        return FastForward.fastForwardToTime(video, FastForward.FAST_FORWARD_SECONDS);
    }
}

// Make available globally
window.FastForward = FastForward;