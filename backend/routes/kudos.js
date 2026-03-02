const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/kudos.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  const { employeeId, category } = req.query;
  let kudos = readData();

  if (employeeId) {
    kudos = kudos.filter(k => k.toId === employeeId || k.fromId === employeeId);
  }
  if (category && category !== 'all') {
    kudos = kudos.filter(k => k.category.toLowerCase() === category.toLowerCase());
  }

  kudos.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(kudos);
});

router.post('/', (req, res) => {
  const kudos = readData();
  const newKudo = {
    id: `kud${uuidv4().slice(0, 6)}`,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    points: req.body.points || 100
  };
  kudos.unshift(newKudo);
  writeData(kudos);
  res.status(201).json(newKudo);
});

router.post('/:id/like', (req, res) => {
  const kudos = readData();
  const idx = kudos.findIndex(k => k.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  kudos[idx].likes += 1;
  writeData(kudos);
  res.json({ likes: kudos[idx].likes });
});

router.get('/leaderboard', (req, res) => {
  const kudos = readData();
  const pointsMap = {};

  kudos.forEach(k => {
    if (!pointsMap[k.toId]) {
      pointsMap[k.toId] = { id: k.toId, name: k.toName, avatar: k.toAvatar, color: k.toColor, points: 0, kudosReceived: 0 };
    }
    pointsMap[k.toId].points += k.points;
    pointsMap[k.toId].kudosReceived += 1;
  });

  const leaderboard = Object.values(pointsMap).sort((a, b) => b.points - a.points);
  res.json(leaderboard);
});

module.exports = router;
