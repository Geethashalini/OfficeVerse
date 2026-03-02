const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/celebrations.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const getDaysUntil = (dateStr) => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const [, month, day] = dateStr.split('-');
  let targetDate = new Date(thisYear, parseInt(month) - 1, parseInt(day));
  if (targetDate < today) {
    targetDate = new Date(thisYear + 1, parseInt(month) - 1, parseInt(day));
  }
  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

router.get('/', (req, res) => {
  const data = readData();
  const birthdays = data.birthdays.map(b => ({ ...b, daysUntil: getDaysUntil(b.date), type: 'birthday' }));
  const anniversaries = data.workAnniversaries.map(a => ({ ...a, daysUntil: getDaysUntil(a.date), type: 'anniversary' }));
  const promotions = data.promotions.map(p => ({ ...p, type: 'promotion' }));

  res.json({ birthdays, anniversaries, promotions });
});

router.get('/upcoming', (req, res) => {
  const data = readData();
  const days = parseInt(req.query.days) || 30;

  const birthdays = data.birthdays
    .map(b => ({ ...b, daysUntil: getDaysUntil(b.date), type: 'birthday' }))
    .filter(b => b.daysUntil <= days)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const anniversaries = data.workAnniversaries
    .map(a => ({ ...a, daysUntil: getDaysUntil(a.date), type: 'anniversary' }))
    .filter(a => a.daysUntil <= days)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const combined = [...birthdays, ...anniversaries].sort((a, b) => a.daysUntil - b.daysUntil);
  res.json(combined);
});

module.exports = router;
