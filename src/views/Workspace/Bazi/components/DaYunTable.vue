<template>
  {{ store.paipanInfo.big }}
</template>

<script setup lang="ts">
import { useBaziStore } from '@/store/bazi';

const store = useBaziStore();
</script>
