import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

interface Props {
  wasCorrect: boolean;
  prizeAmount: number;
  onNext: () => void;
  isLastStage: boolean;
}

export default function Scoreboard({ wasCorrect, prizeAmount, onNext, isLastStage }: Props) {
  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={{
          ...resultBadgeStyle,
          borderColor: wasCorrect ? theme.colors.correct : theme.colors.wrong,
          background: wasCorrect ? `${theme.colors.correct}11` : `${theme.colors.wrong}11`,
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, delay: 0.1 }}
      >
        <span style={{ fontSize: '3rem' }}>{wasCorrect ? '✅' : '❌'}</span>
        <h2 style={resultTextStyle}>
          {wasCorrect ? 'תשובה נכונה!' : 'תשובה לא נכונה'}
        </h2>
        {wasCorrect && (
          <motion.div
            style={prizeStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span style={prizeAmountStyle}>
              {prizeAmount.toLocaleString('he-IL')} ₪
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.button
        style={nextBtnStyle}
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
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
  gap: '2rem',
  width: '100%',
  maxWidth: '500px',
};

const resultBadgeStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '2rem 3rem',
  borderRadius: theme.borderRadius.lg,
  border: '2px solid',
  width: '100%',
};

const resultTextStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.8rem',
  margin: 0,
};

const prizeStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
};

const prizeAmountStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '2.5rem',
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldLight})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  direction: 'ltr',
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
