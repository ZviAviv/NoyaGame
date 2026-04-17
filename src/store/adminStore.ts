import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminState, Person, Question } from '../types';
import { defaultPersons } from '../data/persons';
import { defaultQuestions } from '../data/defaultQuestions';

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      questions: defaultQuestions,
      persons: defaultPersons,
      correctAnswerAudioUrl: '',
      questionRevealAudioUrl: '',

      setCorrectAnswerAudioUrl: (url) => set({ correctAnswerAudioUrl: url }),
      setQuestionRevealAudioUrl: (url) => set({ questionRevealAudioUrl: url }),

      setQuestions: (questions) => set({ questions }),

      addQuestion: (question) =>
        set((s) => ({ questions: [...s.questions, question] })),

      updateQuestion: (id, updates) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),

      deleteQuestion: (id) =>
        set((s) => ({
          questions: s.questions.filter((q) => q.id !== id),
        })),

      reorderQuestions: (fromIndex, toIndex) =>
        set((s) => {
          const questions = [...s.questions];
          const [moved] = questions.splice(fromIndex, 1);
          questions.splice(toIndex, 0, moved);
          return {
            questions: questions.map((q, i) => ({
              ...q,
              stageNumber: i + 1,
            })),
          };
        }),

      setPersons: (persons) => set({ persons }),

      updatePerson: (id, updates) =>
        set((s) => ({
          persons: s.persons.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      addPerson: (person) =>
        set((s) => ({ persons: [...s.persons, person] })),

      deletePerson: (id) =>
        set((s) => ({
          persons: s.persons.filter((p) => p.id !== id),
        })),

      importData: (data) =>
        set({
          questions: data.questions,
          persons: data.persons,
          correctAnswerAudioUrl: data.correctAnswerAudioUrl || '',
          questionRevealAudioUrl: data.questionRevealAudioUrl || '',
        }),

      exportData: () => {
        const { questions, persons, correctAnswerAudioUrl, questionRevealAudioUrl } = get();
        return { questions, persons, correctAnswerAudioUrl, questionRevealAudioUrl };
      },
    }),
    {
      name: 'noya-game-admin',
      version: 5,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          const persons = (state.persons as Person[]) || [];
          state.persons = persons.map((p) => ({
            ...p,
            avatarUrl: (p as Person).avatarUrl || '',
          }));
        }
        if (version < 3) {
          const questions = (state.questions as Question[]) || [];
          state.questions = questions.map((q) => ({
            ...q,
            imageUrl: (q as Question).imageUrl || '',
          }));
        }
        if (version < 4) {
          // Strip per-question audio field (moved to global setting)
          const questions = (state.questions as Record<string, unknown>[]) || [];
          state.questions = questions.map((q) => {
            const { correctAnswerAudioUrl: _removed, ...rest } = q as Record<string, unknown>;
            void _removed;
            return rest;
          });
          if (!state.correctAnswerAudioUrl) state.correctAnswerAudioUrl = '';
        }
        if (version < 5) {
          if (!state.questionRevealAudioUrl) state.questionRevealAudioUrl = '';
        }
        return state as unknown as AdminState;
      },
    }
  )
);
