<template>
  <BaziPan :time="store.time" />

  <!-- 弹窗 -->
  <bazi-modal />
</template>

<script setup lang="ts">
import { useAstroStore } from '@/store/astro';
import BaziPan from './tabs/BaziPan.vue';
import BaziModal from './components/BaziModal.vue';

const store = useAstroStore();
</script>
