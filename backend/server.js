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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Next-Gen HR Portal API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Next-Gen HR Portal Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
});
