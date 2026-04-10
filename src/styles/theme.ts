export const theme = {
  colors: {
    bgDark: '#1a0a2e',
    bgGradientStart: '#2d1b69',
    bgGradientEnd: '#11052c',

    gold: '#ffd700',
    goldLight: '#ffe55c',
    goldDark: '#c9a800',

    answerA: '#e84393',
    answerB: '#6c5ce7',
    answerC: '#00b894',
    answerD: '#fdcb6e',

    correct: '#00e676',
    correctGlow: 'rgba(0, 230, 118, 0.25)',
    wrong: '#ff1744',
    wrongGlow: 'rgba(255, 23, 68, 0.25)',
    selected: '#ff9100',

    textPrimary: '#ffffff',
    textSecondary: '#b8b8d4',
    cardBg: '#2a1f5e',
    cardBorder: '#4a3f8e',
    overlay: 'rgba(10, 5, 30, 0.85)',
  },

  personColors: [
    '#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe', '#fd79a8',
    '#55efc4', '#74b9ff', '#ffeaa7', '#dfe6e9', '#e17055',
  ],

  answerColors: ['#e84393', '#6c5ce7', '#00b894', '#fdcb6e'] as const,
  answerLabels: ['א', 'ב', 'ג', 'ד'] as const,

  fonts: {
    heading: "'Secular One', 'Rubik', sans-serif",
    body: "'Heebo', 'Rubik', sans-serif",
  },

  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    pill: '9999px',
  },
} as const;
