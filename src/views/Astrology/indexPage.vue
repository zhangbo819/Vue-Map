<template>
  <div style="width: 100%">
    <h1 style="margin-bottom: 8px; font-size: 1.6em">Astrology</h1>
    <!-- 星座盘 -->
    <astro-round-plate :time="time" :data="data" />

    <!-- 操作栏 -->
    <astro-operation v-model:time="time" />

    <!-- 参数详情列表 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getAllPlanets, PlanetItem } from "@/utils/planets";
import AstroOperation from "./components/AstroOperation.vue";
import AstroRoundPlate from "./components/AstroRoundPlate.vue";
import { map12, planentsMap } from "./astroUI";
// import { showSuccessToast } from "vant";

const time = ref(new Date());
const data = ref<PlanetItem[]>([]);

watch(
  () => time.value,
  (val) => {
    data.value = getAllPlanets(val);
    // console.log([...data.value]);
  },
  { immediate: true }
);
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
