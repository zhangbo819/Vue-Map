<template>
  <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" />

  <template v-if="activeBottom === 0">
    <!-- <van-tabs v-model:active="activeTop" swipeable animated sticky>
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
    </van-tabs> -->
    <Astrology :time="time" />
  </template>
  <template v-else-if="activeBottom === 1">
    <bazi-pan :time="time" />
  </template>

  <van-tabbar v-model="activeBottom" placeholder>
    <van-tabbar-item icon="home-o">星盘</van-tabbar-item>
    <van-tabbar-item icon="search">八字</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Astrology from './Astrology/indexPage.vue';
import BaziPan from './Bazi/components/BaziPan.vue';

// const activeTop = ref(0);
const activeBottom = ref(0);

const time = ref(new Date());
const route = useRoute();

watch(
  () => route.query.time,
  (val) => {
    if (Number(val) !== time.value.getTime()) {
      time.value = new Date(Number(val));
    }
  },
  {
    immediate: true,
  }
);

const onClickLeft = () => history.back();
</script>
