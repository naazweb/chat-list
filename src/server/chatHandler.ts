import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { taskService } from '../services/taskService';

function getApiKey(): string {
    if (process.env.OPENAI_API_KEY) {
        return process.env.OPENAI_API_KEY;
    }
    throw new Error('OPENAI_API_KEY not found');
}

export async function handleChatRequest(request: Request): Promise<Response> {
    try {
        const { messages } = await request.json();

        const apiKey = getApiKey();
        const openai = createOpenAI({ apiKey });

        const result = streamText({
            model: openai('gpt-5.2'),
            messages,
            system: `You are a helpful task management assistant. You help users manage their task list.
When adding a task, extract the title, due date, and priority from the user's message.
When listing tasks, ALWAYS use the getTasks tool — the UI will render results as visual cards automatically.
When marking a task done, first use getTasks to find the task by title, then use updateTask with the ID.
When deleting a task, first use getTasks to find the task by title, then use deleteTask with the ID.
Keep your text responses brief when a tool result is being shown — the UI renders task data visually.
Always confirm your actions to the user.
Today's date is ${new Date().toISOString().split('T')[0]}.`,
            tools: {
                addTask: tool({
                    description: 'Add a new task to the task list',
                    parameters: z.object({
                        title: z.string().describe('The title of the task'),
                        dueDate: z.string().nullable().describe('ISO date string for the due date, e.g. 2026-02-13. Use null if not specified.'),
                        priority: z.enum(['low', 'medium', 'high']).nullable().describe('Priority level. Use null to default to medium.'),
                    }),
                    execute: async (input) => {
                        const newTask = taskService.create({
                            title: input.title,
                            dueDate: input.dueDate || undefined,
                            priority: input.priority || undefined,
                        });
                        return { success: true, task: newTask };
                    },
                }),
                updateTask: tool({
                    description: 'Update a task (change status, title, or priority)',
                    parameters: z.object({
                        id: z.string().describe('The ID of the task to update'),
                        updates: z.object({
                            status: z.enum(['pending', 'completed']).nullable().describe('New status. Use null to keep unchanged.'),
                            title: z.string().nullable().describe('New title. Use null to keep unchanged.'),
                            priority: z.enum(['low', 'medium', 'high']).nullable().describe('New priority. Use null to keep unchanged.'),
                        }),
                    }),
                    execute: async ({ id, updates }) => {
                        const cleanUpdates = Object.fromEntries(
                            Object.entries(updates).filter(([_, v]) => v !== null)
                        );
                        // Cast updates to Partial<Task> minus id
                        const result = taskService.update(id, cleanUpdates as any);
                        return { success: !!result, task: result };
                    },
                }),
                deleteTask: tool({
                    description: 'Delete a task from the task list',
                    parameters: z.object({
                        id: z.string().describe('The ID of the task to delete'),
                    }),
                    execute: async ({ id }) => {
                        const success = taskService.delete(id);
                        return { success };
                    },
                }),
                getTasks: tool({
                    description: 'Get all tasks from the task list. Use this to find task IDs before updating or deleting.',
                    parameters: z.object({}),
                    execute: async () => {
                        return taskService.getAll();
                    },
                }),
            },
            maxSteps: 5,
        });

        return result.toDataStreamResponse({
            getErrorMessage: (error: unknown) => {
                console.error('[Chat API] Stream error:', error);
                return error instanceof Error ? `Error: ${error.message}` : String(error);
            },
        });
    } catch (error: any) {
        console.error('[Chat API] Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
