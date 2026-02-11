
import TaskList from './components/TaskList';
import ChatPanel from './components/ChatPanel';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="split-screen">
        <div className="left-panel">
          <TaskList title="My Tasks" />
        </div>
        <div className="right-panel">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}

export default Home;