<template>
  <div ref="refMap" style="min-height: 550px; width: 100%; margin: auto;"></div>
</template>

<script>
export default {
  name: "CompanyChart",

  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  watch: {
    data() {
      this.init();
    }
  },

  mounted() {
    window.addEventListener("resize", this.resize);
    this.init();
  },
  beforeMount() {
    window.removeEventListener("resize", this.resize);
  },

  methods: {
    init() {
      console.log("data", this.data);
      const companyList = this.data
        .reduce((r, i) => {
          i.children.forEach(j => {
            j.children.forEach(k => {
              r.push(k);
            });
          });
          return r;
        }, [])
        .sort((a, b) => a.index - b.index)
        .slice(0, 20);

    //   console.log("companyList", companyList);

      const option = {
        title: { text: "前20公司" },
        // xAxis: {
        //   type: "category",
        //   data: companyList.map(item => item.name),
        //   axisTick: {
        //     alignWithLabel: true
        //   },
        // },
        // yAxis: {
        //   name: "营收(万元)",
        //   type: "value"
        // },

        dataset: [
          {
            dimensions: ["name", "revenue", "profession", "index"],
            source: companyList.map(i => [
              i.name.replace(/(股份)?有限公司/, ''),
              i.revenue,
              i.address,
              i.index
            ])
          },
          {
            transform: {
              type: "sort",
              config: { dimension: "index", order: "asc" }
            }
          }
        ],
        xAxis: {
          type: "category",
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {
          name: "营收(万元)"
        },
        series: {
          type: "bar",
          encode: { x: "name", y: "score" },
          datasetIndex: 1
        },

        // series: [
        //   {
        //     // data: companyList.map(i => i.revenue),
        //     type: "bar",
        //     showBackground: true,
        //     backgroundStyle: {
        //       color: "rgba(180, 180, 180, 0.2)"
        //     }
        //   }
        // ],

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        }
      };

      const myChart = echarts.init(this.$refs.refMap);
      this.myChart = myChart;
      myChart.setOption(option);
    },
    resize() {
      if (this.myChart && this.myChart.resize) {
        this.myChart.resize();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
