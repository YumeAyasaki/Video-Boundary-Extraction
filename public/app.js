const fileInput = document.getElementById('video-input');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fileURL = URL.createObjectURL(file);
  video.src = fileURL;
});

video.addEventListener('play', function() {
    const interval = setInterval(function() {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }, 1000 / 30);
  });
  
video.addEventListener('pause', function() {
    clearInterval(interval);
});

video.addEventListener('timeupdate', function() {
    const time = video.currentTime;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});