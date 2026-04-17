export type StagePhase =
  | 'showing_question'
  | 'answer_selected'
  | 'playing_video'
  | 'revealing_answer'
  | 'showing_scoreboard';

export type LifelineType = 'phoneFriend' | 'hint';

export type ScreenType = 'welcome' | 'game' | 'results' | 'admin';

export interface Person {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarUrl: string;
  color: string;
}

export interface Question {
  id: string;
  stageNumber: number;
  questionText: string;
  answers: [string, string, string, string];
  correctAnswerIndex: number;
  linkedPersonId: string;
  imageUrl: string;
  hintText: string;
  videoUrl: string;
  phoneFriendText: string;
}

export interface LifelinesUsed {
  phoneFriend: boolean;
  hint: boolean;
}

export interface GameState {
  currentScreen: ScreenType;
  currentStage: number;
  stagePhase: StagePhase;
  lifelinesUsed: LifelinesUsed;
  fiftyFiftyEliminated: number[];
  playerAnswers: (number | null)[];
  personScores: Record<string, number>;
  selectedAnswer: number | null;
  prizeAmounts: number[];

  setScreen: (screen: ScreenType) => void;
  selectAnswer: (answerIndex: number) => void;
  advancePhase: () => void;
  nextStage: () => void;
  useLifeline: (type: LifelineType, questionIndex?: number, questions?: Question[]) => void;
  resetGame: (questionCount?: number) => void;
}

export interface AdminState {
  questions: Question[];
  persons: Person[];
  correctAnswerAudioUrl: string;
  questionRevealAudioUrl: string;

  setCorrectAnswerAudioUrl: (url: string) => void;
  setQuestionRevealAudioUrl: (url: string) => void;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;

  setPersons: (persons: Person[]) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addPerson: (person: Person) => void;
  deletePerson: (id: string) => void;

  importData: (data: { questions: Question[]; persons: Person[]; correctAnswerAudioUrl?: string; questionRevealAudioUrl?: string }) => void;
  exportData: () => { questions: Question[]; persons: Person[]; correctAnswerAudioUrl: string; questionRevealAudioUrl: string };
}
