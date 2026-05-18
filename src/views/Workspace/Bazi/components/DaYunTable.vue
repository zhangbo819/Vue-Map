<template>
  <van-row align="center" justify="space-between">
    <van-col>
      <p>
        起运：出生后{{ store.paipanInfo.big.start_desc }}
        <span
          v-if="
            store.paipanInfo.big.data[activeDyIndex] &&
            store.paipanInfo.big.data[activeDyIndex].years[activeLnIndex]
          "
        >
          {{
            store.paipanInfo.big.data[activeDyIndex].years[activeLnIndex].year - store.paipanInfo.yy
          }}
          岁
        </span>
      </p>
    </van-col>
    <van-col>
      <span @click="handleClose">关闭</span>
      <span @click="handleNow">今</span>
    </van-col>
  </van-row>

  <!-- 大运 -->
  <div class="listCard">
    <div class="listTilte">大<br />运</div>
    <div class="rowList">
      <div
        v-for="(item, index) in store.paipanInfo.big.data"
        :key="'dayun_' + item.name"
        :class="[
          'dayunItem',
          {
            active: activeDyIndex === index,
          },
        ]"
        @click="activeDyIndex = index"
      >
        <p class="itemText">
          {{ item.name === '小运' ? store.paipanInfo.yy : item.start_time[0] }}
        </p>
        <p class="itemText">
          {{
            item.name === '小运'
              ? `1 ~ ${item.years.length}`
              : item.start_time[0] - store.paipanInfo.yy + 1
          }}
          岁
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>

  <!-- 流年 -->
  <div v-if="store.paipanInfo.big.data[activeDyIndex]" class="listCard">
    <div class="listTilte">流<br />年</div>
    <div class="rowList">
      <div
        v-for="(item, index) in store.paipanInfo.big.data[activeDyIndex].years"
        :key="'liunian_' + item.year"
        :class="[
          'dayunItem',
          {
            active: activeLnIndex === index,
          },
        ]"
        @click="handleLnItem(item, index)"
      >
        <p class="itemText">
          {{ item.year }}
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>

  <!-- 流月 -->
  <div v-if="lyData !== null" class="listCard">
    <div class="listTilte">流<br />月</div>
    <div class="rowList">
      <div
        v-for="(item, index) in lyData"
        :key="'Liuyue_' + item.year + item.mouth + item.day"
        :class="[
          'dayunItem',
          {
            active: activeLyIndex === index,
          },
        ]"
        @click="handleLyItem(index)"
      >
        <p class="jieqi">{{ JQ_12[index] }}</p>
        <p class="itemText">
          {{ `${item.mouth}/${item.day}` }}
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>

  <!-- 流日 -->
  <div v-if="lrData !== null" class="listCard">
    <div class="listTilte">流<br />日</div>
    <div class="rowList">
      <div
        v-for="(item, index) in lrData"
        :key="'Liuri_' + item.year + item.mouth + item.day"
        :class="[
          'dayunItem',
          {
            active: activeLrIndex === index,
          },
        ]"
        style="justify-content: flex-start"
        @click="handleLrItem(index)"
      >
        <p class="jieqi">{{ item.week }}</p>
        <p class="itemText">
          {{ `${item.mouth}/${item.day}` }}
        </p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
        <p class="jqText">{{ item.jq_text || ' ' }}</p>
      </div>
    </div>
  </div>

  <!-- 流时 -->
  <div v-if="lsData !== null" class="listCard">
    <div class="listTilte">流<br />时</div>
    <div class="rowList">
      <div
        v-for="(item, index) in lsData"
        :key="'Liushi_' + item.name"
        :class="[
          'dayunItem',
          {
            active: activeLsIndex === index,
          },
        ]"
        @click="activeLsIndex = index"
      >
        <p class="itemText">{{ item.name[1] }}时</p>
        <p class="itemText">{{ item.time_text }}</p>
        <WuxingText disabled :text="item.name[0]" size="mini" />
        <WuxingText disabled :text="item.name[1]" size="mini" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { JQ_12, JZ_60, LiuYueItem, paipan } from 'astro-bazi-utils';
import { useBaziStore } from '@/store/bazi';
import WuxingText from './WuxingText.vue';

const store = useBaziStore();

const activeDyIndex = ref(-1);
const activeLnIndex = ref(-1);
const activeLyIndex = ref(-1);
const activeLrIndex = ref(-1);
const activeLsIndex = ref(-1);
const lyData = shallowRef<LiuYueItem[] | null>(null);
const lrData = shallowRef<LiuYueItem['days'] | null>(null);
const lsData = shallowRef<ReturnType<typeof paipan.getLiuShi> | null>(null);

const handleLnItem = (item: { name: JZ_60; year: number }, index: number) => {
  const data = paipan.getLiuYueByYear(item.year, item.name);
  //   console.log('handleLnItem', data);
  lyData.value = data;
  activeLnIndex.value = index;
};
const handleLyItem = (index: number) => {
  if (!lyData.value) return;
  lrData.value = lyData.value[index].days;
  activeLyIndex.value = index;
};
const handleLrItem = (index: number) => {
  if (!lrData.value) return;
  const newLsData = paipan.getLiuShi(getLsDate({ newLrIndex: index }));
  lsData.value = newLsData;
  activeLrIndex.value = index;
};

