import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// 暂未使用 同步改变地址栏
export function useQuerySync(key: string, defaultValue = "") {
  const route = useRoute();
  const router = useRouter();

  const state = ref(route.query[key] ?? defaultValue);

  // state → url
  watch(state, (val) => {
    if (val !== route.query[key]) {
      router.replace({
        query: {
          ...route.query,
          [key]: val || undefined,
        },
      });
    }
  });

  // url → state
  watch(
    () => route.query[key],
    (val) => {
      if (val !== state.value) {
        state.value = val ?? defaultValue;
      }
    }
  );

  return state;
}
