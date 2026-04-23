<template>
  <div>
    <p>astrology</p>
    <van-cell-group inset>
      <van-cell
        v-for="item in data"
        :key="item.name"
        :title="`${item.name} ${planentsMap[item.name]}`"
        :label="item.longitude"
      >
        <p>
          {{ item.sign }} {{ map[item.sign] }} {{ item.degree }}°
          <span v-if="item.retrograde">R</span>
        </p>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { getAllPlanets } from "@/utils/planets";
import { Body } from "astronomy-engine";
import { ref } from "vue";

const data = ref(getAllPlanets());

const planentsMap: Record<string, string> = {
  [Body.Sun]: "太阳",
  [Body.Moon]: "月亮",
  [Body.Mercury]: "水星",
  [Body.Venus]: "金星",
  [Body.Mars]: "火星",
  [Body.Jupiter]: "木星",
  [Body.Saturn]: "土星",
  [Body.Uranus]: "天王星",
  [Body.Neptune]: "海王星",
  [Body.Pluto]: "冥王星",
};

const map: Record<string, string> = {
  Aries: "白羊座",
  Taurus: "金牛座",
  Gemini: "双子座",
  Cancer: "巨蟹座",
  Leo: "狮子座",
  Virgo: "处女座",
  Libra: "天秤座",
  Scorpio: "天蝎座",
  Sagittarius: "射手座",
  Capricorn: "摩羯座",
  Aquarius: "水瓶座",
  Pisces: "双鱼座",
};
</script>

<style lang="scss" scoped></style>
