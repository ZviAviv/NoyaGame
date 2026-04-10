import { Question } from '../types';

export const defaultQuestions: Question[] = [
  {
    id: 'q1', stageNumber: 1,
    questionText: 'שאלה לדוגמה - אופיר גרופר',
    answers: ['תשובה א', 'תשובה ב', 'תשובה ג', 'תשובה ד'],
    correctAnswerIndex: 0, linkedPersonId: 'p1',
    hintText: '', videoUrl: '', phoneFriendText: '',
  },
  {
    id: 'q2', stageNumber: 2,
    questionText: 'שאלה לדוגמה - בר',
    answers: ['תשובה א', 'תשובה ב', 'תשובה ג', 'תשובה ד'],
    correctAnswerIndex: 0, linkedPersonId: 'p2',
    hintText: '', videoUrl: '', phoneFriendText: '',
  },
  {
    id: 'q3', stageNumber: 3,
    questionText: 'שאלה לדוגמה - כוכבים אורחים',
    answers: ['תשובה א', 'תשובה ב', 'תשובה ג', 'תשובה ד'],
    correctAnswerIndex: 0, linkedPersonId: '__guest_stars__',
    hintText: '', videoUrl: '', phoneFriendText: '',
  },
];
