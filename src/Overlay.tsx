// Overlay.tsx
import React, { useEffect, useState } from 'react';
import { detectPieces } from './BoardDetection';
import { PiecePosition } from './PiecePosition';

const Overlay: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [piecePositions, setPiecePositions] = useState<PiecePosition[]>([]);

  useEffect(() => {
    // Detect pieces and store positions on component mount
    const positions = detectPieces();
    setPiecePositions(positions);
  }, []);

  if (!visible) {
    document.getElementById('overlay-root')?.remove();
    chrome.storage.local.set({ overlayActive: false });
    return null;
  }

  return (
    <div style={overlayStyle}>
      <button onClick={() => setVisible(false)} style={buttonStyle}>
        Close Overlay
      </button>
      {/* Display detected pieces (optional) */}
      <div>
        {piecePositions.map((piece, index) => (
          <div key={index}>
            Piece {piece.type} at Row {piece.row}, Column {piece.col}
          </div>
        ))}
      </div>
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

export default Overlay;
