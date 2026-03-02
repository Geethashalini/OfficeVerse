const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, `../data/${file}`), 'utf8'));

router.get('/', (req, res) => {
  const employees = readJSON('employees.json');
  const achievements = readJSON('achievements.json');
  const kudos = readJSON('kudos.json');
  const announcements = readJSON('announcements.json');
  const leaves = readJSON('leaves.json');
  const celebrations = readJSON('celebrations.json');

  const deptDistribution = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  const kudosByCategory = kudos.reduce((acc, k) => {
    acc[k.category] = (acc[k.category] || 0) + 1;
    return acc;
  }, {});

  const totalKudosPoints = kudos.reduce((sum, k) => sum + k.points, 0);

  const achievementsByDept = achievements.reduce((acc, a) => {
    acc[a.department] = (acc[a.department] || 0) + 1;
    return acc;
  }, {});

  const leavesByStatus = leaves.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const engagementScore = Math.round(
    (announcements.reduce((s, a) => s + a.likes, 0) +
      kudos.reduce((s, k) => s + k.likes, 0) +
      achievements.reduce((s, a) => s + a.likes, 0)) / 3
  );

  const topRecognized = kudos.reduce((acc, k) => {
    if (!acc[k.toId]) acc[k.toId] = { name: k.toName, avatar: k.toAvatar, color: k.toColor, count: 0 };
    acc[k.toId].count += 1;
    return acc;
  }, {});

  res.json({
    overview: {
      totalEmployees: employees.length,
      totalAchievements: achievements.length,
      totalKudos: kudos.length,
      totalKudosPoints,
      totalAnnouncements: announcements.length,
      engagementScore,
      upcomingBirthdays: celebrations.birthdays.length,
      upcomingAnniversaries: celebrations.workAnniversaries.length,
    },
    deptDistribution,
    kudosByCategory,
    achievementsByDept,
    leavesByStatus,
    topRecognized: Object.values(topRecognized).sort((a, b) => b.count - a.count).slice(0, 5),
    monthlyEngagement: [
      { month: 'Oct', kudos: 12, achievements: 3, announcements: 5 },
      { month: 'Nov', kudos: 18, achievements: 4, announcements: 7 },
      { month: 'Dec', kudos: 24, achievements: 5, announcements: 9 },
      { month: 'Jan', kudos: 20, achievements: 4, announcements: 6 },
      { month: 'Feb', kudos: kudos.length, achievements: achievements.length, announcements: announcements.length },
    ]
  });
});

module.exports = router;
