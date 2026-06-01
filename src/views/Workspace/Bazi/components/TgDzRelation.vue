<template>
  <div class="tgDzRelation">
    <div class="row">
      <p class="tgDzRelationTitle">天干留意</p>
      <div>
        <template v-for="i in tgdz_relation.tg" :key="'relation_tg_row' + i.index">
          <span v-for="j in i.relation" :key="'relation_tg' + i.index + j.index" class="tgGxItem">
            {{ j.text }}
          </span>
        </template>
      </div>
    </div>
    <div class="row">
      <p class="tgDzRelationTitle">地支留意</p>
      <div>
        <template v-for="i in tgdz_relation.dz" :key="'relation_dz_row' + i.index">
          <span v-for="j in i.relation" :key="'relation_dz' + i.index + j.index" class="tgGxItem">
            {{ j.text }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { WuXing } from 'astro-bazi-utils';
import { useBaziStore } from '@/store/bazi';

const store = useBaziStore();

const tgdz_relation = computed(() => ({
  tg: WuXing.getTgRelation(store.pillarShowData.map((i) => i.tg)),
  dz: WuXing.getDzRelation(store.pillarShowData.map((i) => i.dz)),
}));
</script>
