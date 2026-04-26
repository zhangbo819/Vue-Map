<template>
  <div style="width: 100%">
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
              planentsMap[item.name].n ??
              planentsMap[item.name].name.slice(0, 1)
            }}
          </p>
        </div>
      </div>
    </div>

    <van-cell title="手动">
      <van-row>
        <van-col span="8" @click="onClickDay(-1)"
          ><van-icon name="arrow-left"
        /></van-col>
        <van-col span="8">{{ time.getDate() }} </van-col>
        <van-col span="8" @click="onClickDay(1)"
          ><van-icon name="arrow"
        /></van-col>
      </van-row>
    </van-cell>
    <van-cell
      title="滑块组选择"
      :value="time.toLocaleString()"
      @click="showPickerGroup = true"
    />
    <van-popup v-model:show="showPickerGroup" position="bottom">
      <van-picker-group
        title="指定星盘日期"
        :tabs="['选择日期', '选择时间']"
        next-step-text="下一步"
        @confirm="onPickerGroupConfirm"
        @cancel="showPickerGroup = false"
      >
        <van-date-picker
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
        />
        <van-time-picker v-model="currentTime" :formatter="formatter" />
      </van-picker-group>
    </van-popup>
    <van-cell
      title="日历选择"
      :value="time.toLocaleString()"
      @click="showCalendar = true"
    />
    <van-calendar
      v-model:show="showCalendar"
      switch-mode="year-month"
      @confirm="onCalendarConfirm"
    />
    <p>{{ time.toLocaleString() }}</p>
    <van-button @click="onClickTime"> 此时此刻 </van-button>

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
import { BODIES, getAllPlanets, PlanetItem } from "@/utils/planets";
// import { showSuccessToast } from "vant";

type PlanentRotaItem = Record<string, number>;

const time = ref(new Date());
const data = ref<PlanetItem[]>([]);

// 计算行星偏移量，避免行星重叠
const planentRota = ref<PlanentRotaItem>({});
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

// 时间一变全部重新计算
watch(
  () => time.value,
  (val) => {
    data.value = getAllPlanets(val);
    // console.log([...data.value]);

    const groups = groupClosePlanets(data.value);
    // console.log("groups", groups);
    planentRota.value = applyLabelRotation(groups);
    // console.log(planentRota.value);
  },
  { immediate: true }
);

// 解决在跨 360° 旋转时，CSS 会走 358°反方向动画
const css_longitude = ref<Record<PlanetItem["name"], PlanetItem["longitude"]>>(
  BODIES.reduce((r, key) => {
    r[key] = 0;
    return r;
  }, {} as any)
);
const disableTransition = ref<Record<string, boolean>>(
  BODIES.reduce((r, key) => {
    r[key] = false;
    return r;
  }, {} as any)
);
function normalizeAngle(prev: number, next: number) {
  let diff = next - prev;

  if (diff > 180) next -= 360;
  if (diff < -180) next += 360;

  return next;
}
watch(
  () => data.value,
  (newVal, oldVal) => {
    const res = newVal.reduce((r, p) => {
      r[p.name] = p.longitude;
      return r;
    }, {} as any);

    const needResetName: PlanetItem["name"][] = [];
    if (oldVal) {
      newVal.forEach((p) => {
        const prev = css_longitude.value[p.name];
        const next = res[p.name];

        let fixed = normalizeAngle(prev, next);

        // TODO bug: 现在顺时针时还会有问题
        // debug
        if (p.name === "Moon") {
          console.log(fixed);
        }

        // ⭐ 在这里做“安全重置”
        const LIMIT = 400;

        const isNeedReset = Math.abs(fixed) > LIMIT;

        if (isNeedReset) {
          needResetName.push(p.name);
          res[p.name] = fixed % 360;
        } else {
          res[p.name] = fixed;
        }
      });
      // 有需要重置的
      if (needResetName.length) {
        // res 新的并且可能有多个
        const resetVal = oldVal.reduce((r, p) => {
          if (needResetName.includes(p.name)) {
            p.longitude %= 360;
            disableTransition.value[p.name] = true;
          }
          r[p.name] = p.longitude;
          return r;
        }, {} as any);
        css_longitude.value = resetVal; // 无动画清空原值

        // 强制下一帧恢复动画
        requestAnimationFrame(() => {
          needResetName.forEach(
            (name) => (disableTransition.value[name] = false)
          );
          // 恢复新值
          requestAnimationFrame(() => {
            // console.log("最后再向前移动");
            css_longitude.value = res;
          });
        });
      } else {
        // 马上更新
        css_longitude.value = res;
      }
    } else {
      // 马上更新
      css_longitude.value = res;
    }
  },
  { immediate: true }
);

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

