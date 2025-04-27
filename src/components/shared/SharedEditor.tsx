'use client';

import {
    usePlateEditor,
    Plate,
    PlateLeaf,
    ParagraphPlugin,
} from '@udecode/plate/react';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { YjsPlugin } from '@udecode/plate-yjs/react';
import { RemoteCursorOverlay } from '@/components/plate-ui/remote-cursor-overlay';
import { SlashPlugin, SlashInputPlugin } from '@udecode/plate-slash-command/react';
import { SlashInputElement } from '@/components/plate-ui/slash-input-element';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import { withProps } from '@udecode/cn';
import { all, createLowlight } from 'lowlight';

// Import UI components
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';

// Create a lowlight instance with all languages
const lowlight = createLowlight(all);

function useDebounce(callback: Function, delay: number) {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        const newTimeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
        
        setTimeoutId(newTimeoutId);
    }, [callback, delay, timeoutId]);
}

const defaultValue = [
    {
        type: 'p',
        children: [{ text: '' }],
    },
];

interface SharedEditorProps {
    storageKey: string;
    placeholder: string;
}

function SharedEditor({ storageKey, placeholder }: SharedEditorProps) {
    const [editorValue, setEditorValue] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.error('Failed to parse saved content:', e);
            return defaultValue;
        }
    });

    const saveToStorage = useCallback((value: any) => {
        // Handle empty array or undefined/null values
        if (!value || value.length === 0) {
            console.log('Empty array, removing from localStorage');
            localStorage.removeItem(storageKey);
            setEditorValue(defaultValue);
            return;
        }

        const isEmpty = value.length === 1 && 
                       value[0].type === 'p' && 
                       value[0].children.length === 1 && 
                       value[0].children[0].text === '';

        if (isEmpty) {
            console.log('Content is empty, removing from localStorage');
            localStorage.removeItem(storageKey);
            setEditorValue(defaultValue);
        } else {
            console.log('Saving to localStorage:', value);
            localStorage.setItem(storageKey, JSON.stringify(value));
            setEditorValue(value);
        }
    }, [storageKey]);

    const debouncedSave = useDebounce(saveToStorage, 200);

    const editor = usePlateEditor({
        id: `${storageKey}-editor`,
        value: editorValue,
        // plugins: [
        //     YjsPlugin.configure({
        //       render: { afterEditable: RemoteCursorOverlay },
        //       options: {
        //         cursorOptions: {
        //           autoSend: true,
        //           data: { name: 'A plate user', color: '#5AC990' },
        //         },
        //         disableCursors: false,
        //         hocuspocusProviderOptions: {
        //           url: 'ws://127.0.0.1:1234',
        //           name: 'happy-doc',
        //         },
        //       },
        //     }),
        // ],
        plugins: [
            // Basic formatting plugins
            ParagraphPlugin,
            HeadingPlugin.configure({ 
                options: { levels: 6 } 
            }),
            BlockquotePlugin,
            CodeBlockPlugin.configure({ 
                options: { lowlight } 
            }),
            // Suggestion and Slash commands
            SuggestionPlugin,
            SlashPlugin.configure({
                options: {
                    trigger: '/',
                }
            }),
            SlashInputPlugin.configure({
                options: {
                    trigger: '/',
                }
            }),
        ],
        override: {
            components: {
                [ParagraphPlugin.key]: ParagraphElement,
                [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
                [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
                [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
                [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
                [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
                [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
                [SlashInputPlugin.key]: SlashInputElement,
            }
        }
    });

    return (
        <Plate editor={editor}
            onChange={({ value }) => {
                debouncedSave(value);
            }}>
            <EditorContainer>
                <Editor placeholder={placeholder} />
            </EditorContainer>
        </Plate>
    );
}

const ClientSharedEditor = dynamic(() => Promise.resolve(SharedEditor), {
    ssr: false
});

export default ClientSharedEditor; 