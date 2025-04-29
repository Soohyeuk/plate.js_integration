'use client';

import { useChat as useBaseChat } from '@ai-sdk/react';

import { useSettings } from '@/components/editor/settings';

export const useChat = () => {
  const { keys, model } = useSettings();

  return useBaseChat({
    id: 'editor',
    api: '/api/ai/command',
    body: {
      apiKey: keys.openai,
      model: model.value,
    },
    streamProtocol: 'data',
    onResponse: (response) => {
      console.log('AI Response:', response);
    },
    onFinish: (message) => {
      console.log('AI Chat Complete:', message);
    },
    onError: (error) => {
      console.error('AI Chat Error:', error);
    }
  });
};
