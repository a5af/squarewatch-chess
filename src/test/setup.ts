// Test setup file for Vitest
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@solidjs/testing-library';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Chrome APIs
global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => {
        callback({ overlayActive: false });
      }),
      set: vi.fn((items, callback) => {
        if (callback) callback();
      }),
    },
  },
  scripting: {
    executeScript: vi.fn(),
  },
  tabs: {
    sendMessage: vi.fn(),
  },
  action: {
    onClicked: {
      addListener: vi.fn(),
    },
  },
} as any;

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
})) as any;

// Extend expect with custom matchers if needed
declare module 'vitest' {
  interface Assertion {
    // Add custom matchers here if needed
  }
}
