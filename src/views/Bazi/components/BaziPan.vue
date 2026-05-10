<template>
  <!-- 弹窗 临时放这 -->
  <bazi-modal />

  <!-- 标题 -->
  <van-row>
    <van-col span="4" />
    <van-col v-for="item in pillarShowData" :key="item.title" span="5">
      <p>{{ item.title }}</p>
    </van-col>
  </van-row>
  <!-- 十神 -->
  <van-row style="margin-top: 5px">
    <van-col span="4">
      <p class="subheading">主星</p>
    </van-col>
    <van-col v-for="(item, index) in pillarShowData" :key="'zhuxing' + item.tg + index" span="5">
      <TouchModal :text="item.zhuxing">
        <p class="tenText">{{ item.zhuxing }}</p>
      </TouchModal>
    </van-col>
  </van-row>
  <!-- 天干 -->
  <van-row style="margin-top: 5px">
    <van-col span="4">
      <p class="subheading">天干</p>
    </van-col>
    <van-col v-for="(item, index) in pillarShowData" :key="'tg' + item.tg + index" span="5">
      <wuxing-text :text="item.tg" />
    </van-col>
  </van-row>
  <!-- 地支 -->
  <van-row>
    <van-col span="4">
      <p class="subheading">地支</p>
    </van-col>
    <van-col v-for="(item, index) in pillarShowData" :key="'dz' + item.tg + index" span="5">
      <WuxingText :text="item.dz" />
    </van-col>
  </van-row>
  <!-- 藏干 -->
  <van-row v-for="(_, index) in cgMaxLength" :key="'cg_row_' + index" style="margin-top: 5px">
    <van-col span="4">
      <p v-if="index === 0" class="subheading">藏干</p>
    </van-col>
    <van-col v-for="(item, y) in pillarShowData" :key="'dzcg' + item.dzcg + index + y" span="5">
      <WuxingText :text="item.dzcg[index]" :touch-modal-text="item.dzcg[index]?.[0]" size="mini" />
    </van-col>
  </van-row>
  <!-- 副星 -->
  <van-row v-for="(_, index) in cgMaxLength" :key="'fx_row_' + index" style="margin-top: 5px">
    <van-col span="4">
      <p v-if="index === 0" class="subheading">副星</p>
    </van-col>
    <van-col v-for="(item, y) in pillarShowData" :key="'fx' + item.fx[index] + index + y" span="5">
      <TouchModal :text="paipanInfo.tenMap[item.fx[index]]">
        <p class="tenText">
          {{ item.fx_text[index] }}
        </p>
      </TouchModal>
    </van-col>
  </van-row>
  <!-- 12长生 星运 -->
  <van-row style="margin-top: 5px">
    <van-col span="4">
      <p class="subheading">星运</p>
    </van-col>
    <van-col
      v-for="(item, index) in pillarShowData"
      :key="'xingyun' + item.xingyun + index"
      span="5"
    >
      <TouchModal :text="item.xingyun">
        <p class="tenText">
          {{ item.xingyun }}
        </p>
      </TouchModal>
    </van-col>
  </van-row>
  <!-- 12长生 自坐 -->
  <van-row style="margin-top: 5px">
    <van-col span="4">
      <p class="subheading">自坐</p>
    </van-col>
    <van-col v-for="(item, index) in pillarShowData" :key="'zizuo' + item.zizuo + index" span="5">
      <TouchModal :text="item.zizuo">
        <p class="tenText">
          {{ item.zizuo }}
        </p>
      </TouchModal>
    </van-col>
  </van-row>
  <!-- 纳音 -->
  <van-row style="margin: 5px 0 3px">
    <van-col span="4">
      <p class="subheading">纳音</p>
    </van-col>
    <van-col v-for="(item, index) in pillarShowData" :key="'nayin' + item.nayin + index" span="5">
      <TouchModal :text="item.nayin">
        <p :style="{ color: WuXing.getColorByWuxing(item.nayin[2]) }">
          {{ item.nayin }}
        </p>
      </TouchModal>
    </van-col>
  </van-row>
  <!-- 神煞 -->
  <van-row v-for="(_, index) in ssMaxLength" :key="'ss_row_' + index" style="margin-top: 2px">
    <van-col span="4">
      <p v-if="index === 0" class="subheading">神煞</p>
    </van-col>
    <van-col v-for="(item, y) in pillarShowData" :key="'ss' + item.ss[index] + index + y" span="5">
      <TouchModal :title="item.ss[index]" :text="Shensha.getDetails(item.ss[index])">
        <p class="shensha">
          {{ item.ss[index] }}
        </p>
      </TouchModal>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  paipan,
  TG,
  DZ,
  Ten,
  NaYin,
  Shensha,
  ZhangSheng,
  ShenshaItem,
  WuXing,
} from 'astro-bazi-utils';
import WuxingText from './WuxingText.vue';
import BaziModal from './BaziModal.vue';
import TouchModal from './TouchModal.vue';

