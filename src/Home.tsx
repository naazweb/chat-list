import TaskList from './components/TaskList';
import ChatPanel from './components/ChatPanel';
import { useTasks } from './hooks/useTasks';
import './Home.css';

function Home() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();

  return (
    <div className="home-container">
      <div className="split-screen">
        <div className="left-panel">
          <TaskList
            title="My Tasks"
            tasks={tasks}
            toggleTaskStatus={toggleTaskStatus}
          />
        </div>
        <div className="right-panel">
          <ChatPanel
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;