// background.ts

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');

  if (tab.id !== undefined) {
    // Non-null assertion operator `!` assures TypeScript that tab.id is defined
    chrome.storage.local.set({ overlayActive: true }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['content.js'],
      });
    });
  } else {
    console.error('Tab ID is undefined. Cannot inject the content script.');
  }
});
