import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload/ImageUpload';
import TextInput from './components/TextInput/TextInput';
import MemePreview from './components/MemePreview/MemePreview';
import DownloadButton from './components/DownloadButton/DownloadButton';
import ShareButton from './components/ShareButton/ShareButton';
import Gallery from './components/Gallery/Gallery';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [memeUrl, setMemeUrl] = useState(''); // Kept for onMemeGenerated callback
  const [activeTab, setActiveTab] = useState('create');
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleImageUpload = (img) => {
    setImage(img);
    setTopText('');
    setBottomText('');
  };
  const handleMemeGenerated = (url) => {
    console.log('Generated meme URL:', url);
    setMemeUrl(url);
  };
  const handleClear = () => {
    setTopText('');
    setBottomText('');
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Générateur de Mèmes</h1>
      
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 mx-2 rounded-t-lg text-lg font-semibold ${
            activeTab === 'create' ? 'bg-white text-gray-800 border-b-2 border-blue-500' : 'bg-gray-200 text-gray-600'
          }`}
        >
          Créer un Mème
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 mx-2 rounded-t-lg text-lg font-semibold ${
            activeTab === 'gallery' ? 'bg-white text-gray-800 border-b-2 border-blue-500' : 'bg-gray-200 text-gray-600'
          }`}
        >
          Galerie
        </button>
      </div>

      {/* Content */}
      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Image</h2>
            <ImageUpload onImageUpload={handleImageUpload} />
            <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Texte du haut</h2>
            <TextInput onTopTextChange={setTopText} onBottomTextChange={setBottomText} />
            <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Texte du bas</h2>
            
            {/* Font Size Slider */}
            <div className="mt-6">
              <label className="block text-lg font-medium mb-2 text-gray-800">Taille du texte: {fontSize}px</label>
              <input
                type="range"
                min="20"
                max="80"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Font Family Selector */}
            <div className="mt-4">
              <label className="block text-lg font-medium mb-2 text-gray-800">Police</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 border rounded text-gray-800"
              >
                <option value="Arial">Arial</option>
                <option value="Impact">Impact</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div className="flex space-x-4 mt-6">
              <DownloadButton
                image={image}
                topText={topText}
                bottomText={bottomText}
                fontSize={fontSize}
                fontFamily={fontFamily}
                onMemeGenerated={handleMemeGenerated}
              />
              <ShareButton
                image={image}
                topText={topText}
                bottomText={bottomText}
                fontSize={fontSize}
                fontFamily={fontFamily}
                onMemeGenerated={handleMemeGenerated}
              />
              <button
                onClick={handleClear}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Effacer
              </button>
            </div>
            {memeUrl && <p className="mt-4 text-gray-600">Dernier URL généré : {memeUrl}</p>} {/* Use memeUrl */}
          </div>
          <MemePreview
            image={image}
            topText={topText}
            bottomText={bottomText}
            fontSize={fontSize}
            fontFamily={fontFamily}
          />
        </div>
      ) : (
        <Gallery />
      )}
    </div>
  );
};

export default App;