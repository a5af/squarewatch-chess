import React, { useEffect, useRef, useState } from 'react';
import { detectPieces, calculateThreatLevels } from './BoardDetection';
import { PiecePosition } from './PiecePosition';

const Overlay: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [piecePositions, setPiecePositions] = useState<PiecePosition[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const positions = detectPieces();
    setPiecePositions(positions);

    const drawGrid = () => {
      const canvas = canvasRef.current;
      const board = document.getElementById('board-single');

      if (canvas && board) {
        const context = canvas.getContext('2d');
        if (!context) return;

        const { width, height, top, left } = board.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'absolute';
        canvas.style.top = `${top}px`;
        canvas.style.left = `${left}px`;

        const cellWidth = width / 8;
        const cellHeight = height / 8;

        context.clearRect(0, 0, width, height);

        const threatLevels = calculateThreatLevels(piecePositions);

        threatLevels.forEach(({ row, col, selfCount, enemyCount }) => {
          let color = '';
          if (selfCount > 0 && enemyCount > 0) {
            color = `rgba(128, 0, 128, ${Math.min(
              (selfCount + enemyCount) / 5,
              1
            )})`; // Purple
          } else if (selfCount > 0) {
            color = `rgba(0, 0, 255, ${Math.min(selfCount / 5, 1)})`; // Blue
          } else if (enemyCount > 0) {
            color = `rgba(255, 0, 0, ${Math.min(enemyCount / 5, 1)})`; // Red
          }
          if (color) {
            context.fillStyle = color;
            context.fillRect(
              (col - 1) * cellWidth,
              (8 - row) * cellHeight,
              cellWidth,
              cellHeight
            );
          }
        });

        // Draw grid outline
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        context.lineWidth = 1;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            context.strokeRect(
              c * cellWidth,
              r * cellHeight,
              cellWidth,
              cellHeight
            );
          }
        }
      }
    };

    drawGrid();
    window.addEventListener('resize', drawGrid);
    return () => window.removeEventListener('resize', drawGrid);
  }, [piecePositions]);

  const handleClose = () => {
    setVisible(false);
    try {
      chrome.storage.local.set({ overlayActive: false });
    } catch (error) {
      console.error('Error accessing chrome.storage.local:', error);
    }
  };

  if (!visible) {
    document.getElementById('overlay-root')?.remove();
    return null;
  }

  return (
    <div style={overlayContainerStyle}>
      <button onClick={handleClose} style={buttonStyle}>
        Close Overlay
      </button>
      <canvas ref={canvasRef} style={canvasStyle}></canvas>
    </div>
  );
};

// Inline styles for the overlay container and button
const overlayContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  pointerEvents: 'none', // Allows interaction with elements below
  zIndex: 1000,
};

const buttonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#ff6b6b',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  pointerEvents: 'auto', // Allow interaction with the button itself
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
};

const canvasStyle: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none', // Canvas remains transparent to clicks
  zIndex: 1001,
};

export default Overlay;
