import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useChat } from 'ai/react'
import { getTasks } from '../server/functions'
import { ChatPanel } from '../components/Chat'
import { TaskList } from '../components/Tasks'
import './index.css'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getTasks(),
})

function Home() {
  const tasks = Route.useLoaderData()
  const router = useRouter()
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    onFinish: () => {
      // Invalidate the router to refresh the task list after AI actions
      router.invalidate()
    }
  })

  return (
    <div className="app-container">
      <div className="left-panel">
        <TaskList tasks={tasks} />
      </div>
      <div className="right-panel">
         <ChatPanel 
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}