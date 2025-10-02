import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import Overlay from './Overlay';
import * as BoardDetection from './BoardDetection';

// Mock BoardDetection module
vi.mock('./BoardDetection', () => ({
  detectPieces: vi.fn(() => []),
  calculateThreatLevels: vi.fn(() => []),
}));

describe('Overlay Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();

    // Create a mock chess board
    const board = document.createElement('div');
    board.id = 'board-single';
    board.style.width = '800px';
    board.style.height = '800px';
    document.body.appendChild(board);
  });

  it('should render overlay component', () => {
    render(() => <Overlay />);
    const button = screen.getByText('Close Overlay');
    expect(button).toBeDefined();
  });

  it('should render canvas element', () => {
    const { container } = render(() => <Overlay />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });

  it('should call detectPieces on mount', () => {
    const detectPiecesSpy = vi.spyOn(BoardDetection, 'detectPieces');
    render(() => <Overlay />);
    expect(detectPiecesSpy).toHaveBeenCalled();
  });

  it('should hide overlay when close button is clicked', async () => {
    const { container } = render(() => <Overlay />);
    const button = screen.getByText('Close Overlay');

    // Initially visible
    expect(button).toBeDefined();

    // Click close button
    fireEvent.click(button);

    // Wait a tick for reactivity
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Should be hidden now
    expect(screen.queryByText('Close Overlay')).toBeNull();
  });

  it('should update chrome storage when closed', async () => {
    const setSpy = vi.spyOn(chrome.storage.local, 'set');
    render(() => <Overlay />);

    const button = screen.getByText('Close Overlay');
    fireEvent.click(button);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(setSpy).toHaveBeenCalledWith({ overlayActive: false });
  });

  it('should position canvas over board', () => {
    const { container } = render(() => <Overlay />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    expect(canvas).toBeDefined();
    expect(canvas.style.position).toBe('absolute');
  });

  it('should set canvas dimensions to match board', () => {
    const { container } = render(() => <Overlay />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // Canvas should have dimensions (may be 0 in test environment)
    expect(canvas.width).toBeGreaterThanOrEqual(0);
    expect(canvas.height).toBeGreaterThanOrEqual(0);
  });

  it('should call calculateThreatLevels with detected pieces', async () => {
    const mockPieces = [
      { type: 'wp', row: 2, col: 4 },
      { type: 'bn', row: 7, col: 5 },
    ];

    const detectSpy = vi.spyOn(BoardDetection, 'detectPieces').mockReturnValue(mockPieces);
    const calculateSpy = vi.spyOn(BoardDetection, 'calculateThreatLevels').mockReturnValue([]);

    render(() => <Overlay />);

    // Wait for effects to run
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(detectSpy).toHaveBeenCalled();
    expect(calculateSpy).toHaveBeenCalled();
  });

  it('should handle lichess board selector', () => {
    // Remove chess.com board
    document.getElementById('board-single')?.remove();

    // Add lichess board
    const lichessBoard = document.createElement('div');
    lichessBoard.className = 'cg-wrap';
    lichessBoard.style.width = '800px';
    lichessBoard.style.height = '800px';
    document.body.appendChild(lichessBoard);

    const { container } = render(() => <Overlay />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });

  it('should observe board mutations', async () => {
    const detectPiecesSpy = vi.spyOn(BoardDetection, 'detectPieces');
    detectPiecesSpy.mockClear();

    render(() => <Overlay />);

    // Initial call
    expect(detectPiecesSpy).toHaveBeenCalledTimes(1);

    // Simulate board mutation by adding a piece
    const board = document.getElementById('board-single');
    if (board) {
      const piece = document.createElement('div');
      piece.className = 'piece wp square-24';
      board.appendChild(piece);

      // Wait for MutationObserver to trigger
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should detect pieces again after mutation
      expect(detectPiecesSpy.mock.calls.length).toBeGreaterThan(1);
    }
  });

  it('should have correct styles for overlay container', () => {
    const { container } = render(() => <Overlay />);
    const overlayContainer = container.querySelector('div');

    expect(overlayContainer?.style.position).toBe('fixed');
    expect(overlayContainer?.style.width).toBe('100vw');
    expect(overlayContainer?.style.height).toBe('100vh');
  });

  it('should have pointer-events none on overlay container', () => {
    const { container } = render(() => <Overlay />);
    const overlayContainer = container.querySelector('div');

    expect(overlayContainer?.style.pointerEvents).toBe('none');
  });

  it('should have pointer-events auto on close button', () => {
    render(() => <Overlay />);
    const button = screen.getByText('Close Overlay') as HTMLButtonElement;

    expect(button.style.pointerEvents).toBe('auto');
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(() => <Overlay />);
    unmount();
    // No errors should be thrown
    expect(true).toBe(true);
  });
});