const props = withDefaults(
  defineProps<{
    time: Date;
  }>(),
  {}
);

const paipanInfo = computed(() => {
  const res = paipan.GetInfo(0, props.time.getTime());
  // console.log(res);
  return res;
});
const pillarShowData = computed(() => {
  return Sizhu.map<PillarItem>((title, i) => {
    let zhuxing = paipanInfo.value.tenMap[paipanInfo.value.tg[i]];
    if (title === PillarTitle.日柱) {
      zhuxing = paipanInfo.value.gender === 0 ? Ten.元男 : Ten.元女;
    }
    return {
      title,
      isShow: true,
      zhuxing: zhuxing,
      tg: paipanInfo.value.bazi[i][0] as TG,
      dz: paipanInfo.value.bazi[i][1] as DZ,
      dzcg: paipanInfo.value.dzcg_text[i],
      fx: paipanInfo.value.dzcg[i],
      fx_text: paipanInfo.value.dzcg[i].map((f) => paipanInfo.value.tenMap[f]),
      xingyun: NaYin.getXingYun(paipanInfo.value.bazi[i], paipanInfo.value.bazi[2][0] as TG),
      zizuo: NaYin.getXingYun(paipanInfo.value.bazi[i], paipanInfo.value.bazi[i][0] as TG),
      nayin: NaYin.getNayin(paipanInfo.value.bazi[i]),
      ss: Shensha.getData(
        paipanInfo.value.bazi,
        paipanInfo.value.bazi[i],
        paipanInfo.value.yinli,
        paipanInfo.value.gender
      ),
    };
  });
});

// 找到藏干中最大的个数，来渲染藏干有几行
const cgMaxLength = computed(() =>
  pillarShowData.value.reduce((r, i) => {
    if (i.dzcg.length > r) {
      r = i.dzcg.length;
    }
    return r;
  }, 0)
);
const ssMaxLength = computed(() =>
  pillarShowData.value.reduce((r, i) => {
    if (i.ss.length > r) {
      r = i.ss.length;
    }
    return r;
  }, 0)
);

// 暂时放这 等着移走
enum PillarTitle {
  年柱 = '年柱',
  月柱 = '月柱',
  日柱 = '日柱',
  时柱 = '时柱',
  大运 = '大运',
  流年 = '流年',
  流月 = '流月',
  流日 = '流日',
  流时 = '流时',
}

type PillarItem = {
  title: string;
  isShow: boolean;
  zhuxing: Ten;
  tg: TG;
  dz: DZ;
  dzcg: string[];
  fx: number[];
  fx_text: string[]; // 新增 UI 渲染
  xingyun: ZhangSheng | null;
  zizuo: ZhangSheng | null;
  nayin: string;
  ss: ShenshaItem[];
};

const Sizhu = [PillarTitle.年柱, PillarTitle.月柱, PillarTitle.日柱, PillarTitle.时柱];
</script>

<style lang="scss" scoped>
p,
h1 {
  margin: 0;
}
.subheading {
  font-size: 16;
  color: #9f9f9f;
  text-align: center;
}
.tenText {
  color: #4b4b4b;
}
.shensha {
  color: #b2955e;
}
</style>
