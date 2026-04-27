<template>
  <van-cell title="手动切换">
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
  <van-cell
    title="此时此刻"
    :value="time.toLocaleString()"
    @click="onClickTime"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  time: {
    type: Date,
    required: true,
  },
});
const emit = defineEmits(["update:time"]);

const onClickTime = () => {
  emit("update:time", new Date());
  // showSuccessToast("设置成功");
};

const onClickDay = (step: number) => {
  const newDate = new Date(props.time);

  const day = newDate.getDate() + step;

  newDate.setDate(day);

  emit("update:time", newDate);
};

const showCalendar = ref(false);
const onCalendarConfirm = (value: Date) => {
  showCalendar.value = false;

  const newDate = new Date(props.time);

  newDate.setFullYear(value.getFullYear());
  newDate.setMonth(value.getMonth());
  newDate.setDate(value.getDate());

  emit("update:time", newDate);
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

  const newDate = new Date(props.time);

  newDate.setFullYear(year);
  newDate.setMonth(month - 1);
  newDate.setDate(day);
  newDate.setHours(hour);
  newDate.setMinutes(minute);

  emit("update:time", newDate);
  showPickerGroup.value = false;
};
</script>
