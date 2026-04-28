<template>
  <div style="width: 100%">
    <h1 style="margin-bottom: 8px; font-size: 1.6em">Astrology</h1>
    <!-- 星座盘 -->
    <astro-round-plate :data="data" />

    <!-- 操作栏 -->
    <astro-operation v-model:time="time" />

    <!-- 参数详情列表 -->
    <h2>参数详情列表</h2>
    <van-cell-group inset>
      <van-cell
        v-for="item in data"
        :key="item.name"
        :title="`${item.name} ${planentsMap[item.name].name}`"
        :label="item.longitude"
      >
        <p class="value" :style="{ color: map12[item.sign].color }">
          {{ item.sign }} {{ map12[item.sign].name }}
          <span v-if="item.retrograde">R</span>
        </p>
        <p class="value">{{ item.degree }}°</p>
      </van-cell>
    </van-cell-group>

    <h2>主要相位</h2>
    <van-cell-group inset>
      <van-cell
        v-for="item in aspectData"
        :key="item.between"
        :title="`${item.between.map((i) => planentsMap[i].name).join(' - ')}`"
        :label="item.between.join(' - ')"
      >
        <p
          class="value"
          :style="{ color: aspectPosition.map[item.type].color }"
        >
          {{ item.type }} {{ aspectPosition.map[item.type].name }}
        </p>
        <p
          class="value"
          :style="{
            fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
          }"
        >
          {{ item.strength }} ({{ item.orb }}°)
        </p>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getAllPlanets, aspectPosition } from "@/utils/planets";
import AstroOperation from "./components/AstroOperation.vue";
import AstroRoundPlate from "./components/AstroRoundPlate.vue";
import { map12, planentsMap } from "./astroUI";

const time = ref(new Date());

const data = computed(() => {
  return getAllPlanets(time.value);
});

const aspectData = computed(() => {
  return aspectPosition.getData(data.value);
});
</script>

<style lang="scss" scoped>
p,
h1 {
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
