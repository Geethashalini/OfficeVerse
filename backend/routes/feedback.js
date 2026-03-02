const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/feedback.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  const feedback = readData();
  res.json(feedback);
});

router.post('/', (req, res) => {
  const feedback = readData();
  const newFeedback = {
    id: `fb${uuidv4().slice(0, 8)}`,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    status: 'submitted'
  };
  feedback.push(newFeedback);
  writeData(feedback);
  res.status(201).json({ message: 'Feedback submitted successfully!', id: newFeedback.id });
});

module.exports = router;
