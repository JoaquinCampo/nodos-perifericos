/**
 * Parses a date string as a local date, avoiding timezone issues.
 * When dates come from the backend as date-only strings (e.g., "2024-01-15"),
 * they should be interpreted as local dates, not UTC dates.
 *
 * @param dateString - Date string in ISO format (YYYY-MM-DD) or ISO datetime format
 * @returns Date object representing the local date
 */
export function parseLocalDate(dateString: string): Date {
  // If the string is just a date (YYYY-MM-DD), parse it as local date
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year!, month! - 1, day);
  }

  // If it's a datetime string, parse it normally
  return new Date(dateString);
}
