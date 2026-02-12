import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../lib/schemas/task';

// Using a const for the data file path ensures single source of truth
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

class TaskService {
    private ensureDataFile() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
        }
    }

    private readTasks(): Task[] {
        try {
            this.ensureDataFile();
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading tasks:', error);
            return [];
        }
    }

    private writeTasks(tasks: Task[]): void {
        try {
            this.ensureDataFile();
            fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.error('Error writing tasks:', error);
        }
    }

    getAll(): Task[] {
        return this.readTasks();
    }

    getById(id: string): Task | undefined {
        return this.readTasks().find(t => t.id === id);
    }

    create(data: CreateTaskDTO): Task {
        const tasks = this.readTasks();
        const newTask: Task = {
            id: uuidv4(),
            title: data.title,
            status: 'pending',
            createdAt: new Date().toISOString(),
            dueDate: data.dueDate,
            priority: data.priority,
        };

        this.writeTasks([...tasks, newTask]);
        return newTask;
    }

    update(id: string, updates: Partial<Task>): Task | undefined {
        const tasks = this.readTasks();
        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) return undefined;

        const currentTask = tasks[index];
        const updatedTask = { ...currentTask, ...updates };

        tasks[index] = updatedTask;
        this.writeTasks(tasks);

        return updatedTask;
    }

    delete(id: string): boolean {
        const tasks = this.readTasks();
        const filteredTasks = tasks.filter(t => t.id !== id);

        if (filteredTasks.length === tasks.length) return false;

        this.writeTasks(filteredTasks);
        return true;
    }
}

export const taskService = new TaskService();
