import type { Task } from '../../lib/schemas/task';
import './TaskList.css';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, status: 'pending' | 'completed') => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleStatus, onDelete }: TaskItemProps) {
  return (
    <div className={`task-item ${task.status}`}>
      <div className="task-checkbox-container">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggleStatus(task.id, task.status)}
          id={`task-${task.id}`}
        />
        <label htmlFor={`task-${task.id}`} className="checkbox-label"></label>
      </div>
      
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span className="task-time">
            {new Date(task.createdAt).toLocaleString([], { 
              month: 'short',
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {task.priority && (
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
          )}
          {task.dueDate && (
            <span className="due-date">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <button 
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
        </svg>
      </button>
    </div>
  );
}
