const TIME_ZONE = "Europe/Copenhagen";

const timeFmt = new Intl.DateTimeFormat("da-DK", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

const dayFmt = new Intl.DateTimeFormat("da-DK", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
});

/**
 * Formats a wire timestamp the way a news wire reads:
 * HH:MM for anything from today, otherwise "d. 28. okt."
 * Rendered identically on server and client (fixed time zone).
 */
export function wireTime(pubDate?: string): string | null {
  if (!pubDate) return null;

  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return null;

  return timeFmt.format(date);
}

export function wireDay(pubDate?: string): string | null {
  if (!pubDate) return null;

  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return null;

  return dayFmt.format(date);
}

/** "14:32" when the article is from today, otherwise "28. okt." */
export function wireStamp(pubDate?: string): string | null {
  if (!pubDate) return null;

  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return null;

  const today = dayFmt.format(new Date());
  return dayFmt.format(date) === today
    ? timeFmt.format(date)
    : dayFmt.format(date);
}
