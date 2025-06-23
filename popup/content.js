// Log when content script first loads
console.log('Hello world');

// Function to handle YouTube's SPA navigation
let lastUrl = location.href;

// Create a MutationObserver to watch for URL changes
const observer = new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log('Hello world');
    
    // Notify background script of navigation
    chrome.runtime.sendMessage({ action: 'youtube_navigation' });
  }
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also listen for popstate events (browser back/forward)
window.addEventListener('popstate', () => {
  console.log('Hello world');
  chrome.runtime.sendMessage({ action: 'youtube_navigation' });
});

// Listen for YouTube's custom navigation event
document.addEventListener('yt-navigate-finish', () => {
  console.log('Hello world');
  chrome.runtime.sendMessage({ action: 'youtube_navigation' });
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'youtube_loaded') {
    // Already logged in the main script
  }
  sendResponse({ status: 'received' });
});