import { Task, TaskStatus } from "@/db/schema";


export function taskStatus(task: Task): TaskStatus {
    const dueDate = new Date(task.dueTo);
    const completedDate = new Date(task.completedAt || 0);
    const now = new Date();
    if (completedDate > dueDate || !task.completedAt && dueDate < now) {
        return TaskStatus.LATE;
    } else if (task.completedAt) {
        return TaskStatus.COMPLETED;
    } else {
        return TaskStatus.PENDING;
    }
}