const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/achievements.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  const { category, department, featured } = req.query;
  let achievements = readData();

  if (category && category !== 'all') {
    achievements = achievements.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
  if (department && department !== 'all') {
    achievements = achievements.filter(a => a.department.toLowerCase() === department.toLowerCase());
  }
  if (featured === 'true') {
    achievements = achievements.filter(a => a.featured);
  }

  achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(achievements);
});

router.get('/categories', (req, res) => {
  const achievements = readData();
  const categories = [...new Set(achievements.map(a => a.category))];
  res.json(categories);
});

router.post('/:id/like', (req, res) => {
  const achievements = readData();
  const idx = achievements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Achievement not found' });
  achievements[idx].likes += 1;
  writeData(achievements);
  res.json({ likes: achievements[idx].likes });
});

module.exports = router;
