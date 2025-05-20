import React, { useRef, useEffect, useState } from 'react';
import './ShareButton.css';

const ShareButton = ({ image, topText, bottomText, fontSize, fontFamily, onMemeGenerated }) => {
  const canvasRef = useRef(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image || 'https://via.placeholder.com/400x300';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
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
        setIsCanvasReady(true);
      };
      img.onerror = () => console.error('Image failed to load:', image);
    }
  }, [image, topText, bottomText, fontSize, fontFamily]);

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !isCanvasReady) {
      alert('Le mème n\'est pas prêt à être partagé. Veuillez réessayer.');
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const ctx = canvas.getContext('2d');
    const dataUrl = canvas.toDataURL('image/png');
    const formData = new FormData();
    const blob = dataURLToBlob(dataUrl);
    formData.append('image', blob, 'meme.png');
    formData.append('topText', topText);
    formData.append('bottomText', bottomText);

    try {
      const res = await fetch('http://localhost:5000/api/memes', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Meme saved:', data);
      onMemeGenerated(data.imageUrl);

      if (navigator.clipboard && data.imageUrl) {
        await navigator.clipboard.writeText(data.imageUrl);
        alert('Lien copié dans le presse-papiers !');
      } else {
        alert('Partage non pris en charge. Lien : ' + data.imageUrl);
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
      alert('Une erreur s\'est produite lors du partage.');
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!image || !isCanvasReady}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
    >
      Partager le Mème
    </button>
  );
};

export default ShareButton;