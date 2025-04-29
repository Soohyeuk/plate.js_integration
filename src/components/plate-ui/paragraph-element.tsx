import React from 'react';
import { PlateElement, type PlateElementProps } from '@udecode/plate/react';

// Props that should not be passed to DOM elements
const EXCLUDED_PROPS = [
  'setOption',
  'setOptions',
  'getOption',
  'getOptions',
];

export function ParagraphElement({ attributes, children, element, ...props }: PlateElementProps) {
  // Filter out non-DOM props
  const domProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !EXCLUDED_PROPS.includes(key))
  );

  // If this is an AI chat element, render as a div instead of p
  if (element.type === 'aiChat') {
    return (
      <div
        {...attributes}
        className="my-2 p-2 rounded-md bg-muted"
        contentEditable={false}
        {...domProps}
      >
        {children}
      </div>
    );
  }

  // Otherwise render as a normal paragraph
  return (
    <p
      {...attributes}
      className="my-2"
      {...domProps}
    >
      {children}
    </p>
  );
} 