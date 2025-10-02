# Chess Overlay Extension

A modern Chrome browser extension that provides **real-time visual threat analysis** for chess games on chess.com and lichess.org. Built with **SolidJS** and **Vite** for optimal performance.

## Features

- 🎯 **Real-time Threat Visualization**: Color-coded overlay showing square control
  - **Red**: Squares attacked by enemy pieces
  - **Blue**: Squares controlled by your pieces
  - **Purple**: Contested squares (both sides attacking)
- 🔄 **Live Updates**: MutationObserver automatically updates overlay as pieces move
- ⚡ **Blazing Fast**: Built with SolidJS (~7KB) and Vite for instant performance
- 🌐 **Dual Platform Support**: Works on both chess.com and lichess.org
- 🎨 **Non-intrusive**: Transparent overlay that doesn't interfere with gameplay

## Installation

### Prerequisites

- Node.js 16+ and npm
- Chrome browser (or Chromium-based browser)

### Build from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chess-overlay-extension.git
   cd chess-overlay-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

   The compiled extension will be in the `dist/` directory.

### Load into Chrome

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable **Developer mode** (toggle in top-right corner)

3. Click **"Load unpacked"**

4. Select the `dist/` folder from the project directory

5. The Chess Overlay Extension should now appear in your extensions list

### Verify Installation

- You should see the extension icon in your Chrome toolbar
- Navigate to [chess.com](https://www.chess.com) or [lichess.org](https://lichess.org)
- Click the extension icon to toggle the overlay on/off

## Usage

1. **Start a game** on chess.com or lichess.org

2. **Click the extension icon** in your Chrome toolbar to activate the overlay

3. **View threat analysis**:
   - Red squares: Enemy-controlled
   - Blue squares: Your controlled squares
   - Purple squares: Contested
   - Transparency intensity: Number of attackers

4. **Click "Close Overlay"** button (top-right) or click the extension icon again to deactivate

## Development

### Development Mode

Run Vite in watch mode for hot module reloading:

```bash
npm run dev
```

After making changes, reload the extension in `chrome://extensions/`

### Testing

Run the test suite with:

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

**Test Coverage:**
- Unit tests for chess logic (`BoardDetection.test.ts`)
- Component tests for overlay (`Overlay.test.tsx`)
- Mocked Chrome APIs for testing extension functionality

Coverage reports are generated in the `coverage/` directory.

### Project Structure

```
chess-overlay-extension/
├── src/
│   ├── background.ts          # Service worker for extension
│   ├── content.tsx            # Content script entry point
│   ├── Overlay.tsx            # Main SolidJS overlay component
│   ├── BoardDetection.ts      # Chess board detection logic
│   ├── PiecePosition.ts       # TypeScript interfaces
│   ├── Overlay.test.tsx       # Component tests
│   ├── BoardDetection.test.ts # Unit tests
│   └── test/
│       └── setup.ts           # Test configuration
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD
├── public/
│   └── icons/                 # Extension icons
├── coverage/                  # Test coverage reports
├── dist/                      # Build output (created by Vite)
├── manifest.json              # Chrome extension manifest
├── vite.config.ts             # Vite configuration
├── vitest.config.ts           # Vitest test configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

### Technology Stack

- **Framework**: SolidJS 1.8+ (fine-grained reactivity)
- **Build Tool**: Vite 5+ (lightning-fast builds)
- **Language**: TypeScript 5+
- **Extension Plugin**: @crxjs/vite-plugin 2.0
- **Canvas Rendering**: Native HTML5 Canvas API

## How It Works

### Board Detection

- **chess.com**: Detects pieces via `.piece` class and `square-XY` position classes
- **lichess.org**: Uses Chessground's `piece` elements and CSS transform matrices

### Threat Calculation

1. Scans DOM for all chess pieces on the board
2. Calculates legal attack squares for each piece based on chess rules:
   - Pawns: Diagonal captures
   - Knights: L-shaped moves
   - Bishops: Diagonal rays
   - Rooks: Straight rays
   - Queens: Combined bishop + rook
   - Kings: All adjacent squares
3. Aggregates threats per square (friendly vs enemy)
4. Renders color-coded overlay on HTML5 canvas

### Real-time Updates

A **MutationObserver** watches the chess board DOM for:
- Child element changes (piece additions/removals)
- Class attribute changes (piece movements)
- Automatically triggers recalculation and re-render

## Troubleshooting

### Extension not working

- Ensure you're on chess.com or lichess.org
- Check that the extension is enabled in `chrome://extensions/`
- Refresh the chess page after installing

### Overlay not appearing

- Make sure you're in an active game (not homepage)
- Try toggling the extension off and on
- Check browser console for errors (F12 → Console tab)

### Build errors

- Delete `node_modules/` and `package-lock.json`, then run `npm install` again
- Ensure Node.js version is 16 or higher
- Check that all dependencies are compatible

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. **Add tests** for new functionality
5. Ensure tests pass (`npm run test:run`)
6. Ensure build succeeds (`npm run build`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### CI/CD

The project uses GitHub Actions for continuous integration:
- **Tests** run on Node.js 18.x, 20.x, and 22.x
- **Code coverage** is automatically generated
- **Build verification** ensures extension compiles correctly
- All checks must pass before merging PRs

## License

ISC License

## Acknowledgments

- Chess.com and Lichess.org for their excellent platforms
- SolidJS team for the amazing reactive framework
- Vite team for the blazing-fast build tool
