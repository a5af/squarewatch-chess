import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';

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

// Mount the React component to a div appended to the body
const rootDiv = document.createElement('div');
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(<Overlay />);
