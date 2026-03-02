import { useState, useEffect } from 'react';
import { PartyPopper, Cake, Award, TrendingUp, Calendar } from 'lucide-react';
import { celebrationsAPI } from '../services/api';
import { format, parseISO } from 'date-fns';

function AvatarCircle({ initials, color, size = 'lg' }) {
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-14 h-14 text-base' };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg`}
      style={{ background: color, boxShadow: `0 4px 20px ${color}40` }}
    >
      {initials}
    </div>
  );
}

function DaysChip({ days }) {
  if (days === 0) return <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm px-3 py-1">🎉 Today!</span>;
  if (days === 1) return <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1">Tomorrow</span>;
  if (days <= 7) return <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/20 px-3 py-1">In {days} days</span>;
  return <span className="badge bg-white/5 text-white/40 border border-white/10 px-3 py-1">In {days} days</span>;
}

function BirthdayCard({ person }) {
  return (
    <div className="glass-card p-5 hover:border-white/15 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <AvatarCircle initials={person.avatar} color={person.coverColor} />
          <span className="absolute -bottom-1 -right-1 text-2xl">🎂</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold">{person.employeeName}</h3>
          <p className="text-white/50 text-sm">{person.role} · {person.department}</p>
          <p className="text-white/30 text-xs mt-1">
            {format(parseISO(person.date), 'MMMM d')} · Turning {person.age}
          </p>
        </div>
        <DaysChip days={person.daysUntil} />
      </div>
      <p className="text-white/40 text-sm mt-4 italic border-t border-white/5 pt-3">"{person.message}"</p>
    </div>
  );
}

function AnniversaryCard({ person }) {
  return (
    <div className="glass-card p-5 hover:border-white/15 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="relative">
          <AvatarCircle initials={person.avatar} color={person.coverColor} />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {person.years}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold">{person.employeeName}</h3>
          <p className="text-white/50 text-sm">{person.role} · {person.department}</p>
          <p className="text-amber-400/70 text-xs mt-1 font-medium">🏆 {person.years} Year{person.years > 1 ? 's' : ''} Work Anniversary</p>
        </div>
        <DaysChip days={person.daysUntil} />
      </div>
      <p className="text-white/40 text-sm mt-4 italic border-t border-white/5 pt-3">"{person.message}"</p>
    </div>
  );
}

function PromotionCard({ person }) {
  return (
    <div className="glass-card p-5 ring-1 ring-emerald-500/20 hover:ring-emerald-500/30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="relative">
          <AvatarCircle initials={person.avatar} color={person.coverColor} />
          <span className="absolute -bottom-1 -right-1 text-2xl">🚀</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold">{person.employeeName}</h3>
          <p className="text-white/50 text-sm">{person.department}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-white/30 text-xs line-through">{person.oldRole}</span>
            <TrendingUp size={12} className="text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-400 text-xs font-medium">{person.newRole}</span>
          </div>
        </div>
        <span className="text-white/30 text-xs">{format(parseISO(person.date), 'MMM d')}</span>
      </div>
      <p className="text-white/40 text-sm mt-4 italic border-t border-white/5 pt-3">"{person.message}"</p>
    </div>
  );
}

export default function Celebrations() {
  const [data, setData] = useState({ birthdays: [], anniversaries: [], promotions: [] });
  const [activeTab, setActiveTab] = useState('birthdays');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    celebrationsAPI.getAll().then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'birthdays', label: 'Birthdays', icon: Cake, count: data.birthdays.length, color: 'text-pink-400' },
    { id: 'anniversaries', label: 'Anniversaries', icon: Award, count: data.anniversaries.length, color: 'text-amber-400' },
    { id: 'promotions', label: 'Promotions', icon: TrendingUp, count: data.promotions.length, color: 'text-emerald-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const upcomingSoon = [...data.birthdays, ...data.anniversaries]
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <PartyPopper size={24} className="text-pink-400" />
            Celebrations
          </h1>
          <p className="text-white/40 text-sm mt-1">Honoring milestones and special moments</p>
        </div>
      </div>

      {/* Upcoming Banner */}
      {upcomingSoon.some(c => c.daysUntil <= 7) && (
        <div className="glass-card p-5 border-pink-500/20 bg-pink-500/5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-pink-400" />
            <span className="text-pink-400 font-semibold text-sm">Coming Up Soon</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {upcomingSoon.filter(c => c.daysUntil <= 7).map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: item.coverColor }}
                >
                  {item.avatar}
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">{item.employeeName}</p>
                  <p className="text-white/40 text-xs">{item.type === 'birthday' ? '🎂' : '🎊'} {item.daysUntil === 0 ? 'Today!' : `In ${item.daysUntil} day${item.daysUntil > 1 ? 's' : ''}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white/8 text-white border-b-2 border-primary-500'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? tab.color : ''} />
            {tab.label}
            <span className={`badge text-xs ${activeTab === tab.id ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/30'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === 'birthdays' && data.birthdays.map(b => (
          <BirthdayCard key={b.id} person={b} />
        ))}
        {activeTab === 'anniversaries' && data.anniversaries.map(a => (
          <AnniversaryCard key={a.id} person={a} />
        ))}
        {activeTab === 'promotions' && data.promotions.map(p => (
          <PromotionCard key={p.id} person={p} />
        ))}
      </div>

      {activeTab === 'birthdays' && data.birthdays.length === 0 && (
        <div className="text-center py-12">
          <Cake size={40} className="text-white/15 mx-auto mb-3" />
          <p className="text-white/30">No birthdays to show.</p>
        </div>
      )}
    </div>
  );
}
