import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, X } from 'lucide-react';

const routeLabels = {
  '/': 'Dashboard',
  '/spotlight': 'Employee Spotlight',
  '/celebrations': 'Celebrations',
  '/announcements': 'Announcements',
  '/policies': 'Policy Hub',
  '/kudos': 'Kudos Wall',
  '/directory': 'Employee Directory',
  '/leaves': 'Leave Tracker',
  '/feedback': 'Feedback',
  '/analytics': 'Analytics',
};

const routeSubtitles = {
  '/': 'Welcome back, Arjun! Here\'s what\'s happening today.',
  '/spotlight': 'Recognizing our outstanding employees.',
  '/celebrations': 'Birthdays, anniversaries & milestones.',
  '/announcements': 'Stay in the loop with company updates.',
  '/policies': 'Everything you need, organized and searchable.',
  '/kudos': 'Spread appreciation across the team.',
  '/directory': 'Find and connect with your colleagues.',
  '/leaves': 'Manage and track time-off requests.',
  '/feedback': 'Your voice matters. Share it here.',
  '/analytics': 'Insights on engagement and culture.',
};

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [notifications] = useState(3);

  const title = routeLabels[location.pathname] || 'PulseHR';
  const subtitle = routeSubtitles[location.pathname] || '';

  return (
    <header className="sticky top-0 z-10 bg-[#0f0e17]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <Menu size={22} />
          </button>
          <div>
            <h2 className="text-white font-bold text-xl leading-tight">{title}</h2>
            {subtitle && <p className="text-white/40 text-sm mt-0.5 hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Search anything..."
                className="input-field w-48 sm:w-64 py-2 text-sm"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Search size={20} />
            </button>
          )}

          <button className="relative text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-[#0f0e17]"></span>
            )}
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
