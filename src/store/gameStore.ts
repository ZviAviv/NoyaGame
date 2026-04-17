import { create } from 'zustand';
import { GameState, LifelineType, Question, StagePhase } from '../types';

const PHASE_ORDER: StagePhase[] = [
  'showing_question',
  'answer_selected',
  'playing_video',
  'revealing_answer',
  'showing_scoreboard',
];

function roundNice(n: number): number {
  if (n < 2) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(n)));
  const ratio = n / mag;
  let rounded: number;
  if (ratio < 1.5) rounded = 1;
  else if (ratio < 2.5) rounded = 2;
  else if (ratio < 3.5) rounded = 3;
  else if (ratio < 4.5) rounded = 4;
  else if (ratio < 6) rounded = 5;
  else if (ratio < 8) rounded = 7;
  else rounded = 10;
  return rounded * mag;
}

function generatePrizes(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [1_000_000];

  const result: number[] = new Array(n);
  result[0] = 1;
  result[n - 1] = 1_000_000;

  for (let i = 1; i < n - 1; i++) {
    const t = i / (n - 1);
    const noise = (Math.random() - 0.5) * 0.5;
    const logVal = t * 6 + noise;
    const raw = Math.pow(10, Math.max(0, Math.min(6, logVal)));
    result[i] = roundNice(raw);
  }

  // Ensure strictly increasing
  for (let i = 1; i < n - 1; i++) {
    const minVal = result[i - 1] + 1;
    const maxVal = 1_000_000 - (n - 1 - i);
    result[i] = Math.max(minVal, Math.min(maxVal, result[i]));
  }

  return result;
}

export const useGameStore = create<GameState>()((set, get) => ({
  currentScreen: 'welcome',
  currentStage: 0,
  stagePhase: 'showing_question',
  lifelinesUsed: { phoneFriend: false, hint: false },
  fiftyFiftyEliminated: [],
  playerAnswers: Array(20).fill(null),
  personScores: {},
  selectedAnswer: null,
  prizeAmounts: generatePrizes(15),

  setScreen: (screen) => set({ currentScreen: screen }),

  selectAnswer: (answerIndex) =>
    set({
      selectedAnswer: answerIndex,
      stagePhase: 'answer_selected',
    }),

  advancePhase: () => {
    const { stagePhase } = get();
    const currentIndex = PHASE_ORDER.indexOf(stagePhase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      set({ stagePhase: PHASE_ORDER[currentIndex + 1] });
    }
  },

  nextStage: () => {
    const { currentStage } = get();
    if (currentStage < 19) {
      set({
        currentStage: currentStage + 1,
        stagePhase: 'showing_question',
        selectedAnswer: null,
        fiftyFiftyEliminated: [],
      });
    } else {
      set({ currentScreen: 'results' });
    }
  },

  useLifeline: (type: LifelineType, questionIndex?: number, questions?: Question[]) => {
    const { lifelinesUsed } = get();
    if (lifelinesUsed[type]) return;

    const updates: Partial<GameState> = {
      lifelinesUsed: { ...lifelinesUsed, [type]: true },
    };

    // hint: eliminate all wrong answers, leaving only the correct one visible
    if (type === 'hint' && questionIndex !== undefined && questions) {
      const question = questions[questionIndex];
      if (question) {
        const wrongIndices = [0, 1, 2, 3].filter(
          (i) => i !== question.correctAnswerIndex
        );
        updates.fiftyFiftyEliminated = wrongIndices;
      }
    }

    set(updates as GameState);
  },

  resetGame: (questionCount = 15) => {
    set({
      currentStage: 0,
      stagePhase: 'showing_question',
      lifelinesUsed: { phoneFriend: false, hint: false },
      fiftyFiftyEliminated: [],
      playerAnswers: Array(20).fill(null),
      personScores: {},
      selectedAnswer: null,
      currentScreen: 'game',
      prizeAmounts: generatePrizes(Math.max(1, questionCount)),
    });
  },
}));
