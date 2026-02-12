import fs from 'node:fs';
import path from 'node:path';

export interface Task {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    createdAt: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
}

const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

export const db = {
    read: (): Task[] => {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading tasks:', error);
            return [];
        }
    },
    write: (tasks: Task[]) => {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.error('Error writing tasks:', error);
        }
    }
};
