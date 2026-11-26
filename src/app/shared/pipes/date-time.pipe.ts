import { Pipe, PipeTransform } from '@angular/core';

/**
 * AppDateTimePipe
 * Converts UTC / Database timestamps to the client's local timezone.
 * Formats in 12-hour format with AM / PM (never 24-hour format).
 * Example: "26 Nov 2026, 2:16 PM"
 */
@Pipe({
  name: 'appDateTime',
  standalone: true
})
export class AppDateTimePipe implements PipeTransform {
  transform(value: any, formatType: 'full' | 'dateOnly' | 'timeOnly' = 'full'): string {
    if (!value) return '';

    let d: Date;
    if (value instanceof Date) {
      d = value;
    } else if (typeof value === 'string') {
      let s = value.trim();
      if (!s) return '';
      // If string is in MySQL format "YYYY-MM-DD HH:MM:SS" (without timezone), parse as UTC
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
        if (!s.endsWith('Z') && !s.includes('+') && !/T.*[+-]\d\d:\d\d/.test(s)) {
          if (!s.includes('T') && s.includes(' ')) {
            s = s.replace(' ', 'T') + 'Z';
          } else if (!s.endsWith('Z')) {
            s = s + 'Z';
          }
        }
      }
      d = new Date(s);
    } else {
      d = new Date(value);
    }

    if (isNaN(d.getTime())) {
      return String(value);
    }

    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    if (formatType === 'dateOnly') {
      return `${day} ${month} ${year}`;
    }

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12

    if (formatType === 'timeOnly') {
      return `${hours}:${minutes} ${ampm}`;
    }

    // Default 'full': "26 Nov 2026, 2:16 PM"
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  }
}
