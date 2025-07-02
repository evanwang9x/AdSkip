console.log('First Load of Script');

let skipInterval = null;
let isAdDetected = false;
let adStartTime = null;

function detectAd() {
  const adElement = document.querySelector('.ytp-ad-player-overlay-layout');
  const hasAd = adElement && adElement.offsetParent !== null;

  if (hasAd && !isAdDetected) {
    console.log('AD DETECTED');
    isAdDetected = true;
    adStartTime = Date.now();
    
    // Start attempting to skip immediately but also try fast-forward after skip attempts
    skipInterval = setInterval(() => {
      const skipped = attemptSkip();
      
      // If skip button not available and ad has played for at least 2 seconds, try fast-forward
      if (!skipped && Date.now() - adStartTime > 2000) {
        fastForwardAd();
      }
    }, 500); // Increased interval for better stability
    
  } else if (!hasAd && isAdDetected) {
    setTimeout(() => {
      const adCheck = document.querySelector('.ytp-ad-player-overlay-layout');
      const stillHasAd = adCheck && adCheck.offsetParent !== null;

      if (!stillHasAd) {
        console.log('Ad ended, stopping skip attempts');
        isAdDetected = false;
        adStartTime = null;
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
  if (video && !video.paused && video.duration) {
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    // Only fast-forward if we haven't already done so
    if (currentTime < duration - 5) {
      video.currentTime = Math.max(duration - 1, currentTime + 10);
      console.log(`Fast-forwarded ad from ${currentTime}s to ${video.currentTime}s`);
    }
  }
}

function attemptSkip() {
  // More comprehensive skip button selectors
  const skipSelectors = [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-skip-ad-button__text',
    'button[class*="skip"]',
    'button[aria-label*="Skip"]',
    'button[aria-label*="skip"]',
    '.skip-button',
    '[data-testid*="skip"]',
    'button:has-text("Skip")', // For newer browsers
    'button:has-text("skip")'
  ];
  
  for (const selector of skipSelectors) {
    try {
      const skipButton = document.querySelector(selector);
      if (skipButton && 
          skipButton.offsetParent !== null && 
          !skipButton.disabled &&
          !skipButton.hasAttribute('aria-hidden')) {
        
        console.log(`Attempting to click skip button with selector: ${selector}`);
        console.log('Button element:', skipButton);
        console.log('Button text:', skipButton.textContent?.trim());
        
        // Try multiple click methods
        skipButton.click();
        
        // Backup click methods
        skipButton.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        
        // Focus and enter key as fallback
        skipButton.focus();
        skipButton.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          which: 13,
          keyCode: 13,
          bubbles: true
        }));
        
        console.log(`✅ Skip button clicked successfully with ${selector}`);
        return true;
      }
    } catch (error) {
      console.log(`Error with selector ${selector}:`, error);
    }
  }
  
  // Debug: Log all buttons on the page when skip button not found
  const allButtons = document.querySelectorAll('button');
  const skipRelatedButtons = Array.from(allButtons).filter(btn => 
    btn.textContent?.toLowerCase().includes('skip') ||
    btn.className?.toLowerCase().includes('skip') ||
    btn.getAttribute('aria-label')?.toLowerCase().includes('skip')
  );
  
  if (skipRelatedButtons.length > 0) {
    console.log('Found skip-related buttons:', skipRelatedButtons.map(btn => ({
      element: btn,
      text: btn.textContent?.trim(),
      className: btn.className,
      ariaLabel: btn.getAttribute('aria-label'),
      visible: btn.offsetParent !== null,
      disabled: btn.disabled
    })));
  } else {
    console.log('No skip buttons found at all');
  }
  
  return false;
}

function startAdDetection() {
  console.log('Starting ad detection via MutationObserver only');
  detectAd();
}

// Enhanced mutation observer
const adObserver = new MutationObserver((mutations) => {
  let shouldCheckAd = false;
  
  mutations.forEach((mutation) => {
    // Check added nodes
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList?.contains('ytp-ad-player-overlay-layout') ||
              node.querySelector?.('.ytp-ad-player-overlay-layout') ||
              node.classList?.contains('ytp-skip-ad-button') ||
              node.querySelector?.('.ytp-skip-ad-button')) {
            console.log('🎯 Ad-related element detected in DOM');
            shouldCheckAd = true;
          }
        }
      });
    }

    // Check removed nodes
    if (mutation.removedNodes.length > 0) {
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList?.contains('ytp-ad-player-overlay-layout') ||
              node.querySelector?.('.ytp-ad-player-overlay-layout')) {
            console.log('🎯 Ad overlay removed from DOM');
            shouldCheckAd = true;
          }
        }
      });
    }
  });
  
  if (shouldCheckAd) {
    setTimeout(detectAd, 100);
  }
});

adObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'style', 'aria-hidden', 'disabled']
});

// Start ad detection when script loads
startAdDetection();

// Additional debugging: Log when any button is clicked
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON' && 
      (event.target.textContent?.toLowerCase().includes('skip') ||
       event.target.className?.toLowerCase().includes('skip'))) {
    console.log('Skip button manually clicked:', event.target);
  }
}, true);