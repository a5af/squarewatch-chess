// Check if the overlay already exists to avoid duplicate overlays
if (!document.getElementById('test-overlay')) {
  // Create the overlay element
  const overlay = document.createElement('div');
  overlay.id = 'test-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 50% translucent black
  overlay.style.zIndex = '1000';
  overlay.style.pointerEvents = 'none'; // So it doesn’t interfere with clicks
  document.body.appendChild(overlay);
}
