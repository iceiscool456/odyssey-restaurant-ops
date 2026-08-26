import type { ReactNode } from 'react';
import { Feedback, SkeletonBlock } from '@odyssey/shared';
import { errorMessage } from '../lib/errors';
import { querySurface } from '../lib/ui-state';

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
  const surface = querySurface({ isLoading, error, isEmpty });
  if (surface === 'loading') return <SkeletonBlock />;
  if (surface === 'error') return <Feedback tone="error" title="Could not load" body={errorMessage(error)} />;
  if (surface === 'empty') {
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
