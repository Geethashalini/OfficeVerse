import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, PartyPopper, Cake } from 'lucide-react';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────────
   Hook: useBirthdayCountdown
   - birthday: "YYYY-MM-DD" string
   - Updates every second, auto-clears on unmount
───────────────────────────────────────────────────────────── */
export function useBirthdayCountdown(birthday) {
  const compute = useCallback(() => {
    if (!birthday) return null;

    const now = new Date();
    const [, mm, dd] = birthday.split('-').map(Number);

    // Check if TODAY is the birthday (same month + day regardless of time)
    const isTodayBirthday = now.getMonth() === mm - 1 && now.getDate() === dd;

    if (isTodayBirthday) {
      return {
        hours: 0, minutes: 0, seconds: 0, totalSec: 0,
        isBirthday: true, isWithin24h: true,
        isWithin1h: true, isWithin10min: true, isWithin5min: true,
        percentRemaining: 0,
      };
    }

    // Build this year's birthday (midnight)
    let bday = new Date(now.getFullYear(), mm - 1, dd, 0, 0, 0, 0);

    // If birthday midnight already passed this year, use next year
    if (bday <= now) {
      bday = new Date(now.getFullYear() + 1, mm - 1, dd, 0, 0, 0, 0);
    }

    const diffMs   = bday - now;
    const totalSec = Math.max(0, Math.floor(diffMs / 1000));
    const hours    = Math.floor(totalSec / 3600);
    const minutes  = Math.floor((totalSec % 3600) / 60);
    const seconds  = totalSec % 60;

    const isWithin24h   = diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
    const isWithin1h    = diffMs > 0 && diffMs <= 60 * 60 * 1000;
    const isWithin10min = diffMs > 0 && diffMs <= 10 * 60 * 1000;
    const isWithin5min  = diffMs > 0 && diffMs <= 5  * 60 * 1000;

    const percentRemaining = isWithin24h
      ? Math.round((diffMs / (24 * 60 * 60 * 1000)) * 100)
      : 0;

    return {
      hours, minutes, seconds, totalSec,
      isBirthday: false, isWithin24h, isWithin1h, isWithin10min, isWithin5min,
      percentRemaining,
    };
  }, [birthday]);

  const [state, setState] = useState(() => compute());

  useEffect(() => {
    setState(compute());
    const id = setInterval(() => setState(compute()), 1000);
    return () => clearInterval(id);
  }, [compute]);

  return state;
}

/* ─────────────────────────────────────────────────────────────
   Confetti canvas burst
───────────────────────────────────────────────────────────── */
function useConfettiBurst() {
  const fire = useCallback((x, y, count = 100) => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx    = canvas.getContext('2d');
    const colors = ['#f472b6','#fbbf24','#34d399','#818cf8','#fb923c','#60a5fa'];

    const particles = Array.from({ length: count }, () => ({
      x, y,
      vx:   (Math.random() - 0.5) * 14,
      vy:   Math.random() * -16 - 4,
      size: Math.random() * 7 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1, life: 1,
      decay:   Math.random() * 0.02 + 0.012,
      gravity: 0.5,
      rot: Math.random() * 360,
      rs:  (Math.random() - 0.5) * 9,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
        p.rot += p.rs; p.life -= p.decay; p.opacity = Math.max(0, p.life);
        if (p.life <= 0) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        ctx.restore();
      });
      if (alive) requestAnimationFrame(draw);
      else        document.body.removeChild(canvas);
    };
    draw();
  }, []);
  return fire;
}

