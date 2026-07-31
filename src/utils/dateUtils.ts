/**
 * RepOS Date Utilities
 * Standard date formatting and calculation functions.
 */

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getDaysAgo = (dateStr: string): number => {
  if (!dateStr) return 999;
  const d1 = new Date(dateStr).getTime();
  const d2 = new Date().getTime();
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatRelativeTime = (dateStr: string): string => {
  const days = getDaysAgo(dateStr);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(dateStr);
};
