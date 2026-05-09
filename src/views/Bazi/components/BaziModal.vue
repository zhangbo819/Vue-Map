<template>
  <van-popup v-model:show="store.visible" round closeable class="bazi-popup">
    <header>
      <h2>{{ store.title }}</h2>
    </header>
    <section>
      <p>{{ store.text }}</p>
      <!-- 这里放你的八字内容 -->
      <!-- <slot :payload="store.payload">
            <pre>{{ store.payload }}</pre>
          </slot> -->
    </section>
  </van-popup>
</template>

<script setup lang="ts">
import { useBaziModalStore } from '@/store/baziModal';

const store = useBaziModalStore();
</script>

<style scoped>
.bazi-popup {
  padding: 0 2em 1em;
  min-width: 50%;
  max-width: 90%;
  text-align: left;
}
</style>
