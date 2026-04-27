<template>
  <!-- 占星圆盘 -->
  <div class="constellation">
    <!-- 宫头部分 -->
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

      <!-- 相位线 -->
      <svg ref="svgRef" class="phaseBox">
        <line
          v-for="item in phaseLines"
          :key="item.n1 + item.n2"
          :x1="item.p1.x"
          :y1="item.p1.y"
          :x2="item.p2.x"
          :y2="item.p2.y"
          :stroke="item.color"
          stroke-width="1"
          :style="{ opacity: item.isStrong ? 1 : 0.8 }"
        />
      </svg>

      <!-- 运动的行星 -->
      <div
        v-for="item in data"
        :key="item.name"
        :class="{ star: true, 'no-transition': disableTransition[item.name] }"
        :style="{ '--angle': -1 * css_longitude[item.name] + 'deg' }"
      >
        <div class="dot" />
        <p
          class="planent-name"
          :style="{
            color: planentsMap[item.name].color,
            '--rot': -planentRota[item.name] + 'deg',
          }"
          @click="onClickPlanent(item)"
        >
          {{
            planentsMap[item.name].n ?? planentsMap[item.name].name.slice(0, 1)
          }}
        </p>
      </div>
    </div>
  </div>

  <!-- 圆角弹窗（居中） -->
  <van-popup v-model:show="showPopup" round class="aspect-popup">
    <template v-if="activeAspect.plant">
      <h2>
        <span :style="{ color: planentsMap[activeAspect.plant.name].color }"
          >{{ activeAspect.plant.name }}
          {{ planentsMap[activeAspect.plant.name].name }}</span
        >&nbsp;
        <span>
          {{ `[${activeAspect.plant.retrograde ? "逆行" : "顺行"}]` }}</span
        >
      </h2>
      <h3>
        落在
        <span :style="{ color: map12[activeAspect.plant.sign].color }"
          >{{ activeAspect.plant.sign }}
          {{ map12[activeAspect.plant.sign].name }}
          {{ map12[activeAspect.plant.sign].icon }}</span
        >
        {{ activeAspect.plant.degree }}°
      </h3>
    </template>
    <div
      v-for="(item, index) in activeAspect.aspects"
      :key="item.between.join('-')"
    >
      <p>
        &nbsp;&nbsp;
        <strong>{{ index + 1 }}. </strong>
        <span
          :style="{
            fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
          }"
        >
          与
          <span :style="{ color: planentsMap[item.other].color }"
            >{{ item.other }} {{ planentsMap[item.other].name }}</span
          >
          成
          <span :style="{ color: phasePosition.map[item.type].color }">
            {{ item.type }}
            {{ phasePosition.map[item.type].name }}
            {{ item.angle }}
          </span>
          &nbsp;
          <span> {{ item.strength }} ({{ item.orb }}°) </span>
        </span>
      </p>
    </div>
  </van-popup>
</template>
<script setup lang="tsx">
import { AspectItem, phasePosition, PlanetItem } from "@/utils/planets";
import { map12, planentsMap, title12 } from "../astroUI";
import { useAvoidPlanetOverlap, useResetLongitude } from "../hooks";
import { computed, onMounted, ref, toRef } from "vue";

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

const svgRef = ref<SVGSVGElement | null>(null);

const svgPosition = ref({ r: 0 });
const update = () => {
  const rect = svgRef.value!.getBoundingClientRect();

  svgPosition.value = {
    r: rect.width / 2,
  };
};
onMounted(() => {
  update();
  // window.addEventListener("resize", update);
});
// onUnmounted(() => {
//   window.removeEventListener("resize", update);
// });

// 相位线
const phaseLines = computed(() => {
  // console.log("svgPosition", svgPosition.value);
  // console.log("props.data", props.data);

  const phaseData = phasePosition.getData(props.data);

  const map: Record<PlanetItem["name"], { x: number; y: number }> =
    props.data.reduce((r, p) => {
      r[p.name] = phasePosition.getPosition(p.longitude, svgPosition.value.r);
      return r;
    }, {} as any);

  const res = phaseData.map((i) => {
    const [n1, n2] = i.between;

    return {
      n1,
      n2,
      p1: map[n1],
      p2: map[n2],
      color: phasePosition.map[i.type].color,
      isStrong: i.strength === "strong",
    };
  });

  return res;
});

const showPopup = ref(false);
const activeAspect = ref<{
  plant: PlanetItem | null;
  aspects: (AspectItem & { other: PlanetItem["name"] })[];
}>({
  plant: null,
  aspects: [],
});
const onClickPlanent = (item: PlanetItem) => {
  console.log(item);
  showPopup.value = true;
  const phaseData = phasePosition.getData(props.data);

  const aspects = phaseData
    .filter((i) => i.between.includes(item.name))
    .map((i) => ({
      ...i,
      other: i.between.find((i) => i !== item.name)!,
    }));

  activeAspect.value = { plant: { ...item }, aspects };
};
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
    // font-weight: bold;
    transform: rotate(var(--angle)) translateX(-95%)
      rotate(calc(-1 * var(--angle)));
    pointer-events: none;
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
    text-align: left;
    transform: rotate(var(--angle)) translateX(-80%)
      rotate(calc(-1 * var(--angle)));
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); // 惯性效果
    // transition: transform 0.2s linear; // 月
    // transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); // 慢惯性

    .dot {
      width: 4px;
      height: 4px;
      transform: translateX(-50%);
      background: #f00;
      border-radius: 50%;
    }
    .planent-name {
      --fs: clamp(14px, 2.5vw, 32px);

      position: absolute;
      left: calc(var(--fs) / -2);
      transform: rotate(var(--rot)) translateX(2.5vw)
        rotate(calc(-1 * var(--rot)));
      transform-origin: left center;
      color: #fffb;
      font-size: var(--fs);
      // 行高也要设置和字体大小一致，否则会有空白影响背景
      line-height: var(--fs);
      // font-weight: bold;
      background-color: #0008; // 给文字带个背景，让文字在相位线上时更显眼
    }
  }
  .star.no-transition {
    transition: none !important;
  }

  .phaseBox {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}

.aspect-popup {
  padding: 0 2em 1em;
  text-align: left;
}
</style>
