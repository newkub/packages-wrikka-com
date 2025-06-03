import type { DefaultTheme } from 'vitepress'
import { sidebarAI } from './sidebar/sidebarAi'
import { sidebarTUI } from './sidebar/sidebarTui'
import { sidebarViteReact } from './sidebar/sidebarViteReact'

export const sidebar: DefaultTheme.Sidebar = {
  '/ai/': sidebarAI,
  '/tui/': sidebarTUI,
  '/vite-react/': sidebarViteReact
}
