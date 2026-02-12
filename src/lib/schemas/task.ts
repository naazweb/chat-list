import { z } from 'zod';

// Core domain types
export const PrioritySchema = z.enum(['low', 'medium', 'high']);
export const StatusSchema = z.enum(['pending', 'completed']);

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: StatusSchema,
    createdAt: z.string().datetime(),
    dueDate: z.string().optional(),
    priority: PrioritySchema.optional(),
});

// DTOs for creating/updating
export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    dueDate: z.string().optional(),
    priority: PrioritySchema.optional(),
});

export const UpdateTaskSchema = z.object({
    id: z.string(),
    updates: z.object({
        title: z.string().optional(),
        status: StatusSchema.optional(),
        priority: PrioritySchema.optional(),
        dueDate: z.string().optional(),
    }),
});

// TypeScript interfaces inferred from Zod
export type Task = z.infer<typeof TaskSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type Status = z.infer<typeof StatusSchema>;
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
