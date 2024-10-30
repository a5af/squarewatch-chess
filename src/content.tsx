// context.tsx
import React from 'react';
// @ts-ignore
import { createRoot } from 'react-dom/client';
import Overlay from './Overlay';

const showOverlay = () => {
  console.log('Overlay displayed');

  if (document.getElementById('overlay-root')) {
    console.log('Overlay already exists');
    return;
  }

  const rootDiv = document.createElement('div');
  rootDiv.id = 'overlay-root';
  document.body.appendChild(rootDiv);

  const root = createRoot(rootDiv);
  root.render(<Overlay />);
};

// Check the overlayActive flag in chrome.storage and show overlay if true
chrome.storage.local.get('overlayActive', (result) => {
  if (result.overlayActive) {
    showOverlay();
  }
});

export default showOverlay;
