import { create } from 'zustand';
import { GameState, LifelineType, Question, StagePhase } from '../types';

const PHASE_ORDER: StagePhase[] = [
  'showing_question',
  'answer_selected',
  'playing_video',
  'revealing_answer',
  'showing_scoreboard',
];

export const useGameStore = create<GameState>()((set, get) => ({
  currentScreen: 'welcome',
  currentStage: 0,
  stagePhase: 'showing_question',
  lifelinesUsed: { phoneFriend: false, fiftyFifty: false, hint: false },
  fiftyFiftyEliminated: [],
  playerAnswers: Array(20).fill(null),
  personScores: {},
  selectedAnswer: null,

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

    if (type === 'fiftyFifty' && questionIndex !== undefined && questions) {
      const question = questions[questionIndex];
      if (question) {
        const wrongIndices = [0, 1, 2, 3].filter(
          (i) => i !== question.correctAnswerIndex
        );
        const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
        updates.fiftyFiftyEliminated = [shuffled[0], shuffled[1]];
      }
    }

    set(updates as GameState);
  },

  resetGame: (personIds) => {
    const scores: Record<string, number> = {};
    personIds.forEach((id) => (scores[id] = 0));
    set({
      currentStage: 0,
      stagePhase: 'showing_question',
      lifelinesUsed: { phoneFriend: false, fiftyFifty: false, hint: false },
      fiftyFiftyEliminated: [],
      playerAnswers: Array(20).fill(null),
      personScores: scores,
      selectedAnswer: null,
      currentScreen: 'game',
    });
  },
}));
