/**
 * Pakistan Standard Time (PST, UTC+5) date utility module
 * Provides offline timezone conversion and date formatting
 */

const PST_OFFSET_HOURS = 5;
const PST_OFFSET_MS = PST_OFFSET_HOURS * 60 * 60 * 1000;

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Get current date in Pakistan Standard Time
 * @returns Date string in yyyy-mm-dd format
 */
export function getCurrentPSTDate(): string {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pstTime = new Date(utcTime + PST_OFFSET_MS);
  
  const year = pstTime.getUTCFullYear();
  const month = String(pstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(pstTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Format PST date for display
 * @param dateStr Date string in yyyy-mm-dd format
 * @returns Formatted string like "FEB 13" (uppercase month, no leading zero on day)
 */
export function formatPSTDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const monthName = MONTH_NAMES[month - 1] || 'jan';
  const dayNum = day; // No leading zero
  
  return `${monthName.toUpperCase()} ${dayNum}`;
}

/**
 * Parse PST date string to Date object
 * @param dateStr Date string in yyyy-mm-dd format
 * @returns Date object
 */
export function parsePSTDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get PST date for a specific timestamp
 * @param timestamp Unix timestamp in milliseconds
 * @returns Date string in yyyy-mm-dd format
 */
export function getPSTDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  const pstTime = new Date(utcTime + PST_OFFSET_MS);
  
  const year = pstTime.getUTCFullYear();
  const month = String(pstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(pstTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Get array of past PST dates
 * @param days Number of days to go back
 * @returns Array of date strings in yyyy-mm-dd format, newest first
 */
export function getPastPSTDates(days: number): string[] {
  const dates: string[] = [];
  const today = getCurrentPSTDate();
  const todayDate = parsePSTDate(today);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
}

/**
 * Calculate milliseconds until next PST midnight
 * @returns Milliseconds until midnight PST
 */
export function getMillisecondsUntilPSTMidnight(): number {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pstTime = new Date(utcTime + PST_OFFSET_MS);
  
  const nextMidnight = new Date(pstTime);
  nextMidnight.setUTCHours(0, 0, 0, 0);
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
  
  const nextMidnightUTC = nextMidnight.getTime() - PST_OFFSET_MS;
  const nowUTC = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  return nextMidnightUTC - nowUTC;
}
