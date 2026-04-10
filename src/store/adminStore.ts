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
        set({ questions: data.questions, persons: data.persons }),

      exportData: () => {
        const { questions, persons } = get();
        return { questions, persons };
      },
    }),
    {
      name: 'noya-game-admin',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          const persons = (state.persons as Person[]) || [];
          state.persons = persons.map((p) => ({
            ...p,
            avatarUrl: (p as Person).avatarUrl || '',
          }));
        }
        return state as unknown as AdminState;
      },
    }
  )
);
