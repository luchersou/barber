import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function getMonthDateRanges(timezone: string = "UTC") {
  const now = new Date();
  const nowInTZ = toZonedTime(now, timezone);

  const startOfMonth = fromZonedTime(
    new Date(nowInTZ.getFullYear(), nowInTZ.getMonth(), 1, 0, 0, 0, 0),
    timezone
  );

  const startOfLastMonth = fromZonedTime(
    new Date(nowInTZ.getFullYear(), nowInTZ.getMonth() - 1, 1, 0, 0, 0, 0),
    timezone
  );

  const equivalentEndOfLastMonth = fromZonedTime(
    new Date(
      nowInTZ.getFullYear(),
      nowInTZ.getMonth() - 1,
      nowInTZ.getDate(),
      nowInTZ.getHours(),
      nowInTZ.getMinutes(),
      nowInTZ.getSeconds(),
      nowInTZ.getMilliseconds(),
    ),
    timezone
  );

  return { startOfMonth, startOfLastMonth, equivalentEndOfLastMonth };
}