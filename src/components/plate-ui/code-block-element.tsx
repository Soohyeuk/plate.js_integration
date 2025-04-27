import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate/react';

export function CodeBlockElement(props: PlateElementProps) {
  return (
    <PlateElement 
      {...props}
      as="pre"
      className="bg-gray-100 p-4 rounded my-4 font-mono"
    />
  );
} 