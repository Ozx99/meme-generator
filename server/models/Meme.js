const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meme = sequelize.define('Meme', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topText: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  bottomText: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'memes',
  timestamps: false,
});

module.exports = Meme;