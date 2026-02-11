import { useState, useEffect } from 'react';

export interface Task {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    createdAt: Date;
}

const STORAGE_KEY = 'chat-list-tasks';

// Sample initial tasks
const initialTasks: Task[] = [
    {
        id: '1',
        title: 'Review project documentation',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        createdAt: new Date(),
    },
    {
        id: '2',
        title: 'Update dependencies',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date(),
    },
    {
        id: '3',
        title: 'Write unit tests',
        status: 'completed',
        priority: 'high',
        createdAt: new Date(Date.now() - 86400000), // Yesterday
    },
];

// Helper to serialize tasks with Date objects
const serializeTasks = (tasks: Task[]): string => {
    return JSON.stringify(tasks);
};

// Helper to deserialize tasks with Date objects
const deserializeTasks = (json: string): Task[] => {
    const parsed = JSON.parse(json);
    // Convert date strings back to Date objects
    return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
};

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        // Load from localStorage on initial mount
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return deserializeTasks(stored);
            }
        } catch (error) {
            console.error('Failed to load tasks from localStorage:', error);
        }
        return initialTasks;
    });

    // Sync to localStorage whenever tasks change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, serializeTasks(tasks));
        } catch (error) {
            console.error('Failed to save tasks to localStorage:', error);
        }
    }, [tasks]);

    // Add a new task
    const addTask = (
        title: string,
        options?: {
            priority?: Task['priority'];
            dueDate?: Date;
        }
    ) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            status: 'pending',
            priority: options?.priority || 'medium',
            dueDate: options?.dueDate,
            createdAt: new Date(),
        };
        setTasks((prev) => [newTask, ...prev]);
        return newTask;
    };

    // Update an existing task
    const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...updates } : task
            )
        );
    };

    // Delete a task
    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    // Toggle task status
    const toggleTaskStatus = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status: task.status === 'pending' ? 'completed' : 'pending',
                    }
                    : task
            )
        );
    };

    // Get tasks by filter
    const getTasksByStatus = (status?: 'pending' | 'completed') => {
        if (!status) return tasks;
        return tasks.filter((task) => task.status === status);
    };

    // Clear all tasks
    const clearAllTasks = () => {
        setTasks([]);
    };

    return {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getTasksByStatus,
        clearAllTasks,
    };
}
