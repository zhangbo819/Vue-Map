<template>
  <div>
    <p>Astrology 2026</p>
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
          <p>
            {{ planentsMap[item.name].slice(0, 1) }}
          </p>
          <!-- <p>{{ "日" }}</p> -->
        </div>
      </div>
    </div>

    <!-- list -->
    <van-cell-group inset>
      <van-cell
        v-for="item in data"
        :key="item.name"
        :title="`${item.name} ${planentsMap[item.name]}`"
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
import { getAllPlanets } from "@/utils/planets";
import { ref } from "vue";

const data = ref(getAllPlanets());

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

const planentsMap: Record<string, string> = {
  Sun: "太阳",
  Moon: "月亮",
  Mercury: "水星",
  Venus: "金星",
  Mars: "火星",
  Jupiter: "木星",
  Saturn: "土星",
  Uranus: "天王星",
  Neptune: "海王星",
  Pluto: "冥王星",
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
</script>

<style lang="scss" scoped>
.constellation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 36px;
  width: 360px;
  height: 360px;
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
    transform: rotate(var(--angle)) translateX(-170px)
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
    --start: 0deg; /* 控制第一宫位置 */
    --radius: 140px; /* 控制半径 */

    position: absolute;
    // top: 50%;
    left: 50%;
    width: 50%;
    display: flex;
    align-items: center;
    height: 10px;
    text-align: left;
    // transform-origin: right;
    transform: rotate(calc(var(--start) + var(--angle)))
      translateX(calc(-1 * var(--radius)))
      rotate(calc(-1 * (var(--start) + var(--angle))));

    .dot {
      // position: absolute;
      // left: 10px;
      margin-right: 4px;
      width: 4px;
      height: 4px;
      background: #f00;
      border-radius: 50%;
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