/* ─────────────────────────────────────────────────────────────
   Circular Progress Ring (SVG)
───────────────────────────────────────────────────────────── */
function ProgressRing({ percent, color }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <motion.circle cx="60" cy="60" r={r} fill="none"
        stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated Digit Block
   - Flips on every value change
───────────────────────────────────────────────────────────── */
function DigitBlock({ value, label, color }) {
  const padded = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            className="absolute text-2xl font-black tabular-nums"
            style={{ color }}
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={  { y:  28, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Birthday Mode — shown when timer hits 00:00:00
───────────────────────────────────────────────────────────── */
function BirthdayModeCard({ name, fire }) {
  const [confettied, setConfettied] = useState(false);

  useEffect(() => {
    // Auto-fire triple burst on mount
    const cx = window.innerWidth / 2, cy = window.innerHeight * 0.35;
    fire(cx, cy, 120);
    setTimeout(() => fire(cx - 120, cy + 40, 80), 300);
    setTimeout(() => fire(cx + 120, cy + 40, 80), 600);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1,    opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="relative overflow-hidden rounded-3xl p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(99,102,241,0.15), rgba(245,158,11,0.1))',
        border:     '1px solid rgba(236,72,153,0.5)',
        boxShadow:  '0 0 50px rgba(236,72,153,0.25), 0 0 80px rgba(99,102,241,0.1)',
      }}
    >
      {/* Animated stars */}
      {['✨','🌟','⭐','💫'].map((s, i) => (
        <motion.span key={i} className="absolute text-lg pointer-events-none"
          style={{ top: `${10 + i * 20}%`, left: `${5 + i * 22}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}>
          {s}
        </motion.span>
      ))}

      <motion.div className="text-6xl mb-3"
        animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        🎂
      </motion.div>

      <motion.h3 className="text-white text-2xl font-black mb-1 tracking-tight"
        style={{ background: 'linear-gradient(135deg, #f472b6, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        🎉 Happy Birthday, {name?.split(' ')[0]}!
      </motion.h3>

      <p className="text-white/55 text-sm mb-5">
        Your team celebrates you today — wishing you an amazing year ahead! 🥳
      </p>

      <motion.button
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          fire(r.left + r.width / 2, r.top, 100);
          setConfettied(true);
          toast('🎉 Woohoo! Celebrate big!', { icon: '🎂' });
        }}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-white mx-auto"
        style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', boxShadow: '0 6px 24px rgba(236,72,153,0.5)' }}
      >
        <PartyPopper size={18} />
        {confettied ? 'More Confetti! 🎊' : '🎊 Celebrate!'}
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main BirthdayCountdownCard
───────────────────────────────────────────────────────────── */
export default function BirthdayCountdownCard({ user }) {
  const countdown   = useBirthdayCountdown(user?.birthday);
  const fire        = useConfettiBurst();
  const [notifyTeam, setNotifyTeam] = useState(false);
  const cardRef     = useRef(null);

  const handleNotify = () => {
    setNotifyTeam(n => !n);
    toast(!notifyTeam
      ? '🔔 Team will be notified on your birthday!'
      : '🔕 Team notification cancelled.'
    );
  };

  // Don't render if birthday not within 24h and not birthday itself
  if (!countdown) return null;
  if (!countdown.isWithin24h && !countdown.isBirthday) return null;

  const { hours, minutes, seconds, percentRemaining,
          isBirthday, isWithin1h, isWithin10min, isWithin5min } = countdown;

  // Dynamic accent color based on urgency
  const accentColor = isWithin5min  ? '#f43f5e'
                    : isWithin10min ? '#f97316'
                    : isWithin1h    ? '#fbbf24'
                    :                 '#ec4899';

  // Border glow: pulsing, intensifies as birthday nears
  const glowIntensity = isWithin5min ? 0.7 : isWithin10min ? 0.5 : isWithin1h ? 0.35 : 0.25;

  // Shake class for < 10 min
  const shouldShake = isWithin10min && !isBirthday;

  if (isBirthday) {
    return (
      <div className="col-span-full">
        <BirthdayModeCard name={user?.name} fire={fire} />
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      style={{
        background: `linear-gradient(135deg, ${accentColor}12, rgba(99,102,241,0.08))`,
        border:     `1.5px solid ${accentColor}${Math.round(glowIntensity * 99).toString(16)}`,
        boxShadow:  `0 0 32px ${accentColor}${Math.round(glowIntensity * 60).toString(16)}, 0 8px 40px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Pulsing glow ring */}
      <motion.div className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{ opacity: [0, glowIntensity * 0.6, 0] }}
        transition={{ duration: isWithin5min ? 1.2 : isWithin10min ? 1.8 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: `inset 0 0 30px ${accentColor}40` }}
      />

      {/* Floating background cake */}
      <motion.span
        className="absolute -right-4 -bottom-4 text-8xl opacity-5 pointer-events-none select-none"
        animate={{ rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        🎂
      </motion.span>

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}35` }}
              animate={isWithin5min
                ? { y: [0, -6, 0], rotate: [0, 10, -10, 0] }
                : { y: [0, -4, 0] }
              }
              transition={{ duration: isWithin5min ? 0.8 : 2.5, repeat: Infinity, ease: 'easeInOut' }}>
              🎂
            </motion.div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Your Birthday is Coming!</p>
              <p className="text-white/40 text-xs mt-0.5">Get ready to celebrate 🎉</p>
            </div>
          </div>

          {/* Urgency badge */}
          <motion.span
            className="badge text-[10px] font-black flex-shrink-0"
            style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}35` }}
            animate={{ scale: isWithin10min ? [1, 1.08, 1] : [1] }}
            transition={{ duration: 1.2, repeat: Infinity }}>
            {isWithin5min  ? '🔥 Almost!' :
             isWithin10min ? '⚡ Very Soon!' :
             isWithin1h    ? '⏰ < 1 Hour' :
                             `🎂 < 24 Hours`}
          </motion.span>
        </div>

        {/* Main timer + ring */}
        <div className="flex items-center justify-between gap-4">

          {/* Circular progress ring */}
          <div className="relative flex-shrink-0">
            <ProgressRing percent={percentRemaining} color={accentColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black tabular-nums" style={{ color: accentColor }}>
                {100 - percentRemaining}%
              </span>
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">elapsed</span>
            </div>
          </div>

          {/* Digit countdown */}
          <div className="flex-1">
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={shouldShake ? {
                x: [0, -4, 4, -3, 3, -2, 2, 0],
              } : {}}
              transition={shouldShake ? { duration: 0.6, repeat: Infinity, repeatDelay: 2 } : {}}
            >
              <DigitBlock value={hours}   label="HRS"  color={accentColor} />
              <span className="text-2xl font-black mb-4" style={{ color: `${accentColor}60` }}>:</span>
              <DigitBlock value={minutes} label="MIN"  color={accentColor} />
              <span className="text-2xl font-black mb-4" style={{ color: `${accentColor}60` }}>:</span>
              <DigitBlock value={seconds} label="SEC"  color={accentColor} />
            </motion.div>

            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full rounded-full"
                animate={{ width: `${100 - percentRemaining}%` }}
                transition={{ duration: 1, ease: 'linear' }}
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`, boxShadow: `0 0 8px ${accentColor}` }}
              />
            </div>
            <p className="text-white/25 text-[10px] text-center mt-1.5 font-medium">
              {100 - percentRemaining}% of 24 hours elapsed
            </p>
          </div>
        </div>

        {/* Tooltip hint */}
        <div className="mt-4 px-3 py-2 rounded-xl text-center"
          style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}18` }}>
          <p className="text-white/50 text-xs italic">
            "Your special day is almost here!" 🥳 Hang tight, {user?.name?.split(' ')[0]}!
          </p>
        </div>

        {/* Notify Team toggle */}
        <div className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            {notifyTeam
              ? <Bell size={13} style={{ color: accentColor }} />
              : <BellOff size={13} className="text-white/30" />
            }
            <span className="text-white/50 text-xs font-medium">Notify Team</span>
            <span className="text-white/25 text-[10px]">(mock)</span>
          </div>
          <button onClick={handleNotify}
            className="relative w-10 h-5 rounded-full transition-all duration-300"
            style={{ background: notifyTeam ? `linear-gradient(135deg, ${accentColor}, #8b5cf6)` : 'rgba(255,255,255,0.1)' }}>
            <motion.span
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
              animate={{ left: notifyTeam ? '22px' : '2px' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
