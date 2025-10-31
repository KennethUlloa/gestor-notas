import { Task, TaskStatus } from "@/db/schema";
import { getDate, ValidDate } from "./formatters";

export function taskStatus(task: Task): TaskStatus {
  return task.completedAt ? TaskStatus.COMPLETED : TaskStatus.PENDING;
  
}

type FromNow = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export function dateFromNow({
  years,
  months,
  days,
  hours,
  minutes,
  seconds,
}: FromNow) {
  const now = new Date();
  now.setSeconds(now.getSeconds() + (seconds || 0))
  now.setMinutes(now.getMinutes() + (minutes || 0))
  now.setHours(now.getHours() + (hours || 0))
  now.setDate(now.getDate() + (days || 0))
  now.setMonth(now.getMonth() + (months || 0))
  now.setFullYear(now.getFullYear() + (years || 0))
  return now;
}

export function empty(obj: any) {
  return obj === undefined || obj === null;
}

export function daysAppart(moment1: ValidDate, moment2: ValidDate, withSign = false) {
  const time1 = getDate(moment1).getTime();
  const time2 = getDate(moment2).getTime();
  const diff = Math.abs(time1 - time2);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const sign = time1 < time2 ? -1 : 1;
  return withSign ? sign * days : days;
}
