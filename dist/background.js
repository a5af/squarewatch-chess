/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// background.ts
// Listen for tab updates to detect when the URL matches a specific pattern (e.g., a live game on chess.com)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab's URL includes "/game/live/"
    if (tab.url) {
        // Inject the content script to activate the overlay on the matching page
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js'],
        });
    }
});
// Optionally, listen for when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked2'); // This will appear in the background page's console
    if (tab.id !== undefined) {
        chrome.scripting
            .executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
        })
            .catch((error) => console.error('Error injecting content script:', error));
    }
    else {
        console.error('Tab ID is undefined. Cannot inject the content script.');
    }
});

/******/ })()
;