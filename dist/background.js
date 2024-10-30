/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// background.ts
chrome.action.onClicked.addListener((tab) => {
    // Check if the tab's URL includes "chess.com"
    console.log('Extension icon clicked', Date.now());
    if (tab.url && tab.url.includes('chess.com')) {
        // Set the overlay active and inject content script
        chrome.storage.local.set({ overlayActive: true }, () => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js'],
            });
        });
    }
    else {
        // Display an alert if not on chess.com
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert('Chess Overlay Extension only works on chess.com.'),
        });
    }
});

/******/ })()
;