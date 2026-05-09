<template>
  <div style="width: 100%">
    <h1 style="margin-bottom: 8px; font-size: 1.6em">Astrology</h1>
    <!-- 星座盘 -->
    <astro-round-plate :data="data" />

    <!-- 操作栏 -->
    <astro-operation v-model:time="time" />

    <van-collapse v-model="activeTab">
      <!-- 参数详情列表 -->
      <van-collapse-item name="1">
        <template #title>
          <h2>参数详情列表</h2>
        </template>
        <van-cell-group inset>
          <van-cell
            v-for="item in data"
            :key="item.name"
            :title="`${item.name} ${planentsMap[item.name].name}`"
            :label="item.longitude"
            :title-style="{ color: planentsMap[item.name].color }"
          >
            <p class="value" :style="{ color: map12[item.sign].color }">
              {{ item.sign }} {{ map12[item.sign].name }}
              <span v-if="item.retrograde">R</span>
            </p>
            <p class="value">{{ item.degree }}°</p>
          </van-cell>
        </van-cell-group>
      </van-collapse-item>

      <!-- 相位 -->
      <van-collapse-item name="2">
        <template #title> <h2>主要相位</h2></template>
        <van-cell-group inset>
          <van-cell
            v-for="item in aspectData"
            :key="item.between"
            :label="item.between.join(' - ')"
          >
            <template #title>
              <p>
                <span :style="{ color: planentsMap[item.between[0]].color }">{{
                  planentsMap[item.between[0]].name
                }}</span>
                -
                <span :style="{ color: planentsMap[item.between[1]].color }">{{
                  planentsMap[item.between[1]].name
                }}</span>
              </p>
            </template>
            <p class="value" :style="{ color: aspectPosition.map[item.type].color }">
              {{ item.type }} {{ aspectPosition.map[item.type].name }}
            </p>
            <p class="value">
              开始时间 {{ item.start.toLocaleDateString() }} {{ item.start.getHours() }}:{{
                item.start.getMinutes()
              }}
            </p>
            <p class="value">
              力量最强 {{ item.exact.toLocaleDateString() }} {{ item.exact.getHours() }}:{{
                item.exact.getMinutes()
              }}
            </p>
            <p class="value">
              结束时间 {{ item.end.toLocaleDateString() }} {{ item.end.getHours() }}:{{
                item.end.getMinutes()
              }}
            </p>
            <p class="value">计算耗时 {{ item.t }} ms</p>
            <!-- <p
          class="value"
          :style="{
            fontWeight: item.strength === 'strong' ? 'bold' : 'normal',
          }"
        >
          {{ item.strength }} ({{ item.orb }}°)
        </p> -->
          </van-cell>
        </van-cell-group>
      </van-collapse-item>

      <!-- 八字 临时放这里 -->
      <van-collapse-item name="3">
        <template #title>
          <h2>八字</h2>
        </template>

        <!-- 标题 -->
        <van-row>
          <van-col span="4" />
          <van-col v-for="(item, index) in pillarShowData" :key="item.title" span="5">
            <p>{{ item.title }}</p>
          </van-col>
        </van-row>
        <!-- 十神 -->
        <van-row style="margin-top: 5px">
          <van-col span="4">
            <p class="subheading">主星</p>
          </van-col>
          <van-col
            v-for="(item, index) in pillarShowData"
            :key="'zhuxing' + item.tg + index"
            span="5"
          >
            <p class="tenText">{{ item.zhuxing }}</p>
          </van-col>
        </van-row>
        <!-- 天干 -->
        <van-row style="margin-top: 5px">
          <van-col span="4">
            <p class="subheading">天干</p>
          </van-col>
          <van-col v-for="(item, index) in pillarShowData" :key="'tg' + item.tg + index" span="5">
            <!-- <WuxingText text={item.tg} /> -->
            <p :style="{ color: WuXing.getColorByWuxing(item.tg), fontSize: '20px' }">
              {{ item.tg }}
            </p>
          </van-col>
        </van-row>
        <!-- 地支 -->
        <van-row>
          <van-col span="4">
            <p class="subheading">地支</p>
          </van-col>
          <van-col v-for="(item, index) in pillarShowData" :key="'dz' + item.tg + index" span="5">
            <!-- <WuxingText text={item.dz} /> -->
            <p :style="{ color: WuXing.getColorByWuxing(item.dz), fontSize: '20px' }">
              {{ item.dz }}
            </p>
          </van-col>
        </van-row>
        <!-- 藏干 -->
        <van-row v-for="(_, index) in cgMaxLength" :key="'cg_row_' + index" style="margin-top: 5px">
          <van-col span="4">
            <p v-if="index === 0" class="subheading">藏干</p>
          </van-col>
          <van-col
            v-for="(item, y) in pillarShowData"
            :key="'dzcg' + item.dzcg + index + y"
            span="5"
          >
            <!-- <WuxingText text={item.dzcg[index]} /> -->
            <p :style="{ color: WuXing.getColorByWuxing(item.dzcg[index]?.[0]) }">
              {{ item.dzcg[index] }}
            </p>
          </van-col>
        </van-row>
        <!-- 副星 -->
        <van-row v-for="(_, index) in cgMaxLength" :key="'fx_row_' + index" style="margin-top: 5px">
          <van-col span="4">
            <p v-if="index === 0" class="subheading">副星</p>
          </van-col>
          <van-col
            v-for="(item, y) in pillarShowData"
            :key="'fx' + item.fx[index] + index + y"
            span="5"
          >
            <p class="tenText">
              {{ item.fx_text[index] }}
            </p>
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
            <p class="tenText">
              {{ item.xingyun }}
            </p>
          </van-col>
        </van-row>
        <!-- 12长生 自坐 -->
        <van-row style="margin-top: 5px">
          <van-col span="4">
            <p class="subheading">自坐</p>
          </van-col>
          <van-col
            v-for="(item, index) in pillarShowData"
            :key="'zizuo' + item.zizuo + index"
            span="5"
          >
            <p class="tenText">
              {{ item.zizuo }}
            </p>
          </van-col>
        </van-row>
        <!-- 纳音 -->
        <van-row style="margin: 5px 0 3px">
          <van-col span="4">
            <p class="subheading">纳音</p>
          </van-col>
          <van-col
            v-for="(item, index) in pillarShowData"
            :key="'nayin' + item.nayin + index"
            span="5"
          >
            <p :style="{ color: WuXing.getColorByWuxing(item.nayin[2]) }">
              {{ item.nayin }}
            </p>
          </van-col>
        </van-row>
        <!-- 神煞 -->
        <van-row v-for="(_, index) in ssMaxLength" :key="'ss_row_' + index" style="margin-top: 2px">
          <van-col span="4">
            <p v-if="index === 0" class="subheading">神煞</p>
          </van-col>
          <van-col
            v-for="(item, y) in pillarShowData"
            :key="'ss' + item.ss[index] + index + y"
            span="5"
          >
            <p class="shensha">
              {{ item.ss[index] }}
            </p>
          </van-col>
        </van-row>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAllPlanets, aspectPosition } from '@/utils/astro/planets';
