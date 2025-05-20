import React, { useEffect, useRef } from 'react';
import './MemePreview.css';

const MemePreview = ({ image, topText, bottomText, fontSize, fontFamily }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
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

      // Top text
      ctx.strokeText(topText, canvas.width / 2, 50);
      ctx.fillText(topText, canvas.width / 2, 50);

      // Bottom text
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    };
  }, [image, topText, bottomText, fontSize, fontFamily]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-md"></canvas>
    </div>
  );
};

export default MemePreview;