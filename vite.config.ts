import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

function chatApiPlugin() {
  return {
    name: 'chat-api-middleware',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          return next()
        }

        try {
          // Collect the request body
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk))
          }
          const body = Buffer.concat(chunks).toString()

          // Dynamically import the handler (uses Vite's SSR module runner)
          const mod = await server.ssrLoadModule('/src/server/chatHandler.ts')

          // Create a proper Request object
          const request = new Request(`http://localhost${req.url}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
          })

          const response: Response = await mod.handleChatRequest(request)

          // Stream the response back
          res.writeHead(response.status, {
            'Content-Type': response.headers.get('content-type') || 'text/plain',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          })

          if (response.body) {
            const reader = response.body.getReader()
            const pump = async () => {
              while (true) {
                const { done, value } = await reader.read()
                if (done) {
                  res.end()
                  return
                }
                res.write(value)
              }
            }
            await pump()
          } else {
            const text = await response.text()
            res.end(text)
          }
        } catch (error: any) {
          console.error('Chat API Error:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: error.message || 'Internal server error' }))
        }
      })
    },
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    chatApiPlugin(),
    tsConfigPaths(),
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
})
