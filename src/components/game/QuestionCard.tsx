import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

interface Props {
  question: string;
  stageNumber: number;
  totalStages: number;
}

export default function QuestionCard({ question, stageNumber, totalStages }: Props) {
  return (
    <motion.div
      style={cardStyle}
      initial={{ scale: 0.85, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      key={question}
    >
      <div style={stageBadgeStyle}>
        שאלה {stageNumber} מתוך {totalStages}
      </div>
      <h2 style={questionTextStyle}>{question}</h2>
    </motion.div>
  );
}

const cardStyle: CSSProperties = {
  background: `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.bgDark})`,
  border: `2px solid ${theme.colors.cardBorder}`,
  borderRadius: theme.borderRadius.lg,
  padding: '2rem 2.5rem',
  textAlign: 'center',
  maxWidth: '700px',
  width: '100%',
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 ${theme.colors.cardBorder}`,
  marginBottom: '2rem',
};

const stageBadgeStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '0.85rem',
  color: theme.colors.gold,
  marginBottom: '1rem',
  opacity: 0.8,
};

const questionTextStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
  lineHeight: 1.5,
  color: theme.colors.textPrimary,
};
