import { formatInTimeZone } from "date-fns-tz";

import { APP_TIMEZONE } from "@/lib/constants/app";

/**
 * Splits an instant into the "yyyy-MM-dd" date and "HH:mm" time
 * expected by the appointment actions, in the barbershop timezone.
 */
export function toAppointmentDateParts(date: Date) {
  return {
    date: formatInTimeZone(date, APP_TIMEZONE, "yyyy-MM-dd"),
    time: formatInTimeZone(date, APP_TIMEZONE, "HH:mm"),
  };
}
