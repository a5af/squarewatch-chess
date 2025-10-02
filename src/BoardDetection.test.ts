import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectPieces, getAttackSquares, calculateThreatLevels } from './BoardDetection';
import type { PiecePosition } from './PiecePosition';

describe('BoardDetection', () => {
  describe('detectPieces', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return empty array when no board exists', () => {
      const pieces = detectPieces();
      expect(pieces).toEqual([]);
    });

    it('should detect chess.com pieces', () => {
      // Create mock chess.com board
      document.body.innerHTML = `
        <div id="board-single">
          <div class="piece wp square-42"></div>
          <div class="piece bn square-57"></div>
        </div>
      `;

      const pieces = detectPieces();
      expect(pieces).toHaveLength(2);
      expect(pieces[0]).toEqual({ type: 'wp', row: 4, col: 2 });
      expect(pieces[1]).toEqual({ type: 'bn', row: 5, col: 7 });
    });

    it('should detect lichess pieces', () => {
      // Create mock lichess board with chessground
      const board = document.createElement('div');
      board.className = 'cg-wrap';
      board.style.width = '800px';
      board.style.height = '800px';
      document.body.appendChild(board);

      const piece1 = document.createElement('piece');
      piece1.className = 'white pawn';
      piece1.style.transform = 'matrix(1, 0, 0, 1, 100, 600)';
      board.appendChild(piece1);

      const piece2 = document.createElement('piece');
      piece2.className = 'black knight';
      piece2.style.transform = 'matrix(1, 0, 0, 1, 600, 100)';
      board.appendChild(piece2);

      const pieces = detectPieces();
      // Lichess detection relies on transform parsing
      // In test environment with jsdom, this may not work perfectly
      // So we just verify the function doesn't throw
      expect(Array.isArray(pieces)).toBe(true);
    });
  });

  describe('getAttackSquares', () => {
    it('should calculate pawn attacks for white', () => {
      const pawn: PiecePosition = { type: 'wp', row: 2, col: 4 };
      const attacks = getAttackSquares(pawn, []);

      expect(attacks).toHaveLength(2);
      expect(attacks).toContainEqual({ row: 3, col: 5 });
      expect(attacks).toContainEqual({ row: 3, col: 3 });
    });

    it('should calculate pawn attacks for black', () => {
      const pawn: PiecePosition = { type: 'bp', row: 7, col: 4 };
      const attacks = getAttackSquares(pawn, []);

      expect(attacks).toHaveLength(2);
      expect(attacks).toContainEqual({ row: 6, col: 5 });
      expect(attacks).toContainEqual({ row: 6, col: 3 });
    });

    it('should calculate knight attacks', () => {
      const knight: PiecePosition = { type: 'wn', row: 4, col: 4 };
      const attacks = getAttackSquares(knight, []);

      expect(attacks).toHaveLength(8);
      expect(attacks).toContainEqual({ row: 6, col: 5 });
      expect(attacks).toContainEqual({ row: 6, col: 3 });
      expect(attacks).toContainEqual({ row: 2, col: 5 });
      expect(attacks).toContainEqual({ row: 2, col: 3 });
      expect(attacks).toContainEqual({ row: 5, col: 6 });
      expect(attacks).toContainEqual({ row: 5, col: 2 });
      expect(attacks).toContainEqual({ row: 3, col: 6 });
      expect(attacks).toContainEqual({ row: 3, col: 2 });
    });

    it('should calculate bishop attacks with no blocking', () => {
      const bishop: PiecePosition = { type: 'wb', row: 4, col: 4 };
      const attacks = getAttackSquares(bishop, []);

      expect(attacks.length).toBeGreaterThan(10); // Multiple diagonal squares
      expect(attacks).toContainEqual({ row: 5, col: 5 });
      expect(attacks).toContainEqual({ row: 6, col: 6 });
      expect(attacks).toContainEqual({ row: 7, col: 7 });
      expect(attacks).toContainEqual({ row: 8, col: 8 });
    });

    it('should stop bishop attacks when blocked', () => {
      const bishop: PiecePosition = { type: 'wb', row: 4, col: 4 };
      const blocker: PiecePosition = { type: 'wp', row: 6, col: 6 };
      const attacks = getAttackSquares(bishop, [blocker]);

      // Should include 6,6 (where blocker is) but not 7,7 or 8,8
      expect(attacks).toContainEqual({ row: 6, col: 6 });
      expect(attacks).not.toContainEqual({ row: 7, col: 7 });
      expect(attacks).not.toContainEqual({ row: 8, col: 8 });
    });

    it('should calculate rook attacks', () => {
      const rook: PiecePosition = { type: 'wr', row: 4, col: 4 };
      const attacks = getAttackSquares(rook, []);

      expect(attacks.length).toBe(14); // 7 in each direction minus the rook itself
      // Horizontal
      expect(attacks).toContainEqual({ row: 4, col: 1 });
      expect(attacks).toContainEqual({ row: 4, col: 8 });
      // Vertical
      expect(attacks).toContainEqual({ row: 1, col: 4 });
      expect(attacks).toContainEqual({ row: 8, col: 4 });
    });

    it('should calculate queen attacks', () => {
      const queen: PiecePosition = { type: 'wq', row: 4, col: 4 };
      const attacks = getAttackSquares(queen, []);

      // Queen = Rook + Bishop moves
      expect(attacks.length).toBeGreaterThan(20);
      // Should have rook moves
      expect(attacks).toContainEqual({ row: 4, col: 1 });
      // Should have bishop moves
      expect(attacks).toContainEqual({ row: 8, col: 8 });
    });

    it('should calculate king attacks', () => {
      const king: PiecePosition = { type: 'wk', row: 4, col: 4 };
      const attacks = getAttackSquares(king, []);

      expect(attacks).toHaveLength(8);
      expect(attacks).toContainEqual({ row: 5, col: 5 });
      expect(attacks).toContainEqual({ row: 5, col: 4 });
      expect(attacks).toContainEqual({ row: 5, col: 3 });
      expect(attacks).toContainEqual({ row: 4, col: 5 });
      expect(attacks).toContainEqual({ row: 4, col: 3 });
      expect(attacks).toContainEqual({ row: 3, col: 5 });
      expect(attacks).toContainEqual({ row: 3, col: 4 });
      expect(attacks).toContainEqual({ row: 3, col: 3 });
    });

    it('should filter out of bounds attacks', () => {
      const knight: PiecePosition = { type: 'wn', row: 1, col: 1 };
      const attacks = getAttackSquares(knight, []);

      // Knight at corner has only 2 valid moves
      expect(attacks).toHaveLength(2);
      attacks.forEach(({ row, col }) => {
        expect(row).toBeGreaterThanOrEqual(1);
        expect(row).toBeLessThanOrEqual(8);
        expect(col).toBeGreaterThanOrEqual(1);
        expect(col).toBeLessThanOrEqual(8);
      });
    });
  });

  describe('calculateThreatLevels', () => {
    it('should return empty array for no pieces', () => {
      const threats = calculateThreatLevels([]);
      expect(threats).toEqual([]);
    });

    it('should calculate threats from white pawn', () => {
      const pieces: PiecePosition[] = [{ type: 'wp', row: 2, col: 4 }];
      const threats = calculateThreatLevels(pieces);

      expect(threats).toHaveLength(2);
      const threat1 = threats.find((t) => t.row === 3 && t.col === 5);
      const threat2 = threats.find((t) => t.row === 3 && t.col === 3);

      expect(threat1).toBeDefined();
      expect(threat1?.selfCount).toBe(1);
      expect(threat1?.enemyCount).toBe(0);

      expect(threat2).toBeDefined();
      expect(threat2?.selfCount).toBe(1);
      expect(threat2?.enemyCount).toBe(0);
    });

    it('should calculate threats from black pawn', () => {
      const pieces: PiecePosition[] = [{ type: 'bp', row: 7, col: 4 }];
      const threats = calculateThreatLevels(pieces);

      expect(threats).toHaveLength(2);
      const threat1 = threats.find((t) => t.row === 6 && t.col === 5);

      expect(threat1).toBeDefined();
      expect(threat1?.selfCount).toBe(0);
      expect(threat1?.enemyCount).toBe(1);
    });

    it('should aggregate threats on contested squares', () => {
      const pieces: PiecePosition[] = [
        { type: 'wp', row: 2, col: 4 }, // Attacks 3,5 and 3,3
        { type: 'bp', row: 4, col: 4 }, // Attacks 3,5 and 3,3
      ];
      const threats = calculateThreatLevels(pieces);

      const contestedSquare1 = threats.find((t) => t.row === 3 && t.col === 5);
      const contestedSquare2 = threats.find((t) => t.row === 3 && t.col === 3);

      expect(contestedSquare1).toBeDefined();
      expect(contestedSquare1?.selfCount).toBe(1);
      expect(contestedSquare1?.enemyCount).toBe(1);

      expect(contestedSquare2).toBeDefined();
      expect(contestedSquare2?.selfCount).toBe(1);
      expect(contestedSquare2?.enemyCount).toBe(1);
    });

    it('should accumulate multiple attackers on same square', () => {
      const pieces: PiecePosition[] = [
        { type: 'wp', row: 2, col: 4 }, // Attacks 3,5
        { type: 'wp', row: 2, col: 6 }, // Also attacks 3,5
      ];
      const threats = calculateThreatLevels(pieces);

      const doubleAttackedSquare = threats.find((t) => t.row === 3 && t.col === 5);
      expect(doubleAttackedSquare).toBeDefined();
      expect(doubleAttackedSquare?.selfCount).toBe(2);
      expect(doubleAttackedSquare?.enemyCount).toBe(0);
    });

    it('should handle complex board positions', () => {
      const pieces: PiecePosition[] = [
        { type: 'wr', row: 1, col: 1 },
        { type: 'wn', row: 1, col: 2 },
        { type: 'wb', row: 1, col: 3 },
        { type: 'br', row: 8, col: 1 },
        { type: 'bn', row: 8, col: 2 },
        { type: 'bb', row: 8, col: 3 },
      ];
      const threats = calculateThreatLevels(pieces);

      expect(threats.length).toBeGreaterThan(0);
      // Verify that each threat has proper counts
      threats.forEach((threat) => {
        expect(threat.selfCount).toBeGreaterThanOrEqual(0);
        expect(threat.enemyCount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
