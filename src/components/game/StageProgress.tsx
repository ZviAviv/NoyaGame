import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

export default function StageProgress({ current, total }: { current: number; total: number }) {
  return (
    <div style={containerStyle}>
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          style={{
            ...dotStyle,
            background:
              i < current
                ? theme.colors.gold
                : i === current
                  ? theme.colors.goldLight
                  : `${theme.colors.cardBorder}88`,
            boxShadow:
              i === current
                ? `0 0 10px ${theme.colors.gold}88`
                : 'none',
          }}
          animate={i === current ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {i === current && (
            <span style={{ fontSize: '0.55rem', fontWeight: 700 }}>{i + 1}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  maxWidth: '500px',
};

const dotStyle: CSSProperties = {
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.6rem',
  fontFamily: theme.fonts.heading,
  color: '#1a0a2e',
  transition: 'background 0.3s, box-shadow 0.3s',
};
