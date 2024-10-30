// background.js

chrome.action.onClicked.addListener((tab) => {
  // Check if the tab's URL includes "chess.com"
  if (tab.url && tab.url.includes('chess.com')) {
    // Get current overlayActive state
    chrome.storage.local.get('overlayActive', (result) => {
      const isActive = result.overlayActive || false;

      // Toggle the overlayActive state
      chrome.storage.local.set({ overlayActive: !isActive }, () => {
        if (!isActive) {
          // If turning on, inject content script to display overlay
          chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            files: ['content.js'],
          });
        } else {
          // Optionally, send a message to content.js to close the overlay
          chrome.tabs.sendMessage(tab.id!, { action: 'closeOverlay' });
        }
      });
    });
  } else {
    // Display an alert if not on chess.com
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => alert('This extension only works on chess.com.'),
    });
  }
});
