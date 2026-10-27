import { subMonths } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { APP_TIMEZONE } from "@/lib/constants/app";

export function getMonthDateRanges() {
  const now = new Date();
  const nowInTZ = toZonedTime(now, APP_TIMEZONE);

  const startOfMonth = fromZonedTime(
    new Date(nowInTZ.getFullYear(), nowInTZ.getMonth(), 1, 0, 0, 0, 0),
    APP_TIMEZONE
  );

  const startOfLastMonth = fromZonedTime(
    new Date(nowInTZ.getFullYear(), nowInTZ.getMonth() - 1, 1, 0, 0, 0, 0),
    APP_TIMEZONE
  );

  // subMonths clamps to the last day of the previous month (e.g. Mar 31 -> Feb 28)
  const equivalentEndOfLastMonth = fromZonedTime(
    subMonths(nowInTZ, 1),
    APP_TIMEZONE
  );

  return { startOfMonth, startOfLastMonth, equivalentEndOfLastMonth };
}