// Element
enum EL {
  Fire = "Fire",
  Earth = "Earth",
  Air = "Air",
  Water = "Water",
}

const eColors = {
  [EL.Fire]: "#FF5A5F", // 火：橙红（行动/能量）
  [EL.Earth]: "#C2B280", // 土：橄榄绿（稳定/现实）
  [EL.Air]: "#7BAFD4", // 风：清蓝（思维/交流）
  [EL.Water]: "#4A6CF7", // 水：靛紫（情绪/直觉）
};

const planentsMap: Record<string, { name: string; n?: string; color: string }> =
  {
    Sun: { name: "太阳", n: "日", color: eColors[EL.Fire] }, // 红色（太阳）
    Moon: { name: "月亮", color: eColors[EL.Water] }, // 月光蓝（情绪/柔和）
    Mercury: { name: "水星", color: eColors[EL.Air] }, // 青绿色（思维/流动）
    Venus: { name: "金星", color: eColors[EL.Air] }, // 粉玫瑰（爱/美感）
    Mars: { name: "火星", color: eColors[EL.Fire] }, // 火红（行动力）
    Jupiter: { name: "木星", color: eColors[EL.Fire] }, // 紫色（扩张/幸运）
    Saturn: { name: "土星", color: eColors[EL.Earth] }, // 深灰蓝（结构/限制）
    Uranus: { name: "天王星", color: eColors[EL.Earth] }, // 电光青（变革）
    Neptune: { name: "海王星", color: eColors[EL.Water] }, // 深海蓝（幻想/灵性）
    Pluto: { name: "冥王星", color: eColors[EL.Water] }, // 深紫（转化/深层力量）
  };

const map12: Record<
  string,
  { name: string; n: string; icon: string; color: string }
> = {
  Aries: { name: "白羊座", n: "羊", icon: "♈", color: eColors[EL.Fire] },
  Taurus: { name: "金牛座", n: "牛", icon: "♉", color: eColors[EL.Earth] },
  Gemini: { name: "双子座", n: "双", icon: "♊", color: eColors[EL.Air] },
  Cancer: { name: "巨蟹座", n: "蟹", icon: "♋", color: eColors[EL.Water] },
  Leo: { name: "狮子座", n: "狮", icon: "♌", color: eColors[EL.Fire] },
  Virgo: { name: "处女座", n: "处", icon: "♍", color: eColors[EL.Earth] },
  Libra: { name: "天秤座", n: "秤", icon: "♎", color: eColors[EL.Air] },
  Scorpio: { name: "天蝎座", n: "蝎", icon: "♏", color: eColors[EL.Water] },
  Sagittarius: { name: "射手座", n: "射", icon: "♐", color: eColors[EL.Fire] },
  Capricorn: { name: "摩羯座", n: "摩", icon: "♑", color: eColors[EL.Earth] },
  Aquarius: { name: "水瓶座", n: "瓶", icon: "♒", color: eColors[EL.Air] },
  Pisces: { name: "双鱼座", n: "鱼", icon: "♓", color: eColors[EL.Water] },
};

const onClickTime = () => {
  time.value = new Date();
  // showSuccessToast("设置成功");
};

const onClickDay = (step: number) => {
  const newDate = new Date(time.value);

  const day = newDate.getDate() + step;

  newDate.setDate(day);

  time.value = newDate;
};

const showCalendar = ref(false);

const onCalendarConfirm = (value: Date) => {
  showCalendar.value = false;

  const newDate = new Date(time.value);

  newDate.setFullYear(value.getFullYear());
  newDate.setMonth(value.getMonth());
  newDate.setDate(value.getDate());

  time.value = newDate;
};

const showPickerGroup = ref(false);
const now = new Date();
const currentDate = ref([now.getFullYear(), now.getMonth(), now.getDate()]);
const minDate = new Date(1900, 0, 1); // 最小 1900 年
const maxDate = new Date(new Date().getFullYear() + 100, 11, 31); // 100 年后
const currentTime = ref();

const formatter = (type: string, option: any) => {
  if (type === "hour") {
    option.text += "时";
  }
  if (type === "minute") {
    option.text += "分";
  }
  return option;
};

const onPickerGroupConfirm = () => {
  const [year, month, day] = currentDate.value;
  const [hour, minute] = currentTime.value;

  const newDate = new Date(time.value);

  newDate.setFullYear(year);
  newDate.setMonth(month);
  newDate.setDate(day);
  newDate.setHours(hour);
  newDate.setMinutes(minute);

  time.value = newDate;
  showPickerGroup.value = false;
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
.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
}
</style>
