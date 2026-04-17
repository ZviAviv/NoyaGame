import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';

interface Props {
  prizeAmounts: number[];
  currentStage: number;
}

export default function PrizeLadder({ prizeAmounts, currentStage }: Props) {
  const reversed = [...prizeAmounts].reverse();

  return (
    <div style={containerStyle}>
      {reversed.map((amount, displayIdx) => {
        const stageIdx = prizeAmounts.length - 1 - displayIdx;
        const isCurrent = stageIdx === currentStage;
        const isPast = stageIdx < currentStage;

        return (
          <div
            key={stageIdx}
            style={{
              ...rowStyle,
              background: isCurrent
                ? `linear-gradient(270deg, ${theme.colors.gold}33, ${theme.colors.gold}11)`
                : 'transparent',
              borderColor: isCurrent ? theme.colors.gold : 'transparent',
              opacity: isPast ? 0.4 : isCurrent ? 1 : 0.7,
            }}
          >
            <span style={{
              ...amountStyle,
              color: isCurrent ? theme.colors.gold : isPast ? `${theme.colors.gold}88` : theme.colors.textSecondary,
              fontWeight: isCurrent ? 700 : 400,
              fontSize: isCurrent ? '0.85rem' : '0.75rem',
            }}>
              {amount.toLocaleString('en-US')} <span style={{ fontFamily: 'Arial, sans-serif' }}>₪</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '140px',
  flexShrink: 0,
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 80px)',
  paddingTop: '0.5rem',
  paddingBottom: '1rem',
  paddingRight: '0.5rem',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0.22rem 0.6rem',
  borderRadius: '6px',
  border: '1px solid transparent',
  flexShrink: 0,
  textAlign: 'right',
};

const amountStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  direction: 'ltr',
  textAlign: 'right',
  width: '100%',
};
