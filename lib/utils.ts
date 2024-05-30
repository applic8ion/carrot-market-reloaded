export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("us");
  return formatter.format(diff, "days");
}

export function formatToDollar(amount: number): string {
  return amount.toLocaleString("en-US");
}
