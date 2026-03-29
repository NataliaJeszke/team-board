import { TASK_PRIORITY, TASK_STATUS } from "../constants/task-dialog.constants";

export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];