const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function parseDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`);
}

export function getTodayISO() {
  const currentDate = new Date();
  const timezoneAdjusted = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
  return timezoneAdjusted.toISOString().slice(0, 10);
}

export function formatShortDate(dateString: string) {
  return shortDateFormatter.format(parseDate(dateString));
}

export function formatLongDate(dateString: string) {
  return longDateFormatter.format(parseDate(dateString));
}
