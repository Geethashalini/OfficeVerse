const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/policies.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

router.get('/', (req, res) => {
  const { category, search, popular } = req.query;
  let policies = readData();

  if (category && category !== 'all') {
    policies = policies.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    policies = policies.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (popular === 'true') {
    policies = policies.filter(p => p.popular);
  }

  res.json(policies);
});

router.get('/categories', (req, res) => {
  const policies = readData();
  const categories = [...new Set(policies.map(p => p.category))];
  res.json(categories);
});

router.get('/:id', (req, res) => {
  const policies = readData();
  const policy = policies.find(p => p.id === req.params.id);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  res.json(policy);
});

module.exports = router;
