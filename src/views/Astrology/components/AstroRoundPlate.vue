<template>
  <div class="constellation">
    <div class="line" />
    <div class="line line30" />
    <div class="line line60" />
    <div class="line line90" />
    <div class="line line120" />
    <div class="line line150" />

    <div
      v-for="(item, index) in title12"
      :key="item"
      class="house"
      :style="{ '--angle': `-${15 + index * 30}deg` }"
    >
      <span :style="{ color: map12[item].color }">{{ map12[item].n }}</span>
    </div>

    <!-- 行星盘 -->
    <div class="plate">
      <div class="line" />
      <div class="line line30" />
      <div class="line line60" />
      <div class="line line90" />
      <div class="line line120" />
      <div class="line line150" />

      <div
        v-for="item in data"
        :key="item.name"
        :class="{ star: true, 'no-transition': disableTransition[item.name] }"
        :style="{ '--angle': -1 * css_longitude[item.name] + 'deg' }"
      >
        <!-- :style="{ '--angle': -1 * item.longitude + 'deg' }" -->

        <div class="dot" />
        <p
          class="planent-name"
          :style="{
            color: planentsMap[item.name].color,
            '--rot': -planentRota[item.name] + 'deg',
          }"
        >
          {{
            planentsMap[item.name].n ?? planentsMap[item.name].name.slice(0, 1)
          }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { PlanetItem } from "@/utils/planets";
import { map12, planentsMap, title12 } from "../astroUI";
import { useAvoidPlanetOverlap, useResetLongitude } from "../hooks";
import { toRef } from "vue";

const props = defineProps<{ data: PlanetItem[]; time: Date }>();

// 解决在跨 360° 旋转时，CSS 会走 358°反方向动画
const { css_longitude, disableTransition } = useResetLongitude(
  toRef(props, "data")
);

// 计算行星偏移量，避免行星重叠
const planentRota = useAvoidPlanetOverlap(
  toRef(props, "time"),
  toRef(props, "data")
);
</script>

<style lang="scss" scoped>
.constellation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 18px auto;
  width: 80%;
  min-width: 360px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: #000;
  overflow: hidden;

  .line {
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #393939;
  }
  > .line {
    height: 2px;
  }
  .line30 {
    transform: rotate(30deg);
  }
  .line60 {
    transform: rotate(60deg);
  }
  .line90 {
    transform: rotate(90deg);
  }
  .line120 {
    transform: rotate(120deg);
  }
  .line150 {
    transform: rotate(150deg);
  }

  .house {
    position: absolute;
    left: 50%;
    width: 50%;
    text-align: left;
    transform-origin: right;
    z-index: 10;
    color: #fff;
    font-size: clamp(14px, 2.5vw, 32px);
    font-weight: bold;
    transform: rotate(var(--angle)) translateX(-95%)
      rotate(calc(-1 * var(--angle)));
    > span {
      display: inline-block;
      transform: translateX(-50%);
    }
  }
}
.plate {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 89%;
  height: 89%;
  border-radius: 50%;
  background-color: #000;
  border: 1px solid #333;

  .star {
    --radius: 140px; /* 控制半径 */

    position: absolute;
    left: 50%;
    width: 50%;
    display: flex;
    align-items: center;
    height: 10px;
    text-align: left;
    transform: rotate(var(--angle)) translateX(-80%)
      rotate(calc(-1 * var(--angle)));
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); // 惯性效果
    // transition: transform 0.2s linear; // 月
    // transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); // 慢惯性

    .dot {
      margin-right: 4px;
      width: 4px;
      height: 4px;
      background: #f00;
      border-radius: 50%;
    }
    .planent-name {
      position: absolute;
      left: -4px;
      transform: rotate(var(--rot)) translateX(14px)
        rotate(calc(-1 * var(--rot)));
      transform-origin: left center;
      color: #fffb;
      font-size: clamp(14px, 2.5vw, 32px);
      font-weight: bold;
    }
  }
  .star.no-transition {
    transition: none !important;
  }
}
</style>
