import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate/react';

export function ParagraphElement(props: PlateElementProps) {
  return (
    <PlateElement 
      {...props}
      as="p"
      className="my-2"
    />
  );
} 