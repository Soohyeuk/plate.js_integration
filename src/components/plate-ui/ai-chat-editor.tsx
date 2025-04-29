'use client';

import React, { memo } from 'react';

import { withProps } from '@udecode/cn';
import { BaseParagraphPlugin, SlateLeaf } from '@udecode/plate';
import { useAIChatEditor } from '@udecode/plate-ai/react';
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote';
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@udecode/plate-code-block';
import { BaseHeadingPlugin, HEADING_KEYS } from '@udecode/plate-heading';
import { BaseIndentPlugin } from '@udecode/plate-indent';
import { BaseIndentListPlugin } from '@udecode/plate-indent-list';
import { BaseLinkPlugin } from '@udecode/plate-link';
import { usePlateEditor } from '@udecode/plate/react';
import { EditorStatic } from './editor-static';



const components = {
  [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
  [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
  [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 's' }),
  [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
};

const plugins = [
  BaseBlockquotePlugin,
  BaseBoldPlugin,
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodePlugin,
  BaseCodeSyntaxPlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseUnderlinePlugin,
  BaseHeadingPlugin,
  BaseLinkPlugin,
  BaseParagraphPlugin,
  BaseIndentPlugin.extend({
    inject: {
      targetPlugins: [BaseParagraphPlugin.key],
    },
  }),
  BaseIndentListPlugin.extend({
    inject: {
      targetPlugins: [BaseParagraphPlugin.key],
    },
    options: {
      listStyleTypes: {

      },
    },
  }),
];

export const AIChatEditor = memo(({ content }: { content: string }) => {
  const aiEditor = usePlateEditor({
    plugins,
  });

  useAIChatEditor(aiEditor, content);

  return (
    <EditorStatic variant="aiChat" components={components} editor={aiEditor} />
  );
});
