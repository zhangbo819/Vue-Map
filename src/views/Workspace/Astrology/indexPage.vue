<template>
  <van-tabs v-model:active="activeTop" swipeable animated sticky>
    <van-tab title="基本信息">
      <astro-base :time="time" />
    </van-tab>
    <van-tab title="格局分析">
      <div
        :style="{
          'min-height': '500px',
        }"
      >
        格局分析
      </div>
    </van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AstroBase from './tabs/AstroBase.vue';

// TODO store
const props = defineProps({
  time: {
    type: Date,
    required: true,
  },
});

const activeTop = ref(0);
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
}
</style>
