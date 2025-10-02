import { PiecePosition } from './PiecePosition';

interface SquareThreat {
  row: number;
  col: number;
  selfCount: number; // Number of "self" pieces targeting this square
  enemyCount: number; // Number of "enemy" pieces targeting this square
}

// Detect chess.com pieces
const detectChessDotComPieces = (): PiecePosition[] => {
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
  }

  return positions;
};

// Detect lichess.org pieces using chessground
const detectLichessPieces = (): PiecePosition[] => {
  const board = document.querySelector('.cg-wrap');
  const positions: PiecePosition[] = [];

  if (board) {
    const pieces = board.querySelectorAll('piece');

    pieces.forEach((piece) => {
      // Lichess uses classes like 'white pawn' or 'black knight'
      const classes = Array.from(piece.classList);
      const color = classes.find((c) => c === 'white' || c === 'black');
      const pieceType = classes.find((c) =>
        ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].includes(c)
      );

      // Get position from CSS transform or data attributes
      const style = window.getComputedStyle(piece);
      const transform = style.transform;

      if (color && pieceType && transform && transform !== 'none') {
        // Parse the transform matrix to get position
        const matrix = transform.match(/matrix\(([^)]+)\)/)?.[1].split(', ');
        if (matrix && matrix.length >= 6) {
          const x = parseFloat(matrix[4]);
          const y = parseFloat(matrix[5]);
          const boardRect = board.getBoundingClientRect();
          const cellWidth = boardRect.width / 8;
          const cellHeight = boardRect.height / 8;

          const col = Math.floor(x / cellWidth) + 1;
          const row = 8 - Math.floor(y / cellHeight);

          // Convert to chess.com style notation (wp, bn, etc.)
          const colorCode = color === 'white' ? 'w' : 'b';
          const pieceCode = pieceType[0]; // First letter
          const type = colorCode + pieceCode;

          if (row >= 1 && row <= 8 && col >= 1 && col <= 8) {
            positions.push({ type, row, col });
          }
        }
      }
    });
  }

  return positions;
};

// Main detection function that works on both sites
export const detectPieces = (): PiecePosition[] => {
  // Try chess.com first
  if (document.getElementById('board-single')) {
    return detectChessDotComPieces();
  }

  // Try lichess
  if (document.querySelector('.cg-wrap')) {
    return detectLichessPieces();
  }

  return [];
};

// Helper to get possible attacks based on piece type and position
export const getAttackSquares = (
  piece: PiecePosition,
  pieces: PiecePosition[]
): Array<{ row: number; col: number }> => {
  const moves: Array<{ row: number; col: number }> = [];
  const { type, row, col } = piece;

  const isBlocked = (r: number, c: number) => {
    return pieces.some((p) => p.row === r && p.col === c);
  };

  const addMovesInLine = (deltaRow: number, deltaCol: number) => {
    for (let i = 1; i < 8; i++) {
      const targetRow = row + deltaRow * i;
      const targetCol = col + deltaCol * i;
      if (targetRow < 1 || targetRow > 8 || targetCol < 1 || targetCol > 8)
        break;
      moves.push({ row: targetRow, col: targetCol });
      if (isBlocked(targetRow, targetCol)) break; // Stop if blocked
    }
  };

  switch (type) {
    case 'wp':
      moves.push(
        { row: row + 1, col: col + 1 },
        { row: row + 1, col: col - 1 }
      );
      break;
    case 'bp':
      moves.push(
        { row: row - 1, col: col + 1 },
        { row: row - 1, col: col - 1 }
      );
      break;
    case 'wr':
    case 'br':
      addMovesInLine(1, 0);
      addMovesInLine(-1, 0);
      addMovesInLine(0, 1);
      addMovesInLine(0, -1);
      break;
    case 'wb':
    case 'bb':
      addMovesInLine(1, 1);
      addMovesInLine(-1, -1);
      addMovesInLine(1, -1);
      addMovesInLine(-1, 1);
      break;
    case 'wq':
    case 'bq':
      addMovesInLine(1, 0);
      addMovesInLine(-1, 0);
      addMovesInLine(0, 1);
      addMovesInLine(0, -1);
      addMovesInLine(1, 1);
      addMovesInLine(-1, -1);
      addMovesInLine(1, -1);
      addMovesInLine(-1, 1);
      break;
    case 'wk':
    case 'bk':
      [-1, 0, 1].forEach((dr) =>
        [-1, 0, 1].forEach((dc) => {
          if (dr || dc) moves.push({ row: row + dr, col: col + dc });
        })
      );
      break;
    case 'wn':
    case 'bn':
      [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
      ].forEach(([dr, dc]) => {
        moves.push({ row: row + dr, col: col + dc });
      });
      break;
  }

  return moves.filter(
    ({ row, col }) => row >= 1 && row <= 8 && col >= 1 && col <= 8
  );
};

// Compute the overall threat level for each square
export const calculateThreatLevels = (
  pieces: PiecePosition[]
): SquareThreat[] => {
  const threatLevels: SquareThreat[] = [];

  pieces.forEach((piece) => {
    const attackSquares = getAttackSquares(piece, pieces);
    attackSquares.forEach(({ row, col }) => {
      let threatSquare = threatLevels.find(
        (threat) => threat.row === row && threat.col === col
      );
      if (!threatSquare) {
        threatSquare = { row, col, selfCount: 0, enemyCount: 0 };
        threatLevels.push(threatSquare);
      }

      if (piece.type.startsWith('w')) {
        threatSquare.selfCount += 1;
      } else {
        threatSquare.enemyCount += 1;
      }
    });
  });

  return threatLevels;
};
