<template>
  <van-cell title="手动切换">
    <van-row>
      <van-col span="8" class="cursor" @click="onClickDay(-1)"
        ><van-icon name="arrow-left"
      /></van-col>
      <van-col span="8">{{ time.getDate() }} </van-col>
      <van-col span="8" class="cursor" @click="onClickDay(1)"><van-icon name="arrow" /></van-col>
    </van-row>
  </van-cell>
  <van-cell
    title="滑块组选择"
    :value="time.toLocaleString()"
    class="cursor"
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
      <van-date-picker v-model="currentDate" :min-date="minDate" :max-date="maxDate" />
      <van-time-picker v-model="currentTime" :formatter="formatter" />
    </van-picker-group>
  </van-popup>
  <van-cell
    title="日历选择"
    :value="time.toLocaleString()"
    class="cursor"
    @click="showCalendar = true"
  />
  <van-calendar
    v-model:show="showCalendar"
    switch-mode="year-month"
    :default-date="time"
    @confirm="onCalendarConfirm"
  />
  <van-cell title="此时此刻" :value="time.toLocaleString()" class="cursor" @click="onClickTime" />
  <van-cell title="示例数据" value="-->" @click="timeListShow = true" />
  <van-action-sheet v-model:show="timeListShow" :actions="actions" @select="onSelect" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  time: {
    type: Date,
    required: true,
  },
});
const emit = defineEmits(['update:time']);

const now = new Date();
const minDate = new Date(1900, 0, 1); // 最小 1900 年
const maxDate = new Date(now.getFullYear() + 100, 11, 31); // 100 年后
const currentDate = ref([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
const currentTime = ref([now.getHours(), now.getMinutes()]);
const showPickerGroup = ref(false);

watch(
  () => props.time,
  (val) => {
    currentDate.value = [val.getFullYear(), val.getMonth() + 1, val.getDate()];
    currentTime.value = [val.getHours(), val.getMinutes()];
  },
  { immediate: true }
);

const onClickTime = () => {
  emit('update:time', new Date());
  // showSuccessToast("设置成功");
};

const onClickDay = (step: number) => {
  const newDate = new Date(props.time);

  const day = newDate.getDate() + step;

  newDate.setDate(day);

  emit('update:time', newDate);
};

const showCalendar = ref(false);
const onCalendarConfirm = (value: Date) => {
  showCalendar.value = false;

  const newDate = new Date(props.time);

  newDate.setFullYear(value.getFullYear());
  newDate.setMonth(value.getMonth());
  newDate.setDate(value.getDate());

  emit('update:time', newDate);
};

const formatter = (type: string, option: any) => {
  if (type === 'hour') {
    option.text += '时';
  }
  if (type === 'minute') {
    option.text += '分';
  }
  return option;
};
const onPickerGroupConfirm = () => {
  const [year, month, day] = currentDate.value;
  const [hour, minute] = currentTime.value;

  const newDate = new Date(props.time);

  newDate.setFullYear(year);
  newDate.setMonth(month - 1);
  newDate.setDate(day);
  newDate.setHours(hour);
  newDate.setMinutes(minute);

  emit('update:time', newDate);
  showPickerGroup.value = false;
};

const timeListShow = ref(false);

// const time = ref(new Date(2025, 7, 17)); // 1755356400000 俩风筝 俩三角 神秘矩形
const actions = [
  { name: '大三角', time: 1775314800000 },
  { name: 'T三角', time: '2021-06-14T10:00:00Z' },
  { name: '双大三角 T三角', time: '2013-07-22T12:00:00Z' },
  { name: '2风筝 3大三角 2T三角', time: 1375101000000 },
  { name: '2014 著名红色大十字', time: '2014-04-23T18:00:00Z' },
  { name: '双大十字', time: 1281139200000 },
  { name: '1930 冥王发现日', time: '1930-02-18T00:00:00Z' },
  { name: '1962 七行星聚集（水瓶时代讨论经典）', time: '1962-02-05T14:00:00Z' },
  { name: '1846 海王发现日（现代意识占星的重要原点）', time: '1846-09-23T00:00:00Z' },
  { name: '1989 土天海三重结构（柏林墙时期）', time: '1989-11-09T18:53:00Z' },
  { name: '2001-09-11(911事件)', time: '2001-09-11T12:46:00Z' },
  { name: '2012 冬至（玛雅历法讨论节点）', time: '2012-12-21T11:11:00Z' },
  { name: '2020 木土大合 (水瓶0°)', time: '2020-12-21T18:20:00Z' },
  { name: '2023 冥王进入水瓶（第一次）', time: '2023-03-23T09:13:00Z' },
  { name: '2024 白羊日食（北美大日食）', time: '2024-04-08T18:18:00Z' },
  { name: '2022 ChatGPT发布 (AI语言模型爆发)', time: '2022-11-30T18:00:00Z' },
  // { name: 'Yod 上帝之指', time: '2017-06-05T04:00:00Z' },
];
const onSelect = (item: { name: string; time: number }) => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  console.log('item', item);
  const newDate = new Date(item.time);
  emit('update:time', newDate);
  timeListShow.value = false;
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
