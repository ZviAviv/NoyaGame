import { motion } from 'framer-motion';
import { Person } from '../../types';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

interface Props {
  persons: Person[];
  scores: Record<string, number>;
  currentPersonId: string;
  wasCorrect: boolean;
  onNext: () => void;
  isLastStage: boolean;
}

export default function Scoreboard({ persons, scores, currentPersonId, wasCorrect, onNext, isLastStage }: Props) {
  const sorted = [...persons]
    .map((p) => ({ ...p, score: scores[p.id] || 0 }))
    .sort((a, b) => b.score - a.score);

  const maxScore = Math.max(...sorted.map((p) => p.score), 1);

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={titleStyle}>
        {wasCorrect ? '✅ תשובה נכונה!' : '❌ תשובה לא נכונה'}
      </h2>

      <div style={gridStyle}>
        {sorted.map((person, idx) => {
          const isCurrent = person.id === currentPersonId;
          return (
            <motion.div
              key={person.id}
              style={{
                ...cardStyle,
                borderColor: isCurrent
                  ? wasCorrect
                    ? theme.colors.correct
                    : theme.colors.wrong
                  : `${person.color}44`,
                background: isCurrent
                  ? wasCorrect
                    ? `${theme.colors.correct}11`
                    : `${theme.colors.wrong}11`
                  : `${person.color}11`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              {idx === 0 && person.score > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '1.2rem' }}>👑</span>
              )}
              {person.avatarUrl ? (
                <img src={person.avatarUrl} alt={person.name} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700, color: '#fff',
                }}>
                  {person.name.charAt(0)}
                </div>
              )}
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{person.name}</span>
              <div style={barContainerStyle}>
                <motion.div
                  style={{
                    ...barStyle,
                    background: person.color,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(person.score / maxScore) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                />
              </div>
              <motion.span
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: '1.5rem',
                  color: person.color,
                }}
                initial={{ scale: 1 }}
                animate={isCurrent && wasCorrect ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {person.score}
              </motion.span>
              {isCurrent && (
                <motion.span
                  style={{
                    fontSize: '0.75rem',
                    color: wasCorrect ? theme.colors.correct : theme.colors.wrong,
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {wasCorrect ? '+1 🎉' : '+0'}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        style={nextBtnStyle}
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {isLastStage ? 'לתוצאות הסופיות! 🏆' : 'לשאלה הבאה ←'}
      </motion.button>
    </motion.div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  width: '100%',
  maxWidth: '800px',
};

const titleStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.5rem',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '0.75rem',
  width: '100%',
};

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '1rem 0.75rem',
  borderRadius: theme.borderRadius.md,
  border: '2px solid',
  position: 'relative',
};

const barContainerStyle: CSSProperties = {
  width: '100%',
  height: '4px',
  background: '#ffffff11',
  borderRadius: '2px',
  overflow: 'hidden',
};

const barStyle: CSSProperties = {
  height: '100%',
  borderRadius: '2px',
  minWidth: '2px',
};

const nextBtnStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.1rem',
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldDark})`,
  color: '#1a0a2e',
  border: 'none',
  borderRadius: theme.borderRadius.pill,
  padding: '0.7rem 2rem',
  cursor: 'pointer',
};
