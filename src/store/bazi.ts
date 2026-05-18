import { ref, shallowRef, watch } from 'vue';
import { defineStore } from 'pinia';
import { paipan, textJSON } from 'astro-bazi-utils';
import { useAstroStore } from './astro';

export const useBaziStore = defineStore('bazi', () => {
  const astrologyStore = useAstroStore(); // TODO remove time to common

  const sex = ref<0 | 1>(0);

  // 总数据
  const paipanInfo = shallowRef(paipan.GetInfo(sex.value, astrologyStore.time.getTime()));
  // console.log(paipanInfo.value);
  watch([() => astrologyStore.time, () => sex.value], () => {
    paipanInfo.value = paipan.GetInfo(sex.value, astrologyStore.time.getTime());
  });

  // 弹窗
  const dialogVisible = ref(false);
  const dialogTitle = ref('');
  const dialogText = ref('');

  const openDialog = (options?: { title?: string; text?: string }) => {
    const { text, title } = options || {};
    dialogVisible.value = true;
    dialogTitle.value = title || text || '';

    if (typeof text !== 'undefined' && textJSON[text]) {
      dialogText.value = textJSON[text];
    } else {
      dialogText.value = text || '';
    }
  };

  return {
    paipanInfo,
    sex,
    dialogVisible,
    dialogTitle,
    dialogText,
    openDialog,
  };
});
