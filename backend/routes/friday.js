const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const sugPath  = path.join(__dirname, '../data/friday_suggestions.json');
const pollPath = path.join(__dirname, '../data/friday_polls.json');

const readSug  = () => JSON.parse(fs.readFileSync(sugPath, 'utf8'));
const writeSug = (d) => fs.writeFileSync(sugPath, JSON.stringify(d, null, 2));
const readPoll  = () => JSON.parse(fs.readFileSync(pollPath, 'utf8'));
const writePoll = (d) => fs.writeFileSync(pollPath, JSON.stringify(d, null, 2));

/* ── SUGGESTIONS ───────────────────────────────────────────── */

// GET all suggestions
router.get('/suggestions', (req, res) => {
  const { status, department, search } = req.query;
  let data = readSug();
  if (status && status !== 'all') data = data.filter(s => s.status === status);
  if (department && department !== 'all') data = data.filter(s => s.department === department);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  res.json(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// POST new suggestion
router.post('/suggestions', (req, res) => {
  const data = readSug();
  const newSug = {
    id: `sug${uuidv4().slice(0, 6)}`,
    ...req.body,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  };
  data.unshift(newSug);
  writeSug(data);
  res.status(201).json(newSug);
});

// PATCH suggestion status (approve/reject)
router.patch('/suggestions/:id', (req, res) => {
  const data = readSug();
  const idx = data.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data[idx] = { ...data[idx], ...req.body };
  writeSug(data);
  res.json(data[idx]);
});

// DELETE suggestion
router.delete('/suggestions/:id', (req, res) => {
  let data = readSug();
  data = data.filter(s => s.id !== req.params.id);
  writeSug(data);
  res.json({ ok: true });
});

/* ── POLLS ─────────────────────────────────────────────────── */

// GET all polls
router.get('/polls', (req, res) => {
  const { status } = req.query;
  let data = readPoll();
  if (status && status !== 'all') data = data.filter(p => p.status === status);

  // Auto-close expired polls
  const now = new Date();
  let changed = false;
  data = data.map(p => {
    if (p.status === 'active' && new Date(p.endDate) < now) {
      changed = true;
      const winner = p.games.reduce((best, g) => g.votes > best.votes ? g : best, p.games[0]);
      return { ...p, status: 'closed', winner };
    }
    return p;
  });
  if (changed) writePoll(data);

  res.json(data);
});

// GET active poll
router.get('/polls/active', (req, res) => {
  const data = readPoll();
  const active = data.find(p => p.status === 'active');
  res.json(active || null);
});

// POST create poll
router.post('/polls', (req, res) => {
  const data = readPoll();
  const newPoll = {
    id: `poll${uuidv4().slice(0, 6)}`,
    ...req.body,
    status: 'active',
    totalVotes: 0,
    voters: [],
    winner: null,
    games: req.body.games.map(g => ({ ...g, votes: 0 })),
  };
  data.unshift(newPoll);
  writePoll(data);
  res.status(201).json(newPoll);
});

// POST vote
router.post('/polls/:id/vote', (req, res) => {
  const { suggestionId, voterId } = req.body;
  const data = readPoll();
  const idx = data.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Poll not found' });

  const poll = data[idx];
  if (poll.status !== 'active') return res.status(400).json({ error: 'Poll is not active' });
  if (poll.voters.includes(voterId)) return res.status(400).json({ error: 'Already voted' });

  const gameIdx = poll.games.findIndex(g => g.suggestionId === suggestionId);
  if (gameIdx === -1) return res.status(400).json({ error: 'Invalid game option' });

  poll.games[gameIdx].votes += 1;
  poll.totalVotes += 1;
  poll.voters.push(voterId);
  data[idx] = poll;
  writePoll(data);
  res.json(poll);
});

// PATCH poll status (close / archive / declare winner)
router.patch('/polls/:id', (req, res) => {
  const data = readPoll();
  const idx = data.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  if (req.body.action === 'close') {
    const winner = data[idx].games.reduce((best, g) => g.votes > best.votes ? g : best, data[idx].games[0]);
    data[idx] = { ...data[idx], status: 'closed', winner };
  } else if (req.body.action === 'archive') {
    data[idx] = { ...data[idx], status: 'archived' };
  } else if (req.body.action === 'declare') {
    data[idx] = { ...data[idx], ...req.body.data, status: 'archived' };
  } else {
    data[idx] = { ...data[idx], ...req.body };
  }

  writePoll(data);
  res.json(data[idx]);
});

// DELETE poll
router.delete('/polls/:id', (req, res) => {
  let data = readPoll();
  data = data.filter(p => p.id !== req.params.id);
  writePoll(data);
  res.json({ ok: true });
});

module.exports = router;
