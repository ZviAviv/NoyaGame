import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { theme } from '../styles/theme';
import confetti from 'canvas-confetti';
import { CSSProperties } from 'react';

export default function ResultsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const resetGame = useGameStore((s) => s.resetGame);
  const personScores = useGameStore((s) => s.personScores);
  const persons = useAdminStore((s) => s.persons);
  const confettiRef = useRef(false);

  const ranked = [...persons]
    .map((p) => ({ ...p, score: personScores[p.id] || 0 }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0];

  useEffect(() => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#a29bfe', '#fd79a8'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#a29bfe', '#fd79a8'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleNewGame = () => {
    resetGame(persons.map((p) => p.id));
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        style={titleStyle}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        🏆 התוצאות הסופיות! 🏆
      </motion.h1>

      {winner && (
        <motion.div
          style={winnerCardStyle}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
        >
          <div style={{ fontSize: '4rem' }}>👑</div>
          {winner.avatarUrl ? (
            <img src={winner.avatarUrl} alt={winner.name} style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '5rem', height: '5rem', borderRadius: '50%',
              background: `linear-gradient(135deg, ${winner.color}, ${winner.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: '#fff',
            }}>
              {winner.name.charAt(0)}
            </div>
          )}
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '2rem', margin: '0.5rem 0' }}>
            {winner.name}
          </h2>
          <div style={{ fontSize: '2.5rem', fontFamily: theme.fonts.heading, color: theme.colors.gold }}>
            {winner.score} נקודות
          </div>
        </motion.div>
      )}

      <motion.div
        style={rankingStyle}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {ranked.map((person, idx) => (
          <motion.div
            key={person.id}
            style={{
              ...rankItemStyle,
              borderColor: idx === 0 ? theme.colors.gold : person.color + '44',
              background: idx === 0 ? `${theme.colors.gold}11` : `${person.color}11`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + idx * 0.1 }}
          >
            <span style={{
              fontFamily: theme.fonts.heading,
              fontSize: '1.2rem',
              color: idx === 0 ? theme.colors.gold : theme.colors.textSecondary,
              width: '2rem',
            }}>
              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
            </span>
            {person.avatarUrl ? (
              <img src={person.avatarUrl} alt={person.name} style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {person.name.charAt(0)}
              </div>
            )}
            <span style={{ flex: 1, fontWeight: 500 }}>{person.name}</span>
            <span style={{
              fontFamily: theme.fonts.heading,
              fontSize: '1.2rem',
              color: person.color,
            }}>
              {person.score}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          style={playAgainStyle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewGame}
        >
          🔄 משחק חדש
        </motion.button>
        <motion.button
          style={backBtnStyle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScreen('welcome')}
        >
          🏠 חזרה להתחלה
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  position: 'relative',
};

const titleStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
  background: `linear-gradient(135deg, ${theme.colors.gold}, #fff, ${theme.colors.gold})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '1.5rem',
};

const winnerCardStyle: CSSProperties = {
  background: `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.gold}15)`,
  border: `2px solid ${theme.colors.gold}`,
  borderRadius: theme.borderRadius.lg,
  padding: '2rem 3rem',
  textAlign: 'center',
  boxShadow: `0 0 40px ${theme.colors.gold}33`,
  marginBottom: '2rem',
};

const rankingStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
  maxWidth: '500px',
};

const rankItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: theme.borderRadius.md,
  border: '1px solid',
};

const playAgainStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.2rem',
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldDark})`,
  color: '#1a0a2e',
  border: 'none',
  borderRadius: theme.borderRadius.pill,
  padding: '0.8rem 2rem',
  cursor: 'pointer',
};

const backBtnStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.2rem',
  background: theme.colors.cardBg,
  color: theme.colors.textPrimary,
  border: `1px solid ${theme.colors.cardBorder}`,
  borderRadius: theme.borderRadius.pill,
  padding: '0.8rem 2rem',
  cursor: 'pointer',
};
