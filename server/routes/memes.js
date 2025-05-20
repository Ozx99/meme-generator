const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Meme = require('../models/Meme');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /api/memes - Save a new meme
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { topText, bottomText } = req.body;
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const meme = await Meme.create({ imageUrl, topText, bottomText });
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/memes - Retrieve all memes
router.get('/', async (req, res) => {
  try {
    const memes = await Meme.findAll();
    res.json(memes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/memes - Delete all memes
router.delete('/', async (req, res) => {
  try {
    const memes = await Meme.findAll();
    await Meme.destroy({ where: {}, truncate: true });
    for (const meme of memes) {
      const fileName = meme.imageUrl.split('/').pop();
      const filePath = path.join(__dirname, '../uploads', fileName);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }
    res.json({ message: 'All memes deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/memes/:id - Update a meme
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { topText, bottomText } = req.body;
    const meme = await Meme.findByPk(id);
    if (!meme) {
      return res.status(404).json({ error: 'Mème non trouvé' });
    }

    if (req.file) {
      const oldFileName = meme.imageUrl.split('/').pop();
      const oldFilePath = path.join(__dirname, '../uploads', oldFileName);
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.error('Error deleting old file ${oldFilePath}:', err);
      }
      meme.imageUrl = '[invalid url, do not cite]'
    }

    if (topText !== undefined) meme.topText = topText;
    if (bottomText !== undefined) meme.bottomText = bottomText;
    await meme.save();

    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;