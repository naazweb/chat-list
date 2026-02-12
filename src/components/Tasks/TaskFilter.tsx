import './TaskList.css';

interface TaskFilterProps {
  currentFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

export function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="task-filters">
      <button 
        className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All Tasks
      </button>
      <button 
        className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
        onClick={() => onFilterChange('pending')}
      >
        Pending
      </button>
      <button 
        className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
}
