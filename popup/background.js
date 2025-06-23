// Listen for tab updates to detect YouTube navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL contains youtube.com and the page has finished loading
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
    console.log('Hello world');
    
    // Send message to content script to handle SPA navigation
    chrome.tabs.sendMessage(tabId, { action: 'youtube_loaded' }, (response) => {
      // Handle response if needed
    });
  }
});

// Listen for history state changes from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'youtube_navigation') {
    console.log('Hello world');
  }
  sendResponse({ received: true });
});