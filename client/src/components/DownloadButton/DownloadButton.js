import React, { useRef } from 'react';
import './DownloadButton.css';

const DownloadButton = ({ image, topText, bottomText, fontSize, fontFamily, onMemeGenerated }) => {
  const canvasRef = useRef(null);

  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle CORS if needed
    img.src = image || 'https://via.placeholder.com/400x300';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.strokeText(topText, canvas.width / 2, 50);
      ctx.fillText(topText, canvas.width / 2, 50);
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);

      const dataUrl = canvas.toDataURL('image/png');
      const formData = new FormData();
      const blob = dataURLToBlob(dataUrl);
      formData.append('image', blob, 'meme.png');
      formData.append('topText', topText);
      formData.append('bottomText', bottomText);

      fetch('http://localhost:5000/api/memes', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Meme saved:', data);
          onMemeGenerated(data.imageUrl);

          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'meme.png';
          link.click();
        })
        .catch((err) => console.error('Error saving meme:', err));
    };
    img.onerror = () => console.error('Image failed to load:', image);
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={!image}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        Télécharger le Mème
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default DownloadButton;