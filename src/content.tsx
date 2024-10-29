import React, { useState } from 'react';
// @ts-ignore
import { createRoot } from 'react-dom/client';
// import './tailwind.css';

const Overlay: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div>
      <button onClick={() => setVisible(false)} className="">
        Close Overlay
      </button>
    </div>
  );
};

// Function to render the overlay
const showOverlay = () => {
  console.log('Overlay displayed'); // Logs when the overlay is shown

  const rootDiv = document.createElement('div');
  document.body.appendChild(rootDiv);
  const root = createRoot(rootDiv);
  root.render(<Overlay />);
};

showOverlay(); // Call the function to display the overlay

// showOverlay(); // Call the function to display the overlay
// Export the showOverlay function so it can be called from outside
export default showOverlay;
