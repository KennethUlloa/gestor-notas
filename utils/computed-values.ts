import { Task, TaskStaus } from "@/db/schema";


export function taskStatus(task: Task): TaskStaus {
    const dueDate = new Date(task.dueTo);
    const completedDate = new Date(task.completedAt || 0);
    const now = new Date();
    if (completedDate > dueDate || !task.completedAt && dueDate < now) {
        return TaskStaus.LATE;
    } else if (task.completedAt) {
        return TaskStaus.COMPLETED;
    } else {
        return TaskStaus.PENDING;
    }
}