import * as React from 'react';

interface EmptyContentProps {
  content: string | number | null | undefined;
  contentDisplay: React.ReactNode;
  emptyValue?: String;
}

export const EmptyContent = ({content, contentDisplay, emptyValue = '-'}: EmptyContentProps) => (
  <>{content || content === 0 ? contentDisplay : emptyValue}</>
);
