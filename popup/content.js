console.log('First Load of Script');

let skipInterval = null;
let isAdDetected = false;

function detectAd() {
  const adSelectors = [
    '.video-ads.ytp-ad-module',
    '.ytp-ad-player-overlay',
    '.ytp-ad-skip-button-container',
    'div[class*="ad-showing"]',
    '.ytp-ad-text',
    '.ytp-ad-preview-text'
  ];

  const hasAd = adSelectors.some(selector => {
    const element = document.querySelector(selector);
    return element && element.offsetParent !== null;
  });

  if (hasAd && !isAdDetected) {
    console.log('AD DETECTED');
    isAdDetected = true;
    
    // Start skip attempts only when ad is first detected
    console.log('Starting skip attempts every 1 second...');
    skipInterval = setInterval(attemptSkip, 1000);
  } else if (!hasAd && isAdDetected) {
    // Ad has ended
    console.log('Ad ended, stopping skip attempts');
    isAdDetected = false;
    if (skipInterval) {
      clearInterval(skipInterval);
      skipInterval = null;
    }
  }
  
  return hasAd;
}

function attemptSkip() {
  const skipSelectors = [
    '.ytp-ad-skip-button',
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button-container button',
    '[class*="skip"][class*="button"]',
    'button[class*="skip"]'
  ];

  for (const selector of skipSelectors) {
    const skipButton = document.querySelector(selector);
    if (skipButton && skipButton.offsetParent !== null) {
      console.log('Skipping ad');
      skipButton.click();
      
      // Auto-play video after skipping ad
      setTimeout(() => {
        playVideo();
      }, 500); // Small delay to ensure ad is skipped first
      
      return true;
    }
  }  
  return false;
}

function playVideo() {
  const playSelectors = [
    '.ytp-play-button',
    '.ytp-large-play-button',
    'button[class*="play"]',
    '[aria-label*="Play"]',
    '.html5-main-video' // Direct video element
  ];

  for (const selector of playSelectors) {
    const playButton = document.querySelector(selector);
    if (playButton && playButton.offsetParent !== null) {
      console.log('Auto-playing video after ad skip');
      playButton.click();
      return true;
    }
  }

  // If no play button found, try to play video directly
  const video = document.querySelector('video');
  if (video && video.paused) {
    console.log('Playing video directly');
    video.play();
    return true;
  }

  console.log('Could not find play button or video element');
  return false;
}

function startAdDetection() {
  console.log('Starting ad detection');  
  setInterval(() => {
    detectAd();
  }, 2000);
}

// Function to handle YouTube's SPA navigation
const adObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node is ad-related
          if (node.classList?.contains('ytp-ad-module') || 
              node.classList?.contains('video-ads') ||
              node.querySelector?.('.ytp-ad-skip-button')) {
            console.log('🎯 Ad element added to DOM');
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