import { Person } from '../../types';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';
import Avatar from '../common/Avatar';

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
          <Avatar avatarUrl={p.avatarUrl} name={p.name} color={p.color} size="1.4rem" fontSize="0.55rem" />
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
