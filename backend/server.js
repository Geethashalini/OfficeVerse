const express = require('express');
const cors = require('cors');
const path = require('path');

const employeesRouter = require('./routes/employees');
const achievementsRouter = require('./routes/achievements');
const celebrationsRouter = require('./routes/celebrations');
const policiesRouter = require('./routes/policies');
const announcementsRouter = require('./routes/announcements');
const kudosRouter = require('./routes/kudos');
const feedbackRouter = require('./routes/feedback');
const leavesRouter = require('./routes/leaves');
const analyticsRouter = require('./routes/analytics');
const pulseRouter = require('./routes/pulse');
const projectsRouter = require('./routes/projects');
const journeysRouter = require('./routes/journeys');
const fridayRouter   = require('./routes/friday');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeesRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/celebrations', celebrationsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/kudos', kudosRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/pulse', pulseRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/journeys', journeysRouter);
app.use('/api/friday',  fridayRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OfficeVerse API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🌌 OfficeVerse Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
});
