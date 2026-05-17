import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Draft {
  title: string;
  content: string;
  tag: string;
}

interface NoteState {
  draft: Draft;
  setDraft: (newDraft: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      
      setDraft: (newDraft) => 
        set((state) => ({
          draft: { ...state.draft, ...newDraft }
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-hub-storage',
    }
  )
);