import { Person } from '../../types';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

interface Props {
  persons: Person[];
  scores: Record<string, number>;
}

export default function MiniScoreboard({ persons, scores }: Props) {
  const sorted = [...persons]
    .map((p) => ({ ...p, score: scores[p.id] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div style={containerStyle}>
      {sorted.map((p) => (
        <div key={p.id} style={itemStyle}>
          <span style={{ fontSize: '0.9rem' }}>{p.avatarEmoji}</span>
          <span style={{ fontFamily: theme.fonts.heading, fontSize: '0.8rem', color: p.color }}>
            {p.score}
          </span>
        </div>
      ))}
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  background: `${theme.colors.cardBg}88`,
  borderRadius: theme.borderRadius.sm,
  padding: '0.25rem 0.5rem',
};
