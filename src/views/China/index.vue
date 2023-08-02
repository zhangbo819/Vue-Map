<template>
  <div>
    <YearHeader v-model="currentYear" :yearList="[2021, 2022, 2023]" />

    <!-- 公司柱状图 -->
    <CompanyChart :data="currentData" />

    <!-- china 地图 -->
    <div id="main" style="min-height: 550px; width: 100%; margin: auto" />

    <p v-if="currentProvince">
      {{ currentProvince }} &nbsp;
      <span @click="nav" style="text-decoration-line: underline">详情</span>
    </p>

    <!-- {{ currentProvinceData }} -->

    <CityList :provinceData="currentProvinceData" :isDetails="false" />
  </div>
</template>

<script>
import CityList from "@/components/CityList.vue";
import YearHeader from "@/components/YearHeader.vue";
import CompanyChart from "./CompanyChart.vue";
import { getYearData } from "./util";
// import new2022Data from "../../utils/500/new2022Data.json";
// console.log('china')

export default {
  components: {
    CityList,
    CompanyChart,
    YearHeader,
  },
  // render: function(createElement) {
  //   return createElement("div", {
  //     attrs: {
  //       id: "main"
  //     },
  //     style: {
  //       "min-height": "550px",
  //       width: "100%",
  //       margin: "auto"
  //     }
  //   });
  // },
  data() {
    return {
      dataList: [
        { name: "南海诸岛" },
        { ename: "beijing", name: "北京" },
        { ename: "tianjin", name: "天津" },
        { ename: "shanghai", name: "上海" },
        { ename: "chongqing", name: "重庆" },
        { ename: "hebei", name: "河北" },
        { ename: "henan", name: "河南" },
        { ename: "yunnan", name: "云南" },
        { ename: "liaoning", name: "辽宁" },
        { ename: "heilongjiang", name: "黑龙江" },
        { ename: "hunan", name: "湖南" },
        { ename: "anhui", name: "安徽" },
        { ename: "shandong", name: "山东" },
        { ename: "xinjiang", name: "新疆" },
        { ename: "jiangsu", name: "江苏" },
        { ename: "zhejiang", name: "浙江" },
        { ename: "jiangxi", name: "江西" },
        { ename: "hubei", name: "湖北" },
        { ename: "guangxi", name: "广西" },
        { ename: "gansu", name: "甘肃" },
        { ename: "shanxi", name: "山西" },
        { ename: "neimenggu", name: "内蒙古" },
        { ename: "shanxi1", name: "陕西" },
        { ename: "jilin", name: "吉林" },
        { ename: "fujian", name: "福建" },
        { ename: "guizhou", name: "贵州" },
        { ename: "guangdong", name: "广东" },
        { ename: "qinghai", name: "青海" },
        { ename: "xizang", name: "西藏" },
        { ename: "sichuan", name: "四川" },
        { ename: "ningxia", name: "宁夏" },
        { ename: "hainan", name: "海南" },
        { name: "台湾" },
        { ename: "xianggang", name: "香港" },
        { ename: "aomen", name: "澳门" },
      ],
      currentYear: new Date().getFullYear(),
      currentProvince: "",
    };
  },
  computed: {
    currentData() {
      return getYearData(this.currentYear);
    },
    currentProvinceData() {
      return this.currentData.find((i) =>
        i.name.includes(this.currentProvince)
      );
    },
  },
  watch: {
    currentData: {
      handler() {
        this.initEchart();
      },
    },
  },
  mounted() {
    console.log("china mounted");
    window.addEventListener("resize", this.resize);
    this.initEchart();
  },
  beforeMount() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    initEchart() {
      const { currentData } = this;
      console.log("currentData", currentData);
      let dataList = this.dataList;

      dataList.forEach((item, i) => {
        const target = currentData.find((j) => j.name.includes(item.name));
        dataList[i].value = target ? target.count : 0;
      });

      const myChart = echarts.init(document.getElementById("main"));
      this.myChart = myChart;
      const option = {
        tooltip: {
          //数据格式化
          formatter(params, cb) {
            return (
              params.seriesName + "<br />" + params.name + "：" + params.value
            );
          },
        },
        visualMap: {
          min: 0,
          max: currentData.reduce((r, item) => {
            if (item.count > r) {
              r = item.count;
            }
            return r;
          }, 0),
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 取值范围的文字
          inRange: {
            color: ["#e0ffff", "blue"], // 取值范围的颜色
          },
          show: true, // 图注
        },
        geo: {
          map: "china", // 引入地图数据
          roam: false, // 不开启缩放和平移
          zoom: 1, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: "10",
              color: "rgba(0,0,0,0.7)",
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              // 高亮的显示设置
              areaColor: "skyblue", // 鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
        // 鼠标悬浮提示框
        series: [
          {
            name: "省份",
            type: "map",
            geoIndex: 0,
            data: this.dataList,
          },
        ],
      };
      myChart.setOption(option);
      myChart.on("click", (params) => {
        if (!params.data.ename) {
          alert("暂无" + params.name + "地图数据");
          return;
        }

        this.currentProvince = params.data.name;
        console.log("currentProvince", this.currentProvince);
        this.navInfo = {
          provinceName: params.data.ename,
          province: params.name,
          year: this.currentYear,
        };
      });
    },
    resize() {
      if (this.myChart && this.myChart.resize) {
        this.myChart.resize();
      }
    },
    nav() {
      this.$router.push({
        path: "/province",
        query: this.navInfo,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.yearList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    cursor: pointer;

    &.active {
      text-decoration-line: underline;
      color: #f008;
    }

    & + p {
      margin-left: 16px;
    }
  }
}
</style>
