import React from 'react';
import { PlateElement, PlateElementProps } from '@udecode/plate/react';

const styles = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
};

export function HeadingElement({ 
  variant = 'h1', 
  ...props 
}: PlateElementProps & { variant?: keyof typeof styles }) {
  return (
    <PlateElement 
      {...props}
      className={styles[variant]}
      as={variant}
    />
  );
} 