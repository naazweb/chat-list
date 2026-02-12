import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { updateTask, deleteTask } from '../../server/functions';
import type { Task } from '../../lib/schemas/task';
import { TaskItem } from './TaskItem';
import { TaskFilter } from './TaskFilter';
import { TaskStats } from './TaskStats';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
}

type FilterType = 'all' | 'pending' | 'completed';

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const toggleTaskStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    await updateTask({ 
      data: { 
        id, 
        updates: { status: currentStatus === 'completed' ? 'pending' : 'completed' } 
      } 
    });
    router.invalidate();
  };

  const handleDelete = async (id: string) => {
    await deleteTask({ data: id });
    router.invalidate();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="task-list">
      <TaskStats pendingCount={pendingCount} completedCount={completedCount} />
      
      <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <p>No {filter !== 'all' ? filter : ''} tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggleStatus={toggleTaskStatus} 
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
