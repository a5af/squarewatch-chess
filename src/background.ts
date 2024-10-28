// background.ts

// Listen for tab updates to detect when the URL matches a specific pattern (e.g., a live game on chess.com)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab's URL includes "/game/live/"
  if (
    tab.url &&
    tab.url.includes('/game/live/') &&
    changeInfo.status === 'complete'
  ) {
    // Inject the content script to activate the overlay on the matching page
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });
  }
});

// Optionally, listen for when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  }
});
