import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

export default function PhoneFriend({ text }: { text: string }) {
  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div style={bubbleStyle}>
        <span style={{ fontSize: '1.5rem' }}>📞</span>
        <div>
          <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, marginBottom: '0.25rem' }}>
            החבר שלך אומר:
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>"{text}"</div>
        </div>
      </div>
      <div style={tailStyle} />
    </motion.div>
  );
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 30,
};

const bubbleStyle: CSSProperties = {
  background: `linear-gradient(135deg, #6c5ce722, #6c5ce744)`,
  border: `2px solid #6c5ce766`,
  borderRadius: theme.borderRadius.lg,
  padding: '1rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backdropFilter: 'blur(10px)',
  boxShadow: `0 4px 20px #6c5ce722`,
};

const tailStyle: CSSProperties = {
  width: 0,
  height: 0,
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent',
  borderTop: '10px solid #6c5ce744',
  margin: '0 auto',
};
