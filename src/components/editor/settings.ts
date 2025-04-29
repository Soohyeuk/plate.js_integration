import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  keys: {
    openai: string | undefined;
  };
  model: {
    value: string;
  };
}

export const useSettings = create<Settings>()(
  persist(
    () => ({
      keys: {
        openai: process.env.OPENAI_API_KEY,
      },
      model: {
        value: 'gpt-3.5-turbo',
      },
    }),
    {
      name: 'editor-settings',
    }
  )
); 