import { map12, planentsMap } from '@/utils/astro/astroUI';
import AstroOperation from './components/AstroOperation.vue';
import AstroRoundPlate from './components/AstroRoundPlate.vue';
import {
  paipan,
  TG,
  DZ,
  Ten,
  WuXing,
  NaYin,
  Shensha,
  ZhangSheng,
  ShenshaItem,
} from 'astro-bazi-utils';

const time = ref(new Date());

const data = computed(() => {
  return getAllPlanets(time.value);
});

const activeTab = ref(['1', '2', '3']);

const aspectData = computed(() => {
  return aspectPosition.getData(data.value).map((i) => {
    const r = aspectPosition.findAspectWindow(time.value, i.between[0], i.between[1], i.type);
    return {
      ...i,
      ...r,
    };
  });
});

// 八字
// 暂时放这 等着移走
const pillarShowData = computed(() => {
  const paipanInfo = paipan.GetInfo(0, time.value.getTime());
  console.log(paipanInfo);

  return Sizhu.map<PillarItem>((title, i) => {
    let zhuxing = paipanInfo.tenMap[paipanInfo.tg[i]];
    if (title === PillarTitle.日柱) {
      zhuxing = paipanInfo.gender === 0 ? Ten.元男 : Ten.元女;
    }
    return {
      title,
      isShow: true,
      zhuxing: zhuxing,
      tg: paipanInfo.bazi[i][0] as TG,
      dz: paipanInfo.bazi[i][1] as DZ,
      dzcg: paipanInfo.dzcg_text[i],
      fx: paipanInfo.dzcg[i],
      fx_text: paipanInfo.dzcg[i].map((f) => paipanInfo.tenMap[f]),
      xingyun: NaYin.getXingYun(paipanInfo.bazi[i], paipanInfo.bazi[2][0] as TG),
      zizuo: NaYin.getXingYun(paipanInfo.bazi[i], paipanInfo.bazi[i][0] as TG),
      nayin: NaYin.getNayin(paipanInfo.bazi[i]),
      ss: Shensha.getData(paipanInfo.bazi, paipanInfo.bazi[i], paipanInfo.yinli, paipanInfo.gender),
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

.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
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
