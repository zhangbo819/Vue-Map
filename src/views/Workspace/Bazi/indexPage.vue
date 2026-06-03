<template>
  <BaziPan />

  <!-- 弹窗 -->
  <bazi-modal />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import { useSystemStore } from '@/store/system.js';
import BaziPan from './tabs/BaziPan.vue';
import BaziModal from './components/BaziModal.vue';

const systemStore = useSystemStore();

onBeforeMount(() => {
  console.log('bazi onBeforeMount');
  console.time('bazi');
  systemStore.loading = true;
});
onMounted(() => {
  console.log('bazi onMounted');
  console.timeEnd('bazi');
  systemStore.loading = false;
});
</script>
