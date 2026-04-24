<template>
  <div>
    <h1 style="margin-bottom: 8px; font-size: 1.6em">Astrology</h1>
    <!-- 星座盘 -->
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
          class="star"
          :style="{ '--angle': -1 * item.longitude + 'deg' }"
        >
          <div class="dot" />
          <p
            class="planent-name"
            :style="{
              color: planentsMap[item.name].color,
              '--rot': -planentRota[item.name] + 'deg',
            }"
          >
            {{
              planentsMap[item.name].n ??
              planentsMap[item.name].name.slice(0, 1)
            }}
          </p>
        </div>
      </div>
    </div>

    <p>{{ time.toLocaleString() }}</p>
    <van-button round @click="onClickTime"> 更新时间 </van-button>

    <!-- list -->
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
import { getAllPlanets, PlanetItem } from "@/utils/planets";
// import { showSuccessToast } from "vant";
import { ref } from "vue";

type PlanentRotaItem = Record<string, number>;

const time = ref(new Date());
const data = ref(getAllPlanets(time.value));
const planentRota = ref<PlanentRotaItem>({}); // 计算行星偏移量，避免行星重叠

function groupClosePlanets(planets: PlanetItem[]) {
  const threshold = 6;
  const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);

  const groups = [];
  let current = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];

    if (Math.abs(cur.longitude - prev.longitude) <= threshold) {
      current.push(cur);
    } else {
      groups.push(current);
      current = [cur];
    }
  }

  groups.push(current);
  return groups;
}
function applyLabelRotation(groups: PlanetItem[][]) {
  const result: PlanentRotaItem = {};

  for (const group of groups) {
    const len = group.length;

    group.forEach((p, i) => {
      let rotation = 0;

      if (len === 1) {
        rotation = 0;
      } else {
        // 让 label 在一个小扇形内分散
        const spread = 360; // 总展开角度
        rotation = (spread / len) * (i + 1); // TODO 旋转逻辑再优化
      }

      result[p.name] = rotation;
    });
  }

  return result;
}

const groups = groupClosePlanets(data.value);
console.log("groups", groups);
planentRota.value = applyLabelRotation(groups);
console.log(planentRota.value);

const title12 = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const planentsMap: Record<string, { name: string; n?: string; color: string }> =
  {
    Sun: { name: "太阳", n: "日", color: "#f00" }, // 红色（太阳）
    Moon: { name: "月亮", color: "#A7B6FF" }, // 月光蓝（情绪/柔和）
    Mercury: { name: "水星", color: "#7AD1B8" }, // 青绿色（思维/流动）
    Venus: { name: "金星", color: "#F29CB0" }, // 粉玫瑰（爱/美感）
    Mars: { name: "火星", color: "#E4572E" }, // 火红（行动力）
    Jupiter: { name: "木星", color: "#7E57C2" }, // 紫色（扩张/幸运）
    Saturn: { name: "土星", color: "#5A5A7A" }, // 深灰蓝（结构/限制）
    Uranus: { name: "天王星", color: "#3ED1D3" }, // 电光青（变革）
    Neptune: { name: "海王星", color: "#4A6CF7" }, // 深海蓝（幻想/灵性）
    Pluto: { name: "冥王星", color: "#6A1B9A" }, // 深紫（转化/深层力量）
  };

const map12: Record<
  string,
  { name: string; n: string; icon: string; color: string }
> = {
  Aries: { name: "白羊座", n: "羊", icon: "♈", color: "#FF5A5F" },
  Taurus: { name: "金牛座", n: "牛", icon: "♉", color: "#C2B280" },
  Gemini: { name: "双子座", n: "双", icon: "♊", color: "#7BAFD4" },
  Cancer: { name: "巨蟹座", n: "蟹", icon: "♋", color: "#1B3B6F" },
  Leo: { name: "狮子座", n: "狮", icon: "♌", color: "#FF5A5F" },
  Virgo: { name: "处女座", n: "处", icon: "♍", color: "#C2B280" },
  Libra: { name: "天秤座", n: "秤", icon: "♎", color: "#7BAFD4" },
  Scorpio: { name: "天蝎座", n: "蝎", icon: "♏", color: "#1B3B6F" },
  Sagittarius: { name: "射手座", n: "射", icon: "♐", color: "#FF5A5F" },
  Capricorn: { name: "摩羯座", n: "摩", icon: "♑", color: "#C2B280" },
  Aquarius: { name: "水瓶座", n: "瓶", icon: "♒", color: "#7BAFD4" },
  Pisces: { name: "双鱼座", n: "鱼", icon: "♓", color: "#1B3B6F" },
};

const onClickTime = () => {
  time.value = new Date();
  // showSuccessToast("设置成功");
};
</script>

<style lang="scss" scoped>
p,
h1 {
  margin: 0;
}
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
    font-size: 14px;
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
      font-size: 14px;
      font-weight: bold;
    }
  }
}
.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
}
</style>
