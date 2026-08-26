import type { ReactNode } from 'react';
import { Feedback, SkeletonBlock } from '@odyssey/shared';
import { errorMessage } from '../lib/api';

export function QueryState({
  isLoading,
  error,
  isEmpty,
  emptyTitle,
  emptyBody,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  children: ReactNode;
}) {
  if (isLoading) return <SkeletonBlock />;
  if (error) return <Feedback tone="error" title="Could not load" body={errorMessage(error)} />;
  if (isEmpty) {
    return (
      <Feedback
        tone="empty"
        title={emptyTitle ?? 'Nothing here yet'}
        body={emptyBody ?? 'New records will land here during service.'}
      />
    );
  }
  return <>{children}</>;
}
