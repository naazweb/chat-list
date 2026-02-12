import './TaskList.css';

interface TaskStatsProps {
  pendingCount: number;
  completedCount: number;
}

export function TaskStats({ pendingCount, completedCount }: TaskStatsProps) {
  return (
    <div className="task-header">
      <h2>Task Overview</h2>
      <div className="task-stats">
        <span className="stat">
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </span>
        <span className="stat-divider">•</span>
        <span className="stat">
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </span>
      </div>
    </div>
  );
}
