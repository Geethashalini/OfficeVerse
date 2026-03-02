import { useState, useEffect } from 'react';
import { Heart, Trophy, Plus, X, Send, Star } from 'lucide-react';
import { kudosAPI, employeesAPI } from '../services/api';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const BADGES = [
  { label: '🦸 Hero', value: '🦸 Hero', color: '#f59e0b' },
  { label: '🚀 Innovator', value: '🚀 Innovator', color: '#6366f1' },
  { label: '⭐ Star', value: '⭐ Star', color: '#ec4899' },
  { label: '🌟 Mentor', value: '🌟 Mentor', color: '#8b5cf6' },
  { label: '💡 Insights', value: '💡 Insights', color: '#10b981' },
  { label: '❤️ Culture', value: '❤️ Culture', color: '#ef4444' },
  { label: '🎯 Impact', value: '🎯 Impact', color: '#a855f7' },
  { label: '⚡ Rising Star', value: '⚡ Rising Star', color: '#f59e0b' },
];

const CATEGORIES = ['Problem Solving', 'Innovation', 'Excellence', 'Business Impact', 'Culture Building', 'Mentorship', 'Growth', 'Teamwork'];

function KudoCard({ kudo }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(kudo.likes);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await kudosAPI.like(kudo.id);
      setLikes(res.likes);
      setLiked(true);
    } catch {
      toast.error('Failed to like');
    }
  };

  return (
    <div className="glass-card p-5 hover:border-white/15 transition-all duration-300">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: kudo.fromColor }}
        >
          {kudo.fromAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <span className="text-white font-semibold">{kudo.fromName}</span>
            <span className="text-white/30">→</span>
            <span className="text-white font-semibold">{kudo.toName}</span>
          </div>
          <p className="text-white/30 text-xs mt-0.5">
            {formatDistanceToNow(parseISO(kudo.date), { addSuffix: true })}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span
            className="badge text-xs px-2.5 py-1 font-semibold"
            style={{ background: `${kudo.badgeColor}20`, color: kudo.badgeColor, border: `1px solid ${kudo.badgeColor}30` }}
          >
            {kudo.badge}
          </span>
        </div>
      </div>

      <div className="bg-white/3 rounded-xl p-3 border border-white/5">
        <p className="text-white/70 text-sm leading-relaxed italic">"{kudo.message}"</p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="badge bg-white/5 text-white/30 border border-white/8 text-xs">{kudo.category}</span>
        <div className="flex items-center gap-3">
          <span className="text-primary-400 text-xs font-medium">+{kudo.points} pts</span>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition-all ${
              liked ? 'text-pink-400' : 'text-white/30 hover:text-pink-400'
            }`}
          >
            <Heart size={14} className={liked ? 'fill-current' : ''} />
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function GiveKudosModal({ employees, onClose, onSubmit }) {
  const [form, setForm] = useState({
    toId: '',
    message: '',
    badge: '',
    badgeColor: '',
    category: '',
    points: 100,
  });

  const selectedEmployee = employees.find(e => e.id === form.toId);
  const selectedBadge = BADGES.find(b => b.value === form.badge);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.toId || !form.message || !form.badge || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    const selectedEmp = employees.find(e => e.id === form.toId);
    try {
      await onSubmit({
        fromId: 'emp001',
        fromName: 'Arjun Sharma',
        fromAvatar: 'AS',
        fromColor: '#6366f1',
        toId: selectedEmp.id,
        toName: selectedEmp.name,
        toAvatar: selectedEmp.avatar,
        toColor: selectedEmp.coverColor,
        message: form.message,
        badge: form.badge,
        badgeColor: form.badgeColor,
        category: form.category,
        points: form.points,
      });
    } catch {
      toast.error('Failed to send kudos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-pink-400" />
            <h2 className="text-white font-bold">Give Kudos</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Recognize *</label>
            <select
              value={form.toId}
              onChange={e => setForm(f => ({ ...f, toId: e.target.value }))}
              className="input-field"
              required
            >
              <option value="" disabled>Select a colleague...</option>
              {employees.filter(e => e.id !== 'emp001').map(e => (
                <option key={e.id} value={e.id}>{e.name} — {e.role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Badge *</label>
            <div className="grid grid-cols-2 gap-2">
              {BADGES.map(badge => (
                <button
                  key={badge.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, badge: badge.value, badgeColor: badge.color }))}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border text-left ${
                    form.badge === badge.value
                      ? 'border-opacity-50 bg-opacity-20'
                      : 'border-white/8 bg-white/3 text-white/60 hover:bg-white/6'
                  }`}
                  style={form.badge === badge.value ? {
                    background: `${badge.color}20`,
                    borderColor: `${badge.color}50`,
                    color: badge.color
                  } : {}}
                >
                  {badge.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Category *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.category === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Your message *</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Tell them why they're awesome..."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Points</label>
            <div className="flex gap-2">
              {[50, 75, 100, 150].map(pts => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, points: pts }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    form.points === pts
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  +{pts}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              <Send size={16} /> Send Kudos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Kudos() {
  const [kudos, setKudos] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kudosData, leaderData, empData] = await Promise.all([
        kudosAPI.getAll(),
        kudosAPI.getLeaderboard(),
        employeesAPI.getAll(),
      ]);
      setKudos(kudosData);
      setLeaderboard(leaderData);
      setEmployees(empData);
    } catch {
      toast.error('Failed to load kudos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data) => {
    await kudosAPI.create(data);
    toast.success('🎉 Kudos sent!');
    setShowModal(false);
    fetchData();
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Heart size={24} className="text-pink-400" />
            Kudos Wall
          </h1>
          <p className="text-white/40 text-sm mt-1">Spread appreciation. Recognize greatness.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Give Kudos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kudos Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Recent Appreciations</h2>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            kudos.map(kudo => <KudoCard key={kudo.id} kudo={kudo} />)
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Recognition Leaderboard</h2>
          <div className="glass-card p-5">
            <div className="space-y-3">
              {leaderboard.map((person, idx) => (
                <div key={person.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${idx === 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/3'}`}>
                  <span className="text-xl w-7 text-center flex-shrink-0">
                    {medals[idx] || `${idx + 1}`}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: person.color }}
                  >
                    {person.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate">{person.name}</p>
                    <p className="text-white/30 text-xs">{person.kudosReceived} kudos</p>
                  </div>
                  <span className="text-primary-400 text-sm font-bold">{person.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <GiveKudosModal
          employees={employees}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
