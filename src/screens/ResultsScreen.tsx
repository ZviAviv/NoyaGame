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
  const playerAnswers = useGameStore((s) => s.playerAnswers);
  const prizeAmounts = useGameStore((s) => s.prizeAmounts);
  const questions = useAdminStore((s) => s.questions);
  const confettiRef = useRef(false);

  const sortedQuestions = [...questions].sort((a, b) => a.stageNumber - b.stageNumber);

  const correctCount = playerAnswers.filter(
    (answer, i) => sortedQuestions[i] && answer === sortedQuestions[i].correctAnswerIndex
  ).length;

  const totalPlayed = sortedQuestions.length;

  // Find the highest correctly answered stage
  let highestCorrectStage = -1;
  for (let i = sortedQuestions.length - 1; i >= 0; i--) {
    if (playerAnswers[i] === sortedQuestions[i]?.correctAnswerIndex) {
      highestCorrectStage = i;
      break;
    }
  }

  const finalPrize = highestCorrectStage >= 0
    ? prizeAmounts[Math.min(highestCorrectStage, prizeAmounts.length - 1)]
    : 0;

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
        🏆 המשחק הסתיים! 🏆
      </motion.h1>

      <motion.div
        style={resultCardStyle}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
      >
        <div style={{ fontSize: '4rem' }}>🎉</div>
        <div style={statsStyle}>
          <div style={statStyle}>
            <span style={statValueStyle}>{correctCount}</span>
            <span style={statLabelStyle}>מתוך {totalPlayed} שאלות נכונות</span>
          </div>
        </div>
        {finalPrize > 0 && (
          <motion.div
            style={prizeDisplayStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div style={prizeLabelStyle}>זכיתם ב-</div>
            <div style={prizeAmountStyle}>
              {finalPrize.toLocaleString('he-IL')} ₪
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          style={playAgainStyle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => resetGame(questions.length || 15)}
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

const resultCardStyle: CSSProperties = {
  background: `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.gold}15)`,
  border: `2px solid ${theme.colors.gold}`,
  borderRadius: theme.borderRadius.lg,
  padding: '2.5rem 3.5rem',
  textAlign: 'center',
  boxShadow: `0 0 40px ${theme.colors.gold}33`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
};

const statsStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
};

const statStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statValueStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '3rem',
  color: theme.colors.gold,
};

const statLabelStyle: CSSProperties = {
  fontSize: '1rem',
  color: theme.colors.textSecondary,
};

const prizeDisplayStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
  borderTop: `1px solid ${theme.colors.gold}44`,
  paddingTop: '1rem',
  width: '100%',
};

const prizeLabelStyle: CSSProperties = {
  fontSize: '1rem',
  color: theme.colors.textSecondary,
};

const prizeAmountStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '2.8rem',
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldLight})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  direction: 'ltr',
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
