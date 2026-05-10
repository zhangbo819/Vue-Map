<template>
  <div style="width: 100%">
    <h1 style="margin-bottom: 8px; font-size: 1.6em">Astrology</h1>
    <!-- 星座盘 -->
    <astro-round-plate :data="data" />

    <!-- 操作栏 -->
    <astro-operation v-model:time="time" />

    <van-collapse v-model="activeTab">
      <!-- 参数详情列表 -->
      <van-collapse-item name="1">
        <template #title>
          <h2>参数详情列表</h2>
        </template>
        <van-cell-group inset>
          <van-cell
            v-for="item in data"
            :key="item.name"
            :title="`${item.name} ${planentsMap[item.name].name}`"
            :label="item.longitude"
            :title-style="{ color: planentsMap[item.name].color }"
          >
            <p class="value" :style="{ color: map12[item.sign].color }">
              {{ item.sign }} {{ map12[item.sign].name }}
              <span v-if="item.retrograde">R</span>
            </p>
            <p class="value">{{ item.degree }}°</p>
          </van-cell>
        </van-cell-group>
      </van-collapse-item>

      <!-- 相位 -->
      <van-collapse-item name="2">
        <template #title> <h2>主要相位</h2></template>
        <van-cell-group inset>
          <van-cell
            v-for="item in aspectData"
            :key="item.between"
            :label="item.between.join(' - ')"
          >
            <template #title>
              <p>
                <span :style="{ color: planentsMap[item.between[0]].color }">{{
                  planentsMap[item.between[0]].name
                }}</span>
                -
                <span :style="{ color: planentsMap[item.between[1]].color }">{{
                  planentsMap[item.between[1]].name
                }}</span>
              </p>
            </template>
            <p class="value" :style="{ color: aspectPosition.map[item.type].color }">
              {{ item.type }} {{ aspectPosition.map[item.type].name }}
            </p>
            <p class="value">
              开始时间 {{ item.window.start.toLocaleDateString() }}
              {{ item.window.start.getHours() }}:{{ item.window.start.getMinutes() }}
            </p>
            <p class="value">
              力量最强 {{ item.window.exact.toLocaleDateString() }}
              {{ item.window.exact.getHours() }}:{{ item.window.exact.getMinutes() }}
            </p>
            <p class="value">
              结束时间 {{ item.window.end.toLocaleDateString() }}
              {{ item.window.end.getHours() }}:{{ item.window.end.getMinutes() }}
            </p>
            <p class="value">计算耗时 {{ item.window._t }} ms</p>
            <!-- <p
          class="value"
          :style="{
            fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
          }"
        >
          {{ item.strength }} ({{ item.orb }}°)
        </p> -->
          </van-cell>
        </van-cell-group>
      </van-collapse-item>

      <!-- 八字 临时放这里 -->
      <van-collapse-item name="3">
        <template #title>
          <h2>八字</h2>
        </template>
        <BaziPan :time="time" />
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAllPlanets, aspectPosition, AspectPatternEngine } from '@/utils/astro/planets';
import { map12, planentsMap } from '@/utils/astro/astroUI';
import AstroOperation from './components/AstroOperation.vue';
import AstroRoundPlate from './components/AstroRoundPlate.vue';
import BaziPan from '../Bazi/components/BaziPan.vue';

const time = ref(new Date());
// const time = ref(new Date(2025, 7, 17)); // 俩风筝 俩三角 神秘矩形
// const time = ref(new Date(2014, 3, 23)); // 大十字

const data = computed(() => {
  return getAllPlanets(time.value);
});

const activeTab = ref(['1', '2', '3']);

const aspectData = computed(() => {
  const res = aspectPosition.getData(data.value).map((i) => {
    const r = aspectPosition.findAspectWindow(time.value, i.between[0], i.between[1], i.type);
    return {
      ...i,
      window: r,
    };
  });
  const engine = new AspectPatternEngine(res);
  const patterns = engine.detectAll();

  if (patterns.length) {
    console.log(patterns);
  }

  return res;
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
