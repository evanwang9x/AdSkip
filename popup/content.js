console.log('First Load of Script');

let skipInterval = null;
let isAdDetected = false;

function detectAd() {
  const adElement = document.querySelector('.ytp-ad-player-overlay-layout');
  const hasAd = adElement && adElement.offsetParent !== null;

  if (hasAd && !isAdDetected) {
    console.log('AD DETECTED');
    isAdDetected = true;
    fastForwardAd();
    skipInterval = setInterval(attemptSkip, 200);
  } else if (!hasAd && isAdDetected) {
    setTimeout(() => {
      const adCheck = document.querySelector('.ytp-ad-player-overlay-layout');
      const stillHasAd = adCheck && adCheck.offsetParent !== null;
      
      if (!stillHasAd) {
        console.log('Ad ended, stopping skip attempts');
        isAdDetected = false;
        if (skipInterval) {
          clearInterval(skipInterval);
          skipInterval = null;
        }
      }
    }, 500); 
  }
  return hasAd;
}

function fastForwardAd() {
  const video = document.querySelector('video');
  console.log(video)
  if (video && !video.paused) {
    video.currentTime = video.duration - 1;
    console.log(`Fast-forwarded ad`);
  }
}

function attemptSkip() {
  const skipButton = document.querySelector('.ytp-skip-ad-button');
  if (skipButton && 
      skipButton.offsetParent !== null && 
      !skipButton.disabled) {
    console.log('Skipping ad with ytp-skip-ad-button');
    skipButton.click();
    return true;
  }
  
  return false;
}

function startAdDetection() {
  console.log('Starting ad detection via MutationObserver only');  
  detectAd();
}

// Function to handle YouTube's SPA navigation and ad detection
const adObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node contains the ad overlay
          if (node.classList?.contains('ytp-ad-player-overlay-layout') || 
              node.querySelector?.('.ytp-ad-player-overlay-layout')) {
            console.log('🎯 Ad overlay detected in DOM');
            setTimeout(detectAd, 100);
          }
        }
      });
    }
    
    // Also check for removed nodes to detect when ads end
    if (mutation.removedNodes.length > 0) {
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList?.contains('ytp-ad-player-overlay-layout') || 
              node.querySelector?.('.ytp-ad-player-overlay-layout')) {
            console.log('🎯 Ad overlay removed from DOM');
            setTimeout(detectAd, 100);
          }
        }
      });
    }
  });
});

adObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Start ad detection when script loads
startAdDetection();