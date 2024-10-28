// Check if the script has already been injected
if (!document.getElementById('chess-overlay')) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'chess-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '1000';
  document.body.appendChild(overlay);

  // Example function to shade squares based on a mock threat level
  function shadeSquare(squareId, threatLevel) {
    const square = document.querySelector(`[data-square="${squareId}"]`);
    if (square) {
      const shade = document.createElement('div');
      shade.className = 'threat-shade';
      shade.style.backgroundColor = `rgba(255, 0, 0, ${threatLevel * 0.1})`;
      square.appendChild(shade);
    }
  }

  // Example threat level data
  const mockThreatLevels = { e4: 3, d4: 2, f4: 1 };
  Object.entries(mockThreatLevels).forEach(([squareId, level]) =>
    shadeSquare(squareId, level)
  );
}
