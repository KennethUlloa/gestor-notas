import { Task, TaskStatus } from "@/db/schema";

export function taskStatus(task: Task): TaskStatus {
  const dueDate = new Date(task.dueTo);
  const completedDate = new Date(task.completedAt || 0);
  const now = new Date();
  if (completedDate > dueDate || (!task.completedAt && dueDate < now)) {
    return TaskStatus.LATE;
  } else if (task.completedAt) {
    return TaskStatus.COMPLETED;
  } else {
    return TaskStatus.PENDING;
  }
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