import React, { useState, useEffect, useCallback } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [editTopText, setEditTopText] = useState('');
  const [editBottomText, setEditBottomText] = useState('');

  const fetchMemes = useCallback(() => {
    fetch('http://localhost:5000/api/memes')
      .then((res) => res.json())
      .then((data) => {
        const sortedMemes = [...data].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        setMemes(sortedMemes);
      })
      .catch((err) => console.error('Erreur lors de la récupération des mèmes:', err));
  }, [sortOrder]); // Dependencies for fetchMemes

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]); // Dependency array includes the memoized fetchMemes

  const handleDeleteAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les mèmes ?')) {
      fetch('http://localhost:5000/api/memes', { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message);
          fetchMemes();
        })
        .catch((err) => console.error('Erreur lors de la suppression des mèmes:', err));
    }
  };

  const handleSelectMeme = (meme) => {
    setSelectedMeme(meme);
    setEditTopText(meme.topText || '');
    setEditBottomText(meme.bottomText || '');
  };

  const handleSaveEdit = () => {
    if (selectedMeme) {
      const formData = new FormData();
      formData.append('topText', editTopText);
      formData.append('bottomText', editBottomText);
      console.log('Sending update for meme', selectedMeme.id, ': topText=', editTopText, ', bottomText=', editBottomText);

      fetch(`http://localhost:5000/api/memes/${selectedMeme.id}`, {
        method: 'PATCH',
        body: formData,
      })
        .then((res) => res.json())
        .then((updatedMeme) => {
          console.log('Updated meme:', updatedMeme);
          setMemes(memes.map(m => m.id === updatedMeme.id ? updatedMeme : m));
          setSelectedMeme(null);
          setEditTopText('');
          setEditBottomText('');
        })
        .catch((err) => console.error('Erreur lors de la mise à jour:', err));
    }
  };

  const handleCancelEdit = () => {
    setSelectedMeme(null);
    setEditTopText('');
    setEditBottomText('');
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Galerie de Mèmes</h2>
      <div className="flex justify-between mb-4">
        <div>
          <button
            onClick={() => setSortOrder('desc')}
            className={`px-4 py-2 mx-1 rounded text-sm font-medium ${
              sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Récent → Ancien
          </button>
          <button
            onClick={() => setSortOrder('asc')}
            className={`px-4 py-2 mx-1 rounded text-sm font-medium ${
              sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Ancien → Récent
          </button>
        </div>
        {memes.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
          >
            Supprimer Tout
          </button>
        )}
      </div>
      {memes.length === 0 ? (
        <p className="text-gray-600">Aucun mème créé pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {memes.map((meme) => (
            <div key={meme.id} className="border p-4 rounded-lg shadow-sm relative">
              <img
                src={meme.imageUrl}
                alt="Mème"
                className="w-full h-auto rounded cursor-pointer"
                onClick={() => handleSelectMeme(meme)}
              />
            </div>
          ))}
        </div>
      )}
      {selectedMeme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Modifier le Mème</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Texte du haut</label>
              <input
                type="text"
                value={editTopText}
                onChange={(e) => setEditTopText(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Texte du bas</label>
              <input
                type="text"
                value={editBottomText}
                onChange={(e) => setEditBottomText(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sauvegarder
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;