import { Person } from '../types';
import { theme } from '../styles/theme';

export const defaultPersons: Person[] = [
  { id: 'p1', name: 'נועה', avatarEmoji: '🌟', color: theme.personColors[0] },
  { id: 'p2', name: 'יובל', avatarEmoji: '🎸', color: theme.personColors[1] },
  { id: 'p3', name: 'שירה', avatarEmoji: '🎨', color: theme.personColors[2] },
  { id: 'p4', name: 'אורי', avatarEmoji: '⚽', color: theme.personColors[3] },
  { id: 'p5', name: 'מאיה', avatarEmoji: '🦋', color: theme.personColors[4] },
  { id: 'p6', name: 'עידו', avatarEmoji: '🎮', color: theme.personColors[5] },
  { id: 'p7', name: 'תמר', avatarEmoji: '📚', color: theme.personColors[6] },
  { id: 'p8', name: 'רועי', avatarEmoji: '🏄', color: theme.personColors[7] },
  { id: 'p9', name: 'דנה', avatarEmoji: '🎤', color: theme.personColors[8] },
  { id: 'p10', name: 'אלון', avatarEmoji: '🚀', color: theme.personColors[9] },
];
