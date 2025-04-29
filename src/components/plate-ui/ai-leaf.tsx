'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { NodeApi } from '@udecode/plate';
import { AIChatPlugin } from '@udecode/plate-ai/react';
import { PlateLeaf, usePluginOption } from '@udecode/plate/react';
import { cva } from 'class-variance-authority';

const aiIndicatorVariants = cva(
  'after:ml-1.5 after:inline-block after:h-3 after:w-3 after:animate-pulse after:rounded-full after:bg-purple-800 after:align-middle after:content-[""]'
);

export function AILeaf({
  className,
  ...props
}: React.ComponentProps<typeof PlateLeaf>) {
  const lastTextId = usePluginOption(
    AIChatPlugin,
    'experimental_lastTextId'
  ) as any;
  const leaf = props.leaf;

  let isLast = false;
  if (leaf.code_syntax && lastTextId === leaf.id) {
    const node = props.editor.api.node({ mode: 'lowest' });
    if (node) {
      const string = NodeApi.string(node[0]);
      isLast = string.endsWith(leaf.text);
    }
  } else {
    isLast = lastTextId === leaf.id;
  }

  return (
    <PlateLeaf
      className={cn(
        className,
        'border-b-2 border-b-purple-100 bg-purple-50 text-purple-800',
        'transition-all duration-200 ease-in-out',
        isLast && aiIndicatorVariants()
      )}
      {...props}
    />
  );
}