const getLsDate = ({
  newLiuYueData = lyData.value,
  newLyIndex = activeLyIndex.value,
  newLrIndex = activeLrIndex.value,
}: {
  newLiuYueData?: any;
  newLyIndex?: number;
  newLrIndex?: number;
}) => {
  if (newLiuYueData === null) {
    return new Date().getTime();
  }
  const ls_year = newLiuYueData[newLyIndex].year;
  const ls_mouth = newLiuYueData[newLyIndex].days[newLrIndex].mouth;
  const ls_day = newLiuYueData[newLyIndex].days[newLrIndex].day;
  const ls_date = new Date(`${ls_year}-${ls_mouth}-${ls_day}`);
  ls_date.setHours(0);
  // console.log('ls_date', ls_date.toLocaleString(), new Date().getHours());
  return ls_date.getTime();
};

const handleClose = () => {
  activeDyIndex.value = -1;
  activeLnIndex.value = -1;
  activeLyIndex.value = -1;
  activeLrIndex.value = -1;
  activeLsIndex.value = -1;
  lyData.value = null;
  lrData.value = null;
  lsData.value = null;
};
const handleNow = () => {
  const data = store.paipanInfo.big.data;

  // 流年、流月
  function _findYearMouthIndex(targetYear: number) {
    let newlnIndex = -1;
    let newDyIndex = data.findIndex((i) => {
      return i.years.find((j, yearsIndex) => {
        if (j.year === targetYear) {
          newlnIndex = yearsIndex;
          return true;
        }
        return false;
      });
    });

    // console.log('targetYear', targetYear);

    if (newDyIndex < 0 || newlnIndex < 0) {
      return null;
    }

    const ln_item = data[newDyIndex].years[newlnIndex];
    const newLiuYueData = paipan.getLiuYueByYear(ln_item.year, ln_item.name);
    const nowTime = new Date().getTime();
    let newLyIndex = newLiuYueData.findIndex((i) => {
      const last_day = i.days[i.days.length - 1];
      const mouth_max = new Date();
      mouth_max.setFullYear(last_day.year);
      mouth_max.setMonth(last_day.mouth - 1);
      mouth_max.setDate(last_day.day);
      mouth_max.setHours(23, 59, 59);
      return mouth_max.getTime() > nowTime;
    });
    if (newLyIndex === -1) {
      newLyIndex = 0;
    } else if (newLyIndex === 0) {
      const first_day = newLiuYueData[0].days[0];
      const mouth_max = new Date();
      mouth_max.setFullYear(first_day.year);
      mouth_max.setMonth(first_day.mouth - 1);
      mouth_max.setDate(first_day.day);
      mouth_max.setHours(0, 0, 0);
      if (mouth_max.getTime() > nowTime) {
        // 当前年的所有月份小于当前时间，则向前一年找
        // 这种情况一般发生在公历1月至立春前之间
        console.log('整体过大, 向前一年找', targetYear - 1);
        return _findYearMouthIndex(targetYear - 1);
      }
    }

    return { newDyIndex, newlnIndex, newLiuYueData, newLyIndex };
  }

  const YearMouthData = _findYearMouthIndex(new Date().getFullYear());
  if (YearMouthData === null) {
    return;
  }
  const { newDyIndex, newlnIndex, newLiuYueData, newLyIndex } = YearMouthData;

  // console.log('newLiuYueData', JSON.stringify(newLiuYueData, null, 4), newLyIndex);

  activeDyIndex.value = newDyIndex;
  activeLnIndex.value = newlnIndex;
  lyData.value = newLiuYueData;
  activeLyIndex.value = newLyIndex;

  // 流日
  // TODO 23点时就到下一天了
  let newLrIndex = newLiuYueData[newLyIndex].days.findIndex(
    (i) => i.mouth === new Date().getMonth() + 1 && i.day === new Date().getDate()
  );
  if (newLrIndex === -1) {
    newLrIndex = 0;
  }
  activeLrIndex.value = newLrIndex;

  // 流时
  const ls_date = getLsDate({ newLiuYueData, newLyIndex, newLrIndex });
  // console.log('ls_date', ls_date.toLocaleString(), new Date().getHours());
  const newLsData = paipan.getLiuShi(ls_date);
  lsData.value = newLsData;
  const newLsIndex = Math.floor((new Date().getHours() + 1) / 2);
  activeLsIndex.value = newLsIndex;

  // TODO scroll to active position
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.listCard {
  margin: 8px 0;
}
.listTilte {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 40px;
  height: 100%;
  box-sizing: border-box;
}
.rowList {
  display: inline-flex;
  flex-direction: row;
  overflow-x: scroll;
  width: calc(100% - 40px);
  padding-bottom: 8px;

  .dayunItem {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border: 1px solid #fff;
    border-radius: 8px;

    &.active {
      border-color: #666;
    }

    .itemText {
      margin-bottom: 4px;
      white-space: nowrap;
    }

    .jieqi {
      white-space: nowrap;
    }

    .jqText {
      margin-top: 4px;
      font-weight: bold;
      color: #f7540e;
      white-space: nowrap;
    }
  }
}
</style>
