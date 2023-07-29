<template>
  <div>
    <header>
      <div @click="goBack()">返回</div>
      <div class="all" @click="handleAll">
        {{ `${$route.query.province} 总 ${provinceData.count} 个` }}
      </div>
    </header>

    <div :id="id" class="o-echarts"></div>

    <CityList :provinceData="showList" isDetails />

    <!-- <div v-for="(item, index) in showList" :key="item.name || index">
      <span>{{ index + 1 }}. {{ item.name }} 排名 {{ item.index }}</span>
      <p>营收{{ item.revenue }} 万元 总部地址 {{ item.address }}</p>
    </div> -->
  </div>
</template>

<script>
import CityList from "@/components/CityList.vue";
import { getYearData } from "./util";

export default {
  name: "province",
  components: {
    CityList
  },
  data() {
    return {
      id: "echarts_" + new Date().getTime(),
      echartObj: null,
      option: {
        title: {
          text: "",
          top: "8%",
          left: "8%",
          textStyle: {
            fontSize: 14,
            fontWeight: 300,
            color: "#b6d7ff"
          }
        },
        tooltip: {
          padding: 0,
          //   backgroundColor: "transparent",
          // 数据格式化
          formatter: function(params, callback) {
            return params.name + "：" + params.value;
          }
        },
        legend: {
          orient: "vertical",
          top: "9%",
          left: "5%",
          icon: "circle",
          data: [],
          selectedMode: "single",
          selected: {},
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 30,
          inactiveColor: "#b6d7ff",
          textStyle: {
            color: "#ec808d",
            fontSize: 14,
            fontWeight: 300,
            padding: [0, 0, 0, 15]
          }
        },
        visualMap: {
          min: 0,
          max: 80,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 取值范围的文字
          inRange: {
            color: ["#e0ffff", "blue"] // 取值范围的颜色
          },
          show: true // 图注
        },
        geo: {
          map: "",
          roam: false, // 不开启缩放和平移
          zoom: 1, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: 10,
              color: "#000"
            },
            emphasis: {
              show: true,
              color: "blue"
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: "skyblue", // 鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "5%"
        },
        series: [
          {
            name: "年度总项目数据查询",
            type: "map",
            geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
            data: []
          }
        ],
        provinceJSON: {},
        provinceName: ""
      },
      showList: null
    };
  },
  computed: {
    currentData() {
      return getYearData(this.$route.query.year) || [];
    },
    provinceData() {
      console.log("this.currentData", this.currentData);
      return this.currentData.find(item =>
        item.name.includes(this.$route.query.province)
      );
    }
  },
  watch: {
    provinceData() {
      this.renderMap();
    }
  },
  mounted() {
    this.renderMap();
    this.handleAll();
  },
  beforeMount() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    renderMap() {
      const provinceName = this.$route.query.provinceName;
      const province = this.$route.query.province;
      this.provinceName = provinceName;
      this.provinceJSON = require("../../utils/省份数据/json(省份)/" +
        provinceName);
      this.option.geo.map = province;
      this.option.series[0].data = this.currentData
        .find(item => item.name.includes(this.$route.query.province))
        .children.map(i => ({ name: i.name, value: i.count }));
      this.echartObj = echarts.init(document.getElementById(this.id));
      echarts.registerMap(province, this.provinceJSON);
      // console.log("this.option", this.option);
      this.echartObj.setOption(this.option);
      window.addEventListener("resize", this.resize);

      this.echartObj.on("click", params => {
        console.log("params", params.name);
        // console.log("", this.provinceData);
        const target = this.provinceData.children.filter((i) => i.name.includes(params.name))
        console.log("target", target);
        if (target) {
          this.showList = {
            count: this.provinceData.count,
            name: this.provinceData.name,
            children: target
          };
        } else {
          this.showList = [];
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    resize() {
      if (this.echartObj && this.echartObj.resize) {
        this.echartObj.resize();
      }
    },
    handleAll() {
      console.log("this.provinceData", this.provinceData);
      this.showList = this.provinceData;
    }
  }
};
</script>
<style lang="scss">
.o-echarts {
  min-height: 550px;
  width: 100%;
  margin: auto;
}
</style>
<style lang="scss" scoped>
.all {
  text-decoration-line: underline;
  cursor: pointer;
}
</style>
