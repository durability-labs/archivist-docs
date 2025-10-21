<!-- https://vitepress.dev/guide/extending-default-theme#layout-slots -->
<script setup>
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <img
        src="/public/archivist-mark-primary-white-resized.png"
        alt="Archivist mark"
        width="520"
        height="315"
        loading="lazy"
        decoding="async"
        style="display:block;width:100%;height:auto;aspect-ratio:520/315;object-fit:contain;background:##1b1b1e;"
      />
    </template>
  </DefaultTheme.Layout>
</template>
