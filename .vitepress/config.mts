// import { defineConfig } from 'vitepress'
import mdFootnote from 'markdown-it-footnote'
import { withMermaid } from 'vitepress-plugin-mermaid'
// const { BASE: base = '/' } = process.env;

const HOSTNAME = 'https://docs.archivist.storage'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  lang: 'en-US',
  title: 'Archivist Docs',
  description: 'Decentralised data storage platform',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: false,
  appearance: 'dark',

  sitemap: { hostname: HOSTNAME },

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
    // Favicons
    ['link', { rel: 'icon', href: '/favicons/favicon.svg', type: 'image/svg+xml' }],
    // Meta description
    ['meta', { name: 'description', content: 'Learn how to use Archivist, the decentralized durability engine. Guides, API reference, and architecture docs.' }],
    // Open Graph (static defaults — title/desc/type set dynamically in transformHead)
    ['meta', { property: 'og:image', content: `${HOSTNAME}/assets/social/og-article.png` }],
    ['meta', { property: 'og:image:secure_url', content: `${HOSTNAME}/assets/social/og-article.png` }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Archivist Documentation - Decentralized Durability Engine' }],
    ['meta', { property: 'og:site_name', content: 'Archivist Docs' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    // Twitter/X (static defaults — title/desc set dynamically in transformHead)
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@ArchivistStrg' }],
    ['meta', { name: 'twitter:image', content: `${HOSTNAME}/assets/social/og-article.png` }],
    ['meta', { name: 'twitter:image:alt', content: 'Archivist Documentation - Decentralized Durability Engine' }],
  ],

  transformPageData(pageData) {
    const path = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const canonical = path ? `${HOSTNAME}/${path}` : HOSTNAME
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }]
    )
  },

  transformHead({ pageData }) {
    const head: any[] = []
    const path = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const canonical = path ? `${HOSTNAME}/${path}` : HOSTNAME
    const title = pageData.title || 'Archivist Documentation'
    const description = pageData.description || pageData.frontmatter?.description || 'Archivist technical documentation'

    // Dynamic OG + Twitter per page
    head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    )

    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description,
      url: canonical,
      image: `${HOSTNAME}/assets/social/og-article.png`,
      dateModified: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined,
      author: { '@type': 'Organization', name: 'Durability Labs', url: 'https://archivist.storage' },
      publisher: {
        '@type': 'Organization',
        name: 'Durability Labs',
        logo: { '@type': 'ImageObject', url: 'https://archivist.storage/assets/logos/archivist-terminal.svg' }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
    })])
    return head
  },

  srcExclude: ['README.md', 'vendor/**'],

  outDir: './.vitepress/dist',
  assetsDir: 'assets',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Whitepaper', link: '/learn/whitepaper' },
      { text: 'Tokenomics Litepaper', link: '/learn/tokenomics-litepaper' },
      {
        text: 'Archivist',
        items: [
          { text: 'About', link: '/archivist/about' },
          { text: 'Security', link: '/archivist/security' },
          { text: 'Privacy Policy', link: '/archivist/privacy-policy' },
          { text: 'Terms of Use', link: '/archivist/terms-of-use' }
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
      alt: 'Archivist Docs',
      light: '/logos/archivist-terminal.svg',
      dark: '/logos/archivist-terminal.svg',
    },

    siteTitle: 'Archivist Docs',

    logoLink: '/learn/what-is-archivist',

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is Archivist?', link: '/learn/what-is-archivist' },
          { text: 'Architecture', link: '/learn/architecture' },
          { text: 'Whitepaper', link: '/learn/whitepaper' },
          { text: 'Tokenomics Litepaper', link: '/learn/tokenomics-litepaper' }
        ]
      },
      {
        text: 'Setup Archivist Manually',
        collapsed: false,
        items: [
          { text: 'Disclaimer', link: '/archivist/disclaimer' },
          { text: 'Quick start', link: '/learn/quick-start' },
          { text: 'Build Archivist', link: '/learn/build' },
          { text: 'Run Archivist', link: '/learn/run' },
          { text: 'Using Archivist', link: '/learn/using' },
          { text: 'Local Two Client Test', link: '/learn/local-two-client-test' },
          { text: 'Local Marketplace', link: '/learn/local-marketplace' },
          { text: 'Download Flow', link: '/learn/download-flow' },
          { text: 'Troubleshoot', link: '/learn/troubleshoot' }
        ]
      },
      {
        text: 'Archivist networks',
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
        text: 'Archivist',
        collapsed: false,
        items: [
          { text: 'About', link: '/archivist/about' },
          { text: 'Security', link: '/archivist/security' },
          { text: 'Privacy Policy', link: '/archivist/privacy-policy' },
          { text: 'Terms of Use', link: '/archivist/terms-of-use' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/durability-labs/archivist-docs' },
      { icon: 'twitter', link: 'https://x.com/ArchivistStrg' },
      { icon: 'youtube', link: 'https://www.youtube.com/@ArchivistStorage' },
      { icon: 'discord', link: 'https://discord.gg/4yHFJErnCp' }
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
