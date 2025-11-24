// Mock DOM APIs for testing
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn().mockImplementation((cb) => setTimeout(cb, 16))
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn().mockImplementation((id) => clearTimeout(id))
});

// Mock Canvas API
const mockCanvasContext = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  createPattern: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  }))
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvasContext);

// Mock Image
global.Image = jest.fn(() => ({
  src: '',
  onload: null,
  onerror: null,
  width: 0,
  height: 0,
  complete: true
}));

// Mock Audio
global.Audio = jest.fn(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn(),
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false
}));