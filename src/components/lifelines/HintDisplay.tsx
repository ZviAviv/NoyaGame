import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

export default function HintDisplay({ text }: { text: string }) {
  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <span style={{ fontSize: '1.5rem' }}>💡</span>
      <span style={{ fontWeight: 500 }}>{text}</span>
    </motion.div>
  );
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  background: `linear-gradient(135deg, ${theme.colors.gold}22, ${theme.colors.goldDark}22)`,
  border: `2px solid ${theme.colors.gold}66`,
  borderRadius: theme.borderRadius.lg,
  padding: '0.75rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  zIndex: 30,
  backdropFilter: 'blur(10px)',
  fontSize: '1.1rem',
  boxShadow: `0 4px 20px ${theme.colors.gold}22`,
};
