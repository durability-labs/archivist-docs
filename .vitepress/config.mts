// import { defineConfig } from 'vitepress'
import mdFootnote from 'markdown-it-footnote'
import { withMermaid } from 'vitepress-plugin-mermaid'
// const { BASE: base = '/' } = process.env;

// https://vitepress.dev/reference/site-config
export default withMermaid({
  lang: 'en-US',
  title: 'Codex Docs',
  description: 'Decentralised data storage platform',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: false,
  appearance: true,

  markdown: {
    math: true,
    config: (md) => {
      md.use(mdFootnote)
    },
  },
  //  base: base,

  mermaid:{
    //mermaidConfig !theme here works for light mode since dark theme is forced in dark mode
  },

  // lite-youtube-embed
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'lite-youtube',
      },
    },
  },

  head: [
    [
      'link', { rel: 'icon', href: '/favicons/favicon.svg', type: 'image/svg+xml' }
    ]
  ],

  srcExclude: ['README.md'],

  outDir: './.vitepress/dist',
  assetsDir: 'assets',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Whitepaper', link: '/learn/whitepaper' },
      { text: 'Tokenomics Litepaper', link: '/learn/tokenomics-litepaper' },
      {
        text: 'Codex',
        items: [
          { text: 'About', link: '/codex/about' },
          { text: 'Security', link: '/codex/security' },
          { text: 'Privacy Policy', link: '/codex/privacy-policy' },
          { text: 'Terms of Use', link: '/codex/terms-of-use' }
        ]
      }
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    editLink: {
      pattern: 'https://github.com/durability-labs/archivist-docs/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    logo: {
      alt: 'Codex • Docs',
      light: '/codex-mark-primary-black-resized.png',
      dark: '/codex-mark-primary-white-resized.png',
    },

    siteTitle: 'Codex • Docs',

    logoLink: '/learn/what-is-codex',

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is Codex?', link: '/learn/what-is-codex' },
          { text: 'Architecture', link: '/learn/architecture' },
          { text: 'Whitepaper', link: '/learn/whitepaper' },
          { text: 'Tokenomics Litepaper', link: '/learn/tokenomics-litepaper' }
        ]
      },
      {
        text: 'Setup Codex with Installer',
        collapsed: false,
        items: [
          { text: 'Disclaimer', link: '/codex/installer-disclaimer' },
          { text: 'Requirements', link: '/learn/installer/requirements' },
          { text: 'Install and Run Codex', link: '/learn/installer/install-and-run' },
          { text: 'Upload/Download', link: '/learn/installer/upload-and-download' },
        ]
      },
      {
        text: 'Setup Codex Manually',
        collapsed: false,
        items: [
          { text: 'Disclaimer', link: '/codex/disclaimer' },
          { text: 'Quick start', link: '/learn/quick-start' },
          { text: 'Build Codex', link: '/learn/build' },
          { text: 'Run Codex', link: '/learn/run' },
          { text: 'Using Codex', link: '/learn/using' },
          { text: 'Local Two Client Test', link: '/learn/local-two-client-test' },
          { text: 'Local Marketplace', link: '/learn/local-marketplace' },
          { text: 'Download Flow', link: '/learn/download-flow' },
          { text: 'Troubleshoot', link: '/learn/troubleshoot' }
        ]
      },
      {
        text: 'Codex networks',
        collapsed: false,
        items: [
          { text: 'Devnet', link: '/networks/devnet' },
          { text: 'Testnet', link: '/networks/testnet' }
        ]
      },
      {
        text: 'Developers',
        collapsed: false,
        items: [
          { text: 'API', link: '/developers/api' }
        ]
      },
      {
        text: 'Codex',
        collapsed: false,
        items: [
          { text: 'About', link: '/codex/about' },
          { text: 'Security', link: '/codex/security' },
          { text: 'Privacy Policy', link: '/codex/privacy-policy' },
          { text: 'Terms of Use', link: '/codex/terms-of-use' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/durability-labs/archivist-docs' },
      { icon: 'twitter', link: 'https://twitter.com/Archivist_storage' },
      { icon: 'youtube', link: 'https://www.youtube.com/@ArchivistStorage' },
      { icon: 'discord', link: 'https://discord.gg/archivist-storage' }
    ]
  },

  // Internationalization - https://vitepress.dev/guide/i18n
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
  }
})
