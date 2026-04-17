import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { StagePhase } from '../../types';
import { CSSProperties } from 'react';

interface Props {
  answers: [string, string, string, string];
  correctIndex: number;
  selectedIndex: number | null;
  phase: StagePhase;
  eliminatedIndices: number[];
  onSelect: (index: number) => void;
  onRevealDone: () => void;
}

export default function AnswerGrid({
  answers, correctIndex, selectedIndex, phase, eliminatedIndices, onSelect, onRevealDone,
}: Props) {
  useEffect(() => {
    if (phase === 'revealing_answer') {
      const timer = setTimeout(onRevealDone, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, onRevealDone]);

  const getButtonStyle = (index: number): CSSProperties => {
    const isEliminated = eliminatedIndices.includes(index);
    const isSelected = selectedIndex === index;
    const isCorrect = index === correctIndex;
    const baseColor = theme.answerColors[index];

    let bg = `linear-gradient(135deg, ${baseColor}33, ${baseColor}11)`;
    let border = `${baseColor}66`;
    let opacity = isEliminated ? 0.2 : 1;
    let shadow = 'none';

    if (phase === 'answer_selected' && isSelected) {
      bg = `linear-gradient(135deg, ${theme.colors.selected}44, ${theme.colors.selected}22)`;
      border = theme.colors.selected;
      shadow = `0 0 20px ${theme.colors.selected}44`;
    }

    if (phase === 'revealing_answer') {
      if (isCorrect) {
        bg = `linear-gradient(135deg, ${theme.colors.correct}44, ${theme.colors.correct}22)`;
        border = theme.colors.correct;
        shadow = `0 0 25px ${theme.colors.correct}44`;
      } else if (isSelected && !isCorrect) {
        bg = `linear-gradient(135deg, ${theme.colors.wrong}33, ${theme.colors.wrong}11)`;
        border = theme.colors.wrong;
        shadow = `0 0 20px ${theme.colors.wrong}33`;
      } else {
        opacity = 0.3;
      }
    }

    return {
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: theme.borderRadius.md,
      padding: '1rem 1.5rem',
      color: theme.colors.textPrimary,
      fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
      fontWeight: 500,
      cursor: phase === 'showing_question' && !isEliminated ? 'pointer' : 'default',
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      textAlign: 'right',
      transition: 'opacity 0.3s',
      boxShadow: shadow,
      pointerEvents: (phase !== 'showing_question' || isEliminated ? 'none' : 'auto') as 'none' | 'auto',
    };
  };

  const labelStyle = (index: number): CSSProperties => ({
    fontFamily: theme.fonts.heading,
    fontSize: '1rem',
    background: theme.answerColors[index],
    color: '#fff',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  return (
    <div style={gridStyle}>
      {answers.map((answer, i) => (
        <motion.button
          key={i}
          style={getButtonStyle(i)}
          onClick={() => onSelect(i)}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: eliminatedIndices.includes(i) ? 0.2 : 1,
            y: 0,
            scale: phase === 'answer_selected' && selectedIndex === i
              ? [1, 1.03, 1]
              : phase === 'revealing_answer' && correctIndex === i
                ? [1, 1.05, 1]
                : 1,
          }}
          transition={{
            opacity: { duration: 0.3 },
            y: { delay: i * 0.1, duration: 0.4 },
            scale: { duration: 0.6, repeat: phase === 'answer_selected' && selectedIndex === i ? Infinity : 0 },
          }}
          whileHover={
            phase === 'showing_question' && !eliminatedIndices.includes(i)
              ? { scale: 1.03, boxShadow: `0 4px 20px ${theme.answerColors[i]}33` }
              : {}
          }
          whileTap={
            phase === 'showing_question' && !eliminatedIndices.includes(i)
              ? { scale: 0.97 }
              : {}
          }
        >
          <span style={labelStyle(i)}>{theme.answerLabels[i]}</span>
          <span>{answer}</span>
        </motion.button>
      ))}
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',
  maxWidth: '700px',
  width: '100%',
};
