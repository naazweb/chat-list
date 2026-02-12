import { createServerFn } from '@tanstack/react-start';
import { taskService } from '../services/taskService';

// Re-export types if needed by frontend
export type { Task } from '../lib/schemas/task';

export const getTasks = createServerFn({ method: "GET" }).handler(async () => {
    return taskService.getAll();
});

export const addTask = createServerFn({ method: "POST" })
    .inputValidator((data: { title: string; dueDate?: string; priority?: 'low' | 'medium' | 'high' }) => data)
    .handler(async ({ data }) => {
        return taskService.create({
            title: data.title,
            dueDate: data.dueDate,
            priority: data.priority,
        });
    });

export const updateTask = createServerFn({ method: "POST" })
    .inputValidator((data: { id: string; updates: any }) => data)
    .handler(async ({ data }) => {
        return taskService.update(data.id, data.updates);
    });

export const deleteTask = createServerFn({ method: "POST" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        const success = taskService.delete(id);
        return { success, id };
    });
