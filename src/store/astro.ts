import { defineStore } from 'pinia';
import { getAllPlanets } from '@/utils/astro/planets';
import { computed, ref } from 'vue';

export const useAstroStore = defineStore('astro', () => {
  const time = ref(new Date());

  const setTime = (v: Date | number) => {
    time.value = typeof v === 'number' ? new Date(v) : v;
  };

  const planetList = computed(() => {
    return getAllPlanets(time.value);
  });

  //   const planetMap = computed(() => Object.fromEntries(planetList.value.map((p) => [p.name, p])));

  return {
    time,
    planetList,
    setTime,
  };
});
