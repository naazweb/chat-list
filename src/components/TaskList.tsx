import { useState } from 'react';
import type { Task } from '../hooks/useTasks';
import './TaskList.css';

interface TaskListProps {
  title?: string;
  tasks: Task[];
  toggleTaskStatus: (id: string) => void;
}

function TaskList({ title = 'All Tasks', tasks, toggleTaskStatus }: TaskListProps) {

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div>
          <h2 className="gradient-text">{title}</h2>
          <p className="task-stats">
            {pendingCount} pending · {completedCount} completed
          </p>
        </div>
      </div>

      <div className="task-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task using the AI assistant</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status} animate-fade-in`}
            >
              <div className="task-checkbox-container">
                <button
                  className="task-checkbox"
                  onClick={() => toggleTaskStatus(task.id)}
                  aria-label={
                    task.status === 'completed'
                      ? 'Mark as pending'
                      : 'Mark as completed'
                  }
                >
                  {task.status === 'completed' && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              </div>

              <div className="task-content">
                <h4 className="task-title">{task.title}</h4>
                <div className="task-meta">
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="due-date">
                      📅 {formatDueDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
