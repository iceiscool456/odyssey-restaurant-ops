import { color } from './color';

export const statusTone = {
  pending: { fg: color.warning, bg: color.warningMuted, label: 'Pending' },
  accepted: { fg: color.info, bg: color.infoMuted, label: 'Accepted' },
  preparing: { fg: color.accent, bg: color.accentMuted, label: 'Preparing' },
  ready: { fg: color.success, bg: color.successMuted, label: 'Ready' },
  completed: { fg: color.inkMuted, bg: color.canvasSubtle, label: 'Completed' },
  cancelled: { fg: color.danger, bg: color.dangerMuted, label: 'Cancelled' },
  success: { fg: color.success, bg: color.successMuted, label: 'Success' },
  warning: { fg: color.warning, bg: color.warningMuted, label: 'Warning' },
  error: { fg: color.danger, bg: color.dangerMuted, label: 'Error' },
  info: { fg: color.info, bg: color.infoMuted, label: 'Info' },
  loading: { fg: color.inkMuted, bg: color.canvasSubtle, label: 'Loading' },
  empty: { fg: color.inkMuted, bg: color.canvasSubtle, label: 'Empty' },
} as const;

export type StatusTone = keyof typeof statusTone;
