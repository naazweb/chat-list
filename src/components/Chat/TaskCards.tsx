import type { Task } from '../../lib/schemas/task';
import './TaskCards.css';

// Priority colors & icons
const priorityConfig: Record<string, { bg: string; color: string; label: string }> = {
  high: { bg: '#fef2f2', color: '#dc2626', label: 'High' },
  medium: { bg: '#fffbeb', color: '#d97706', label: 'Medium' },
  low: { bg: '#f0fdf4', color: '#16a34a', label: 'Low' },
};

export function TaskCard({ task }: { task: Task }) {
  const priority = (task.priority && priorityConfig[task.priority]) || priorityConfig.medium;
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-header">
        <span className={`task-card-status-dot ${task.status}`} />
        <span className="task-card-title">{task.title}</span>
      </div>
      <div className="task-card-meta">
        <span
          className="task-card-priority-badge"
          style={{ backgroundColor: priority.bg, color: priority.color }}
        >
          {priority.label}
        </span>
        {task.dueDate && (
          <span className="task-card-due">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export function ToolResultRenderer({ part }: { part: any }) {
  const inv = part.toolInvocation || part;
  const hasResult = inv.state === 'result' || inv.state === 'output-available';
  const result = inv.result || inv.output;
  if (!hasResult || !result) return null;

  const { toolName } = inv;

  if (toolName === 'getTasks' && Array.isArray(result)) {
    if (result.length === 0) {
      return (
        <div className="task-cards-container">
          <div className="task-cards-empty">No tasks found</div>
        </div>
      );
    }
    return (
      <div className="task-cards-container">
        {result.map((task: any) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    );
  }

  if (toolName === 'addTask' && result?.success && result?.task) {
    return (
      <div className="task-cards-container single">
        <div className="task-action-label">Task Added</div>
        <TaskCard task={result.task} />
      </div>
    );
  }

  if (toolName === 'updateTask' && result?.success && result?.task) {
    return (
      <div className="task-cards-container single">
        <div className="task-action-label">Task Updated</div>
        <TaskCard task={result.task} />
      </div>
    );
  }

  if (toolName === 'deleteTask' && result?.success) {
    return (
      <div className="task-cards-container single">
        <div className="task-action-label">Task Deleted</div>
      </div>
    );
  }

  return null;
}
