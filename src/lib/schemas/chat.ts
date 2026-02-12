import { z } from 'zod';

export const ToolResultSchema = z.object({
    id: z.string(),
    toolName: z.string(),
    result: z.any().optional(),
    args: z.any().optional(),
    state: z.string().optional(), // 'result', 'call', 'partial-call'
});

export const ChatMessageSchema = z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system', 'data']),
    content: z.string(),
    createdAt: z.date().optional(),
    parts: z.array(z.any()).optional(), // AI SDK v4 parts
    toolInvocations: z.array(z.any()).optional(), // Legacy or top-level tool invocations
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ToolResult = z.infer<typeof ToolResultSchema>;
