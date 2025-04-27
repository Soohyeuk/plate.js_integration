import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate/react';

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement 
      {...props}
      as="blockquote"
      className="border-l-4 border-gray-300 pl-4 my-4"
    />
  );
} 