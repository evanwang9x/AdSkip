// Simple popup script
// You can add functionality here if needed

// Check if we're on YouTube
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  const statusElement = document.querySelector('.status');
  
  if (currentTab.url && currentTab.url.includes('youtube.com')) {
    statusElement.textContent = 'Active on YouTube';
    statusElement.style.backgroundColor = '#4CAF50';
  } else {
    statusElement.textContent = 'Not on YouTube';
    statusElement.style.backgroundColor = '#9E9E9E';
  }
});