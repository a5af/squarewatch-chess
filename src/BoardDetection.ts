// BoardDetection.ts
import { PiecePosition } from './PiecePosition';

export const detectPieces = (): PiecePosition[] => {
  const board = document.getElementById('board-single');
  const positions: PiecePosition[] = [];

  if (board) {
    const pieces = board.querySelectorAll('.piece');

    pieces.forEach((piece) => {
      const pieceType = Array.from(piece.classList).find(
        (cls) => cls.length === 2
      );
      const positionClass = Array.from(piece.classList).find((cls) =>
        cls.startsWith('square-')
      );

      if (pieceType && positionClass) {
        const square = positionClass.replace('square-', '');
        const row = parseInt(square[0], 10);
        const col = parseInt(square[1], 10);
        positions.push({ type: pieceType, row, col });
      }
    });
    console.log('Piece positions detected:', positions);
  } else {
    console.error('Chess board not found');
  }

  return positions;
};
