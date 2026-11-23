import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { getNews } from './api/_newsdata.js'

// Serves /api/news during `npm run dev` and `npm run preview` using the same code as the
// Vercel function, so you can work locally without the Vercel CLI.
const newsApiDev = (apiKey) => {
  // Must not return anything: Vite treats a returned function as a post-middleware hook
  const mount = (server) => {
    server.middlewares.use('/api/news', async (req, res) => {
      const url = new URL(req.url, 'http://localhost')
      const { status, body } = await getNews(
        { category: url.searchParams.get('category'), page: url.searchParams.get('page') },
        apiKey,
      )
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    })
  }
  return { name: 'news-api-dev', configureServer: mount, configurePreviewServer: mount }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' loads every variable from .env files, not just VITE_* ones
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      newsApiDev(env.NEWSDATA_API_KEY),
    ],
    // "@/…" means "src/…" – used by shadcn / Magic UI components (also set in jsconfig.json)
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
