'use client';

import {
    usePlateEditor,
    Plate,
    PlateLeaf,
    ParagraphPlugin,
    type PlateEditor,
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
import { AIChatPlugin, AIPlugin, useChatChunk } from '@udecode/plate-ai/react';
import { AIMenu } from '@/components/plate-ui/ai-menu';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { AILeaf } from '@/components/plate-ui/ai-leaf';
import { PathApi } from '@udecode/plate';
import { streamInsertChunk, withAIBatch } from '@udecode/plate-ai';

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
        if (!value || value.length === 0) {
            localStorage.removeItem(storageKey);
            setEditorValue(defaultValue);
            return;
        }

        const isEmpty = value.length === 1 && 
                       value[0].type === 'p' && 
                       value[0].children.length === 1 && 
                       value[0].children[0].text === '';

        if (isEmpty) {
            localStorage.removeItem(storageKey);
            setEditorValue(defaultValue);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(value));
            setEditorValue(value);
        }
    }, [storageKey]);

    const debouncedSave = useDebounce(saveToStorage, 200);

    // Create a separate editor for AI operations
    const aiEditor = usePlateEditor({
        id: `${storageKey}-ai-editor`,
        plugins: [
            ParagraphPlugin,
            HeadingPlugin.configure({ 
                options: { levels: 6 } 
            }),
            BlockquotePlugin,
            CodeBlockPlugin.configure({ 
                options: { lowlight } 
            }),
            MarkdownPlugin,
        ],
    });

    const editor = usePlateEditor({
        id: `${storageKey}-editor`,
        value: editorValue,
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
            // AI plugins
            AIPlugin,
            AIChatPlugin.configure({
                options: {
                    mode: 'chat',
                    streaming: true,
                    aiEditor: aiEditor,
                    experimental_lastTextId: null,
                },
            }).extend({
                useHooks: ({ editor, getOption, setOption }) => {
                    useChatChunk({
                        onChunk: ({ chunk, isFirst, nodes, text }) => {
                            if (isFirst && editor.selection?.focus?.path) {
                                editor.tf.withoutSaving(() => {
                                    editor.tf.insertNodes(
                                        {
                                            children: [{ text: '' }],
                                            type: AIChatPlugin.key,
                                        },
                                        {
                                            at: PathApi.next(editor.selection!.focus.path.slice(0, 1)),
                                        }
                                    );
                                });
                                editor.setOption(AIChatPlugin, 'streaming', true);
                            }

                            if (nodes.length > 0) {
                                withAIBatch(
                                    editor,
                                    () => {
                                        if (!getOption('streaming')) return;
                                        editor.tf.withScrolling(() => {
                                            streamInsertChunk(editor, chunk, {
                                                textProps: {
                                                    ai: true,
                                                },
                                            });
                                        });
                                    },
                                    { split: isFirst }
                                );
                            }
                        },
                        onFinish: ({ content }) => {
                            editor.setOption(AIChatPlugin, 'streaming', false);
                            editor.setOption(AIChatPlugin, '_blockChunks', '');
                            editor.setOption(AIChatPlugin, '_blockPath', null);
                            editor.setOption(AIChatPlugin, 'experimental_lastTextId', null);
                        },
                    });
                },
            }),
            MarkdownPlugin
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
                <AIMenu />
            </EditorContainer>
        </Plate>
    );
}

const ClientSharedEditor = dynamic(() => Promise.resolve(SharedEditor), {
    ssr: false
});

export default ClientSharedEditor; 