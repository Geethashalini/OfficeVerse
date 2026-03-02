import { useState, useEffect } from 'react';
import { Trophy, Heart, Filter, Star, Award } from 'lucide-react';
import { achievementsAPI } from '../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'Innovation', 'Leadership', 'Excellence', 'Technical Excellence', 'Business Impact', 'Culture', 'Community'];

function AvatarCircle({ initials, color }) {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

function AchievementCard({ achievement, onLike }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(achievement.likes);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await achievementsAPI.like(achievement.id);
      setLikes(res.likes);
      setLiked(true);
      toast.success('Liked! 👏');
    } catch {
      toast.error('Could not like. Try again.');
    }
  };

  return (
    <div className={`glass-card overflow-hidden hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 ${achievement.featured ? 'ring-1 ring-primary-500/20' : ''}`}>
      {achievement.featured && (
        <div className="flex items-center gap-2 px-5 py-2 bg-primary-500/10 border-b border-primary-500/15">
          <Star size={12} className="text-primary-400" />
          <span className="text-primary-400 text-xs font-semibold tracking-wide uppercase">Featured</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <AvatarCircle initials={achievement.avatar} color={achievement.coverColor} />
            <span className="absolute -bottom-1 -right-1 text-xl">{achievement.badge}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base leading-snug">{achievement.title}</h3>
            <p className="text-white/50 text-sm mt-0.5">{achievement.employeeName} · {achievement.department}</p>
          </div>
        </div>

        <p className="text-white/60 text-sm mt-4 leading-relaxed line-clamp-3">{achievement.description}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span
              className="badge text-xs"
              style={{
                background: `${achievement.badgeColor}15`,
                color: achievement.badgeColor,
                border: `1px solid ${achievement.badgeColor}30`
              }}
            >
              {achievement.category}
            </span>
            <span className="text-white/30 text-xs">{format(parseISO(achievement.date), 'MMM d, yyyy')}</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all duration-200 ${
              liked
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/20'
                : 'bg-white/5 text-white/40 hover:text-pink-400 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/20'
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

export default function Spotlight() {
  const [achievements, setAchievements] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'all' ? { category: activeCategory } : {};
      const data = await achievementsAPI.getAll(params);
      setAchievements(data);
    } catch {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAchievements(); }, [activeCategory]);

  const featured = achievements.filter(a => a.featured);
  const rest = achievements.filter(a => !a.featured);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Trophy size={24} className="text-amber-400" />
            Employee Spotlight
          </h1>
          <p className="text-white/40 text-sm mt-1">{achievements.length} achievements and counting</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Featured Section */}
          {featured.length > 0 && activeCategory === 'all' && (
            <div>
              <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star size={14} className="text-primary-400" /> Featured Recognitions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map(ach => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </div>
          )}

          {/* All achievements or filtered */}
          {(activeCategory !== 'all' ? achievements : rest).length > 0 && (
            <div>
              {activeCategory === 'all' && (
                <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award size={14} className="text-white/40" /> All Recognitions
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(activeCategory !== 'all' ? achievements : rest).map(ach => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </div>
          )}

          {achievements.length === 0 && (
            <div className="text-center py-16">
              <Trophy size={40} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30">No achievements in this category yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
