<template>
  <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" />

  <van-tabs v-model:active="activeTop" swipeable animated sticky>
    <van-tab title="标签 1">内容 1</van-tab>
    <van-tab title="标签 2">内容 2</van-tab>
  </van-tabs>

  <van-tabbar v-model="activeBottom" placeholder>
    <van-tabbar-item icon="home-o">星盘</van-tabbar-item>
    <van-tabbar-item icon="search">八字</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const activeTop = ref(0);
const activeBottom = ref(0);

const time = ref(new Date());
const route = useRoute();

watch(
  () => route.query.time,
  (val) => {
    if (typeof val === 'string' && val !== String(time.value.getTime())) {
      time.value = new Date(val);
    }
  }
);

const onClickLeft = () => history.back();
</script>
