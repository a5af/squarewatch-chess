import { PiecePosition } from './PiecePosition';
interface SquareThreat {
  row: number;
  col: number;
  selfCount: number; // Number of "self" pieces targeting this square
  enemyCount: number; // Number of "enemy" pieces targeting this square
}

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
  }

  return positions;
};

// Helper to get possible attacks based on piece type and position
export const getAttackSquares = (
  piece: PiecePosition,
  pieces: PiecePosition[]
): Array<{ row: number; col: number }> => {
  const moves: Array<{ row: number; col: number }> = [];
  const { type, row, col } = piece;

  const isSelf = type.startsWith('w'); // Assume 'w' means self, 'b' means enemy

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
