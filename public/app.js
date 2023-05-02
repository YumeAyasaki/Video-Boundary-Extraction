const fileInput = document.getElementById('video-input');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let requestId;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fileURL = URL.createObjectURL(file);
  video.src = fileURL;
});

video.addEventListener('play', function() {
  requestId = requestAnimationFrame(updateCanvas);
});
  
video.addEventListener('pause', function() {
  cancelAnimationFrame(requestId);
});

video.addEventListener('timeupdate', function() {
  const time = video.currentTime;
  updateCanvas();
});

function updateCanvas() {
  // Check if the video has ended
  if (video.paused || video.ended) {
    return;
  }

  // Extract a frame from the video at the current time
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Apply Sobel edge detection to the extracted frame
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const sobelData = sobel(imageData.data, canvas.width, canvas.height);
  const sobelImageData = new ImageData(canvas.width, canvas.height);

  for (let i = 0; i < sobelData.length; i++) {
    sobelImageData.data[i * 4] = sobelData[i];
    sobelImageData.data[i * 4 + 1] = sobelData[i];
    sobelImageData.data[i * 4 + 2] = sobelData[i];
    sobelImageData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(sobelImageData, 0, 0);

  // Request the next animation frame
  requestId = requestAnimationFrame(updateCanvas);
}

function sobel(pixels, width, height) {
  const grayscale = new Uint8ClampedArray(width * height);

  // Convert the pixels to grayscale
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  const sobelData = new Uint8ClampedArray(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = y * width + x;
      let sumX = 0;
      let sumY = 0;

      for (let i = 0; i < 9; i++) {
        const pixelIndex = (y + i % 3 - 1) * width + (x + Math.floor(i / 3) - 1);
        const pixelValue = grayscale[pixelIndex];
        sumX += pixelValue * sobelX[i];
        sumY += pixelValue * sobelY[i];
      }

      const magnitude = Math.sqrt(sumX ** 2 + sumY ** 2);
      sobelData[index] = magnitude > 127 ? 255 : 0;
    }
  }

  return sobelData;
}