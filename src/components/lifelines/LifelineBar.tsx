import { motion } from 'framer-motion';
import { LifelinesUsed, LifelineType } from '../../types';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

interface Props {
  lifelinesUsed: LifelinesUsed;
  onUse: (type: LifelineType) => void;
  disabled: boolean;
}

const lifelines: { type: LifelineType; label: string; icon: string; key: keyof LifelinesUsed }[] = [
  { type: 'phoneFriend', label: 'חבר טלפוני', icon: '📞', key: 'phoneFriend' },
  { type: 'hint', label: 'רמז', icon: '💡', key: 'hint' },
];

export default function LifelineBar({ lifelinesUsed, onUse, disabled }: Props) {
  return (
    <div style={containerStyle}>
      {lifelines.map((ll) => {
        const used = lifelinesUsed[ll.key];
        return (
          <motion.button
            key={ll.type}
            style={{
              ...buttonStyle,
              opacity: used ? 0.3 : disabled ? 0.6 : 1,
              textDecoration: used ? 'line-through' : 'none',
              cursor: used || disabled ? 'default' : 'pointer',
            }}
            onClick={() => !used && !disabled && onUse(ll.type)}
            whileHover={!used && !disabled ? { scale: 1.1, boxShadow: `0 0 15px ${theme.colors.gold}44` } : {}}
            whileTap={!used && !disabled ? { scale: 0.9 } : {}}
          >
            <span style={{ fontSize: '1.2rem' }}>{used ? '✕' : ll.icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{ll.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

const buttonStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.2rem',
  background: `${theme.colors.cardBg}cc`,
  border: `1px solid ${theme.colors.cardBorder}`,
  borderRadius: theme.borderRadius.md,
  padding: '0.4rem 0.6rem',
  color: theme.colors.textPrimary,
  minWidth: '60px',
  transition: 'opacity 0.3s',
};
