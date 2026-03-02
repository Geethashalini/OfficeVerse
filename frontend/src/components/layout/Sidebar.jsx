import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Trophy, PartyPopper, BookOpen,
  Megaphone, Heart, Users, MessageSquare, BarChart3,
  CalendarCheck, Zap, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/spotlight', icon: Trophy, label: 'Spotlight', badge: 'New' },
  { path: '/celebrations', icon: PartyPopper, label: 'Celebrations' },
  { path: '/announcements', icon: Megaphone, label: 'Announcements' },
  { path: '/policies', icon: BookOpen, label: 'Policy Hub' },
  { path: '/kudos', icon: Heart, label: 'Kudos Wall' },
  { path: '/directory', icon: Users, label: 'Directory' },
  { path: '/leaves', icon: CalendarCheck, label: 'Leave Tracker' },
  { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-[#0d0c1a] border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">PulseHR</h1>
              <p className="text-white/40 text-xs mt-0.5">Next-Gen Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-widest px-3 mb-3 mt-1">Navigation</p>
          {navItems.map(({ path, icon: Icon, label, badge, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={onClose}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-white/40 group-hover:text-white/60'}`}
                  />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="bg-primary-500/20 text-primary-400 text-xs px-1.5 py-0.5 rounded-full border border-primary-500/20">
                      {badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} className="text-primary-400/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AS
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-sm font-medium truncate">Arjun Sharma</p>
              <p className="text-white/40 text-xs truncate">Senior Engineer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
