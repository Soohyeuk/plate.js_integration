'use client';

import * as React from 'react';

import { type NodeEntry, isHotkey } from '@udecode/plate';
import {
  AIChatPlugin,
  useEditorChat,
  useLastAssistantMessage,
} from '@udecode/plate-ai/react';
import {
  BlockSelectionPlugin,
  useIsSelecting,
} from '@udecode/plate-selection/react';
import {
  useEditorPlugin,
  useHotkeys,
  usePluginOption,
} from '@udecode/plate/react';
import { Loader2Icon } from 'lucide-react';

import { useChat } from '@/components/editor/use-chat';

import { AIChatEditor } from './ai-chat-editor';
import { AIMenuItems } from './ai-menu-items';
import { Command, CommandList, InputCommand } from './command';
import { Popover, PopoverAnchor, PopoverContent } from './popover';

export function AIMenu() {
  const { api, editor } = useEditorPlugin(AIChatPlugin);
  const open = usePluginOption(AIChatPlugin, 'open');
  const mode = usePluginOption(AIChatPlugin, 'mode');
  const streaming = usePluginOption(AIChatPlugin, 'streaming');
  const rawAiEditor = usePluginOption(AIChatPlugin, 'aiEditor');
  const aiEditor = rawAiEditor === null ? undefined : rawAiEditor;
  const isSelecting = useIsSelecting();

  const [value, setValue] = React.useState('');

  const chat = useChat();

  const { input, messages, setInput, status } = chat;
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null
  );

  const content = useLastAssistantMessage()?.content;

  React.useEffect(() => {
    if (streaming) {
      const anchor = api.aiChat.node({ anchor: true });
      if (anchor && anchor.length > 0) {
        setTimeout(() => {
          const anchorDom = editor.api.toDOMNode(anchor[0])!;
          setAnchorElement(anchorDom);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);

  React.useEffect(() => {
    if (messages && messages.length > 0 && !isSelecting) {
      const blocks = editor.api.blocks();
      if (blocks && blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
        editor.selection = { anchor: { path: lastBlock[1], offset: 0 }, focus: { path: lastBlock[1], offset: 0 } };
      }
    }
  }, [editor, isSelecting, messages]);

  const setOpen = (open: boolean) => {
    if (open) {
      api.aiChat.show();
    } else {
      api.aiChat.hide();
    }
  };

  const show = (anchorElement: HTMLElement) => {
    setAnchorElement(anchorElement);
    setOpen(true);
  };

  useEditorChat({
    chat,
    onOpenBlockSelection: (blocks: NodeEntry[]) => {
      if (blocks && blocks.length > 0) {
        const lastBlock = blocks.at(-1);
        if (lastBlock) {
          show(editor.api.toDOMNode(lastBlock[0])!);
        }
      }
    },
    onOpenChange: (open) => {
      if (!open) {
        setAnchorElement(null);
        setInput('');
      }
    },
    onOpenCursor: () => {
      const [ancestor] = editor.api.block({ highest: true })!;

      if (!editor.api.isAt({ end: true }) && !editor.api.isEmpty(ancestor)) {
        editor
          .getApi(BlockSelectionPlugin)
          .blockSelection.set(ancestor.id as string);
      }

      show(editor.api.toDOMNode(ancestor)!);
    },
    onOpenSelection: () => {
      const blocks = editor.api.blocks();
      if (blocks && blocks.length > 0) {
        const lastBlock = blocks.at(-1);
        if (lastBlock) {
          show(editor.api.toDOMNode(lastBlock[0])!);
        }
      }
    },
  });

  useHotkeys(
    'meta+j',
    () => {
      api.aiChat.show();
    },
    { enableOnContentEditable: true, enableOnFormTags: true }
  );

  const isLoading =
    (status === 'streaming' && streaming) || status === 'submitted';

  if (isLoading && mode === 'insert') {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverAnchor virtualRef={{ current: anchorElement! }} />

      <PopoverContent
        className="border-none bg-transparent p-0 shadow-none"
        style={{
          width: anchorElement?.offsetWidth,
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();

          api.aiChat.hide();
        }}
        align="center"
        side="bottom"
      >
        <Command
          className="w-full rounded-lg border shadow-md"
          value={value}
          onValueChange={setValue}
        >
          {mode === 'chat' && isSelecting && content && (
            <AIChatEditor content={content} />
          )}

          {isLoading ? (
            <div className="flex grow items-center gap-2 p-2 text-sm text-muted-foreground select-none">
              <Loader2Icon className="size-4 animate-spin" />
              {messages.length > 1 ? 'Editing...' : 'Thinking...'}
            </div>
          ) : (
            <InputCommand
              variant="ghost"
              className="rounded-none border-b border-solid border-border [&_svg]:hidden"
              value={input}
              onKeyDown={(e) => {
                if (isHotkey('backspace')(e) && input.length === 0) {
                  e.preventDefault();
                  api.aiChat.hide();
                }
                if (isHotkey('enter')(e) && !e.shiftKey && !value) {
                  e.preventDefault();
                  void api.aiChat.submit();
                }
              }}
              onValueChange={setInput}
              placeholder="Ask AI anything..."
              data-plate-focus
              autoFocus
            />
          )}

          {!isLoading && (
            <CommandList>
              <AIMenuItems setValue={setValue} aiEditor={aiEditor} />
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
