const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/leaves.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  const { employeeId, status } = req.query;
  let leaves = readData();

  if (employeeId) {
    leaves = leaves.filter(l => l.employeeId === employeeId);
  }
  if (status && status !== 'all') {
    leaves = leaves.filter(l => l.status === status);
  }

  leaves.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
  res.json(leaves);
});

router.post('/', (req, res) => {
  const leaves = readData();
  const newLeave = {
    id: `lv${uuidv4().slice(0, 6)}`,
    ...req.body,
    appliedOn: new Date().toISOString().split('T')[0],
    status: 'pending',
    approvedBy: null
  };
  leaves.unshift(newLeave);
  writeData(leaves);
  res.status(201).json(newLeave);
});

router.put('/:id/status', (req, res) => {
  const leaves = readData();
  const idx = leaves.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave not found' });
  leaves[idx].status = req.body.status;
  if (req.body.approvedBy) leaves[idx].approvedBy = req.body.approvedBy;
  writeData(leaves);
  res.json(leaves[idx]);
});

module.exports = router;
