// Terminal Aesthetic Theme for Archivist Docs
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    // Force dark mode on page load
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  }
}
