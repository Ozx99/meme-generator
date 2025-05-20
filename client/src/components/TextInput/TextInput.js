import React from 'react';
import './TextInput.css';

const TextInput = ({ onTopTextChange, onBottomTextChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Texte du haut"
          onChange={(e) => onTopTextChange(e.target.value)}
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Texte du bas"
          onChange={(e) => onBottomTextChange(e.target.value)}
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>
    </div>
  );
};

export default TextInput;