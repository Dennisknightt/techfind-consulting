import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isTomorrow from "dayjs/plugin/isTomorrow";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);

export { dayjs };

export function timeAgo(date: Date | string): string {
  return dayjs(date).fromNow();
}

export function friendlyDate(date: Date | string): string {
  const d = dayjs(date);
  if (d.isToday()) return `Today, ${d.format("h:mm A")}`;
  if (d.isYesterday()) return `Yesterday, ${d.format("h:mm A")}`;
  if (d.isTomorrow()) return `Tomorrow, ${d.format("h:mm A")}`;
  return d.format("D MMM YYYY, h:mm A");
}

export function friendlyDay(date: Date | string): string {
  const d = dayjs(date);
  if (d.isToday()) return "Today";
  if (d.isYesterday()) return "Yesterday";
  if (d.isTomorrow()) return "Tomorrow";
  return d.format("D MMM YYYY");
}

export function daysBetween(a: Date | string, b: Date | string = new Date()): number {
  return dayjs(b).diff(dayjs(a), "day");
}

export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
}
