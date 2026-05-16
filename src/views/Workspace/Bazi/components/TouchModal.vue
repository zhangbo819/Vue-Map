<template>
  <div :class="{ canClick: !disabled }" @click="handleOpen">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBaziModalStore } from '@/store/baziModal';

const modal = useBaziModalStore();

const props = withDefaults(
  defineProps<{
    title?: string;
    text?: string | null;
    disabled?: boolean;
  }>(),
  {
    title: '',
    text: '',
  }
);

const handleOpen = () => {
  modal.open({
    title: props.title,
    text: props.text === null ? '' : props.text,
  });
};
</script>

<style lang="scss" scoped>
.canClick {
  cursor: pointer;
}
</style>
