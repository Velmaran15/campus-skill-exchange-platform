export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const levelColor = (level: string) => {
  const map: Record<string, string> = {
    Beginner: 'bg-jade-light text-jade-dark',
    Intermediate: 'bg-amber-light text-amber-dark',
    Advanced: 'bg-coral-light text-coral-dark',
  };
  return map[level] ?? 'bg-ink-100 text-ink-500';
};

export const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-light text-amber-dark',
    accepted: 'bg-jade-light text-jade-dark',
    rejected: 'bg-coral-light text-coral-dark',
    completed: 'bg-ink-100 text-ink-400',
  };
  return map[status] ?? 'bg-ink-100 text-ink-500';
};

export const getInitials = (name?: string) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
};
