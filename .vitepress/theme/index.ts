// https://vitepress.dev/guide/extending-default-theme#layout-slots
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
}
