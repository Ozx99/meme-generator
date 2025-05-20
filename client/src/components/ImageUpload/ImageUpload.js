import React, { useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => onImageUpload(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="w-full p-2 border rounded text-gray-800"
        id="image-upload"
        style={{ display: 'none' }}
      />
      <label
        htmlFor="image-upload"
        className="w-full p-2 border rounded text-gray-800 text-center cursor-pointer bg-gray-200 hover:bg-gray-300"
      >
        Télécharger une image
      </label>
    </div>
  );
};

export default ImageUpload;