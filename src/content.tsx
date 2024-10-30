import React, { useState } from 'react';
// @ts-ignore
import { createRoot } from 'react-dom/client';

const Overlay: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    // Remove overlay and reset the active flag in storage
    document.getElementById('overlay-root')?.remove();
    chrome.storage.local.set({ overlayActive: false });
    return null;
  }

  return (
    <div style={overlayStyle}>
      <button onClick={() => setVisible(false)} style={buttonStyle}>
        Close Overlay
      </button>
    </div>
  );
};

// Inline styles for the overlay and button
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const buttonStyle: React.CSSProperties = {
  padding: '20px 40px',
  fontSize: '24px',
  backgroundColor: '#ff6b6b',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
};

// Function to render the overlay
const showOverlay = () => {
  console.log('Overlay displayed');

  // Check if overlay already exists
  if (document.getElementById('overlay-root')) {
    console.log('Overlay already exists');
    return; // Exit if overlay is already present
  }

  // Create root div with unique ID
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
