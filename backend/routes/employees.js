const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/employees.json');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  const { department, search } = req.query;
  let employees = readData();

  if (department && department !== 'all') {
    employees = employees.filter(e => e.department.toLowerCase() === department.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    employees = employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.skills.some(s => s.toLowerCase().includes(q)) ||
      e.department.toLowerCase().includes(q)
    );
  }

  res.json(employees);
});

router.get('/departments', (req, res) => {
  const employees = readData();
  const departments = [...new Set(employees.map(e => e.department))];
  res.json(departments);
});

router.get('/:id', (req, res) => {
  const employees = readData();
  const employee = employees.find(e => e.id === req.params.id);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  res.json(employee);
});

router.put('/:id', (req, res) => {
  const employees = readData();
  const idx = employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });
  employees[idx] = { ...employees[idx], ...req.body };
  writeData(employees);
  res.json(employees[idx]);
});

module.exports = router;
