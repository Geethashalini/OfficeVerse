import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, PartyPopper, Megaphone, Heart, Users,
  TrendingUp, Star, Calendar, ArrowRight, Zap,
  Bell, Award, Target
} from 'lucide-react';
import { achievementsAPI, celebrationsAPI, announcementsAPI, kudosAPI, analyticsAPI } from '../services/api';
import { format, parseISO } from 'date-fns';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="glass-card p-5 flex items-start gap-4 hover:border-white/15 transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-sm font-medium">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {trend && <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1"><TrendingUp size={11} /> {trend}</p>}
      </div>
    </div>
  );
}

function AvatarCircle({ initials, color, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [kudos, setKudos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.get(),
      achievementsAPI.getAll({ featured: true }),
      celebrationsAPI.getUpcoming(30),
      announcementsAPI.getAll({ pinned: true }),
      kudosAPI.getAll(),
    ]).then(([analyticsData, achData, upcomingData, annoData, kudosData]) => {
      setAnalytics(analyticsData);
      setAchievements(achData.slice(0, 3));
      setUpcoming(upcomingData.slice(0, 4));
      setAnnouncements(annoData.slice(0, 3));
      setKudos(kudosData.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
          <p className="text-white/40 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden glass-card p-6 sm:p-8 hero-gradient">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary-400 font-medium text-sm mb-1">
                {greeting}, Arjun! 👋
              </p>
              <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                Your workspace is <span className="gradient-text">alive today.</span>
              </h2>
              <p className="text-white/50 text-sm max-w-md">
                {format(today, 'EEEE, MMMM d, yyyy')} · {upcoming.length > 0 ? `${upcoming.length} celebration${upcoming.length > 1 ? 's' : ''} coming up` : 'All quiet on the celebration front'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-xl">
              <Zap size={16} className="text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">1,250 pts</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/kudos" className="btn-primary text-sm py-2 px-4">
              <Heart size={16} /> Give Kudos
            </Link>
            <Link to="/spotlight" className="btn-secondary text-sm py-2 px-4">
              <Trophy size={16} /> View Spotlight
            </Link>
          </div>
        </div>

        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-primary-500/5 blur-2xl pointer-events-none"></div>
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full bg-purple-500/10 blur-xl pointer-events-none"></div>
      </div>

      {/* Stats Row */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Employees" value={analytics.overview.totalEmployees} color="#6366f1" trend="2 joined this month" />
          <StatCard icon={Trophy} label="Achievements" value={analytics.overview.totalAchievements} color="#f59e0b" trend="3 this quarter" />
          <StatCard icon={Heart} label="Kudos Sent" value={analytics.overview.totalKudos} color="#ec4899" trend="Active recognition" />
          <StatCard icon={Star} label="Engagement" value={`${analytics.overview.engagementScore}`} color="#10b981" trend="High momentum" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Achievements */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" />
              <h3 className="text-white font-semibold">Featured Achievements</h3>
            </div>
            <Link to="/spotlight" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-all border border-white/5 hover:border-white/10">
                <AvatarCircle initials={ach.avatar} color={ach.coverColor} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{ach.employeeName}</p>
                      <p className="text-white/70 text-sm mt-0.5 line-clamp-2">{ach.title}</p>
                    </div>
                    <span className="text-2xl flex-shrink-0">{ach.badge}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge bg-white/5 text-white/40 border border-white/10">{ach.category}</span>
                    <span className="text-white/30 text-xs">{ach.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Celebrations */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <PartyPopper size={18} className="text-pink-400" />
              <h3 className="text-white font-semibold">Upcoming</h3>
            </div>
            <Link to="/celebrations" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all border border-white/5">
                <AvatarCircle initials={item.avatar} color={item.coverColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{item.employeeName}</p>
                  <p className="text-white/40 text-xs">
                    {item.type === 'birthday' ? '🎂 Birthday' : `🎊 ${item.years}yr Anniversary`}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  item.daysUntil === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                  item.daysUntil <= 3 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-white/5 text-white/40'
                }`}>
                  {item.daysUntil === 0 ? 'Today!' : `${item.daysUntil}d`}
                </span>
              </div>
            )) : (
              <p className="text-white/30 text-sm text-center py-4">No upcoming celebrations</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-blue-400" />
              <h3 className="text-white font-semibold">Pinned Announcements</h3>
            </div>
            <Link to="/announcements" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 cursor-pointer">
                <div className="flex items-start gap-3">
                  <Bell size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm font-medium line-clamp-2">{ann.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${ann.categoryColor}20`, color: ann.categoryColor }}
                      >
                        {ann.category}
                      </span>
                      <span className="text-white/30 text-xs">{format(parseISO(ann.date), 'MMM d')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Kudos */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-pink-400" />
              <h3 className="text-white font-semibold">Recent Kudos</h3>
            </div>
            <Link to="/kudos" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {kudos.map((kudo) => (
              <div key={kudo.id} className="p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-all border border-white/5 hover:border-white/10">
                <div className="flex items-start gap-3">
                  <AvatarCircle initials={kudo.fromAvatar} color={kudo.fromColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white/60 text-xs mb-1">
                      <span className="text-white/80 font-medium">{kudo.fromName}</span>
                      {' → '}
                      <span className="text-white/80 font-medium">{kudo.toName}</span>
                    </p>
                    <p className="text-white/50 text-xs line-clamp-2">{kudo.message}</p>
                    <span className="inline-block mt-1.5 text-xs font-medium" style={{ color: kudo.badgeColor }}>
                      {kudo.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
