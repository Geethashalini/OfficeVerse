const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/announcements.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  const { category, priority, pinned } = req.query;
  let announcements = readData();

  if (category && category !== 'all') {
    announcements = announcements.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
  if (priority && priority !== 'all') {
    announcements = announcements.filter(a => a.priority === priority);
  }
  if (pinned === 'true') {
    announcements = announcements.filter(a => a.pinned);
  }

  announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(announcements);
});

router.get('/categories', (req, res) => {
  const announcements = readData();
  const categories = [...new Set(announcements.map(a => a.category))];
  res.json(categories);
});

router.post('/:id/like', (req, res) => {
  const announcements = readData();
  const idx = announcements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  announcements[idx].likes += 1;
  writeData(announcements);
  res.json({ likes: announcements[idx].likes });
});

router.post('/', (req, res) => {
  const announcements = readData();
  const newAnnouncement = {
    id: `ann${uuidv4().slice(0, 6)}`,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    views: 0,
    likes: 0,
    pinned: req.body.pinned || false
  };
  announcements.unshift(newAnnouncement);
  writeData(announcements);
  res.status(201).json(newAnnouncement);
});

module.exports = router;
