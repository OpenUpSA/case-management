export function yearMonthLabel(date: Date) {
  const label = date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short'
  });
  return label;
}

export function monthLabel(date: Date) {
  const label = date.toLocaleDateString('en', {
    month: 'short'
  });
  return label;
}
