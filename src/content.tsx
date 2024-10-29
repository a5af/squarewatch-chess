import React, { useState } from 'react';
// @ts-ignore
import { createRoot } from 'react-dom/client';
// import './tailwind.css';

const Overlay: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <button
        onClick={() => setVisible(false)}
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
      >
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
// Export the showOverlay function so it can be called from outside
export default showOverlay;
