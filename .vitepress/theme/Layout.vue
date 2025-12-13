<!-- Terminal Aesthetic Layout for Archivist Docs -->
<script setup>
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <img
        src="/logos/archivist-terminal.svg"
        alt="Archivist"
        width="280"
        height="280"
        loading="lazy"
        decoding="async"
        style="display:block;width:100%;max-width:280px;height:auto;margin:0 auto;filter:drop-shadow(0 0 30px rgba(0, 255, 65, 0.3));"
      />
    </template>
  </DefaultTheme.Layout>
</template>
