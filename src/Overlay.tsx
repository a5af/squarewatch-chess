import { createSignal, createEffect, onCleanup, Show } from 'solid-js';
import { detectPieces, calculateThreatLevels } from './BoardDetection';
import type { PiecePosition } from './PiecePosition';

const Overlay = () => {
  const [visible, setVisible] = createSignal(true);
  const [piecePositions, setPiecePositions] = createSignal<PiecePosition[]>([]);
  let canvasRef: HTMLCanvasElement | undefined;

  const drawGrid = () => {
    const canvas = canvasRef;
    const board = document.getElementById('board-single') || document.querySelector('.cg-wrap');

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

      const threatLevels = calculateThreatLevels(piecePositions());

      threatLevels.forEach(({ row, col, selfCount, enemyCount }) => {
        let color = '';
        if (selfCount > 0 && enemyCount > 0) {
          color = `rgba(128, 0, 128, ${Math.min((selfCount + enemyCount) / 5, 1)})`; // Purple
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

  createEffect(() => {
    const positions = detectPieces();
    setPiecePositions(positions);
  });

  createEffect(() => {
    piecePositions(); // Track dependency
    drawGrid();

    const handleResize = () => drawGrid();
    window.addEventListener('resize', handleResize);

    // MutationObserver for real-time updates
    const board = document.getElementById('board-single') || document.querySelector('.cg-wrap');
    if (board) {
      const observer = new MutationObserver(() => {
        const positions = detectPieces();
        setPiecePositions(positions);
      });

      observer.observe(board, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });

      onCleanup(() => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
      });
    } else {
      onCleanup(() => {
        window.removeEventListener('resize', handleResize);
      });
    }
  });

  const handleClose = () => {
    setVisible(false);
    try {
      chrome.storage.local.set({ overlayActive: false });
      document.getElementById('overlay-root')?.remove();
    } catch (error) {
      console.error('Error accessing chrome.storage.local:', error);
    }
  };

  return (
    <Show when={visible()}>
      <div style={overlayContainerStyle}>
        <button onClick={handleClose} style={buttonStyle}>
          Close Overlay
        </button>
        <canvas ref={canvasRef} style={canvasStyle}></canvas>
      </div>
    </Show>
  );
};

// Inline styles for the overlay container and button
const overlayContainerStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  'pointer-events': 'none',
  'z-index': '1000',
} as const;

const buttonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  'font-size': '16px',
  'background-color': '#ff6b6b',
  color: '#fff',
  border: 'none',
  'border-radius': '8px',
  cursor: 'pointer',
  'pointer-events': 'auto',
  'box-shadow': '0px 4px 10px rgba(0, 0, 0, 0.5)',
} as const;

const canvasStyle = {
  position: 'absolute',
  'pointer-events': 'none',
  'z-index': '1001',
} as const;

export default Overlay;
