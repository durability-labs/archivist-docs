<!-- https://vitepress.dev/guide/extending-default-theme#layout-slots -->
<script setup>
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <div>
        <iframe
          width="520"
          height="315"
          src="https://www.youtube.com/embed/NZEOilcLdKA?si=WrnLR1Mm71FkgFvC?controls=0"
          title="Codex @ depin:con - Codex: Data Durability Engine & DSN (Presentation)"
          frameborder="0"
          allow="encrypted-media"
          allowfullscreen>
        </iframe>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
