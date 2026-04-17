import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { theme } from '../styles/theme';
import { CSSProperties, useState } from 'react';

const floatingEmojis = ['🎂', '🎁', '🎈', '🎉', '🎊', '✨', '🌟', '💫', '🥳', '🎶'];

function FloatingEmoji({ emoji, delay, x }: { emoji: string; delay: number; x: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        fontSize: '2rem',
        left: `${x}%`,
        bottom: '-40px',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      animate={{
        y: [0, -window.innerHeight - 100],
        x: [0, Math.sin(delay) * 80],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {emoji}
    </motion.div>
  );
}

export default function WelcomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const resetGame = useGameStore((s) => s.resetGame);
  const questions = useAdminStore((s) => s.questions);
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      emoji: floatingEmojis[i % floatingEmojis.length],
      delay: i * 0.6,
      x: Math.random() * 100,
    }))
  );

  const handleStart = () => {
    resetGame(questions.length || 15);
  };

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem',
  };

  const titleStyle: CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldLight}, #fff, ${theme.colors.gold})`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    lineHeight: 1.3,
    marginBottom: '0.5rem',
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: theme.fonts.body,
    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
    color: theme.colors.textSecondary,
    marginBottom: '3rem',
  };

  const buttonStyle: CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
    background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldDark})`,
    color: '#1a0a2e',
    border: 'none',
    borderRadius: theme.borderRadius.pill,
    padding: '1rem 3rem',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
  };

  const adminLinkStyle: CSSProperties = {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    color: theme.colors.textSecondary,
    background: `${theme.colors.cardBg}88`,
    border: 'none',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'opacity 0.2s',
    zIndex: 1,
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {particles.map((p, i) => (
        <FloatingEmoji key={i} {...p} />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        style={{ zIndex: 1, textAlign: 'center' }}
      >
        <motion.div
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🍍
        </motion.div>

        <h1 style={titleStyle}>מי רוצה להיות מיליונויה</h1>
        <p style={subtitleStyle}>המשחק הגדול מתחיל עכשיו</p>
      </motion.div>

      <motion.button
        style={buttonStyle}
        onClick={handleStart}
        whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${theme.colors.gold}66` }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        יאללה, מתחילים! 🚀
      </motion.button>

      <button
        style={adminLinkStyle}
        onClick={() => setScreen('admin')}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
      >
        ⚙️
      </button>
    </motion.div>
  );
}
