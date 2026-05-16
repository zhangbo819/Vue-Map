<template>
  <div>
    <!-- Analyse -->
    <div ref="refMap" style="min-height: 300px; width: 100%; margin: auto" />
  </div>
</template>

<script setup lang="ts">
import { useAstroStore } from '@/store/astro';
import { ASTRO_ELEMENTS, ASTRO_MODALITIES } from '@/utils/astro/constant';
import { AstroDistribution, buildDistribution } from '@/utils/astro/planets';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const store = useAstroStore();

function toElementRadarData(distribution: AstroDistribution) {
  return ASTRO_ELEMENTS.map((e) => distribution.element[e].length);
}

function toModalityRadarData(distribution: AstroDistribution) {
  return ASTRO_MODALITIES.map((m) => distribution.modality[m].length);
}

const refMap = ref();
let myChart: any;
const init = () => {
  const distribution = buildDistribution(store.planetList);
  const max_4 = 5;
  const max_3 = 6;
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
    },

    legend: {
      left: 'center',
      data: ['四元素', '三模式'],
    },

    title: [
      {
        text: '四元素',
        left: '25%',
        top: 10,
        textAlign: 'center',
      },

      {
        text: '三模式',
        left: '75%',
        top: 10,
        textAlign: 'center',
      },
    ],

    radar: [
      // 四元素
      {
        center: ['25%', '58%'],

        radius: 90,

        splitNumber: 5,

        shape: 'polygon',

        indicator: [
          { name: '火', max: max_4 },
          { name: '土', max: max_4 },
          { name: '风', max: max_4 },
          { name: '水', max: max_4 },
        ],

        // splitLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255, 0.08)',
        //   },
        // },

        // splitArea: {
        //   areaStyle: {
        //     color: ['rgba(255,255,255,0.015)', 'rgba(255,255,255,0.025)'],
        //   },
        // },

        // 中间x y 轴的线
        // axisLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255,0.12)',
        //   },
        // },
      },

      // 三模式
      {
        center: ['75%', '58%'],

        radius: 90,

        splitNumber: 5,

        shape: 'polygon',

        indicator: [
          { name: '开创', max: max_3 },
          { name: '固定', max: max_3 },
          { name: '变动', max: max_3 },
        ],

        // splitLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255,0.08)',
        //   },
        // },

        // splitArea: {
        //   areaStyle: {
        //     color: ['rgba(255,255,255,0.015)', 'rgba(255,255,255,0.025)'],
        //   },
        // },

        // axisLine: {
        //   lineStyle: {
        //     color: 'rgba(255,255,255,0.12)',
        //   },
        // },
      },
    ],

    series: [
      // 四元素
      {
        type: 'radar',

        radarIndex: 0,

        symbol: 'circle',

        symbolSize: 6,

        lineStyle: {
          width: 3,
          color: '#ff9666', // 围起来的颜色
          //   color: 'red', // 围起来的线的颜色
        },

        itemStyle: {
          color: '#ff9666', // 围起来的颜色
        },

        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255,170,120,0.42)',
              },
              {
                offset: 1,
                color: 'rgba(255,120,80,0.12)',
              },
            ],
          },
        },

        emphasis: {
          lineStyle: {
            width: 4,
          },
        },

        data: [
          {
            name: '四元素',

            value: toElementRadarData(distribution),
          },
        ],
      },

      // 三模式
      {
        type: 'radar',

        radarIndex: 1,

        symbol: 'circle',

        symbolSize: 6,

        lineStyle: {
          width: 2,
          color: '#8ea8ff',
        },

        itemStyle: {
          color: '#8ea8ff',
        },

        areaStyle: {
          color: {
            type: 'radial',

            x: 0.5,
            y: 0.5,
            r: 1,

            colorStops: [
              {
                offset: 0,
                color: 'rgba(160,180,255,0.36)',
              },

              {
                offset: 1,
                color: 'rgba(120,140,255,0.10)',
              },
            ],
          },
        },

        emphasis: {
          lineStyle: {
            width: 3,
          },
        },

        data: [
          {
            name: '三模式',

            value: toModalityRadarData(distribution),
          },
        ],
      },
    ],
  };

  myChart = window.echarts.init(refMap.value);
  myChart.setOption(option);
};
const resize = () => {
  if (myChart && myChart.resize) {
    myChart.resize();
  }
};

watch(
  () => store.planetList,
  () => {
    init();
  }
);
onMounted(() => {
  window.addEventListener('resize', resize);
  init();
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});
</script>
