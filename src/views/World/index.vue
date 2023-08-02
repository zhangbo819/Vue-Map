<template>
  <div>
    <YearHeader v-model="currentYear" :yearList="[2022, 2023]" />

    <div class="radios">
      <RadioGroup v-model="typeBig" direction="horizontal">
        <Radio name="3">按排名</Radio>
        <Radio name="1">按国家</Radio>
        <Radio name="2">按行业</Radio>
      </RadioGroup>

      <RadioGroup
        v-model="typeIsAll"
        direction="horizontal"
        style="margin-top: 12px"
      >
        <Radio name="2">精简版</Radio>
        <Radio name="1">完全版</Radio>
      </RadioGroup>
      <p><i>单位: 百万美元</i></p>
    </div>

    <!-- 按国家 -->
    <template v-if="typeBig === '1'">
      <div v-for="item in countryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable
          class="simpleTable"
          :config="
            typeIsAll === '1' ? configs.industry : configs.simple_industry
          "
          :data="item.children"
        />
      </div>
    </template>

    <!-- 按行业 -->
    <template v-else-if="typeBig === '2'">
      <div v-for="item in industryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable
          class="simpleTable"
          :config="
            typeIsAll === '1' ? configs.industry : configs.simple_country
          "
          :data="item.children"
        />
      </div>
    </template>

    <!-- 按排名 -->
    <MyTable
      v-else-if="typeBig === '3'"
      class="simpleTable"
      :config="typeIsAll === '1' ? configs.industry : configs.simple_country"
      :data="currentData"
    />
  </div>
</template>

<script>
// import { VanRadioGroup, VanRadio } from "vant";
import { RadioGroup, Radio, List as VanList } from "vant";
import YearHeader from "@/components/YearHeader.vue";
import MyTable from "@/components/MyTable.vue";
import { getWorldYearData } from "../China/util";

// getWorldYearData
const layout = [
  { title: "排名", key: "index" },
  { title: "简称", key: "simpleName" },
  { title: "名称", key: "name" },
  { title: "行业", key: "industry" },
  { title: "国家", key: "country" },
  { title: "营收", key: "revenue" },
  { title: "净利润", key: "profit" },
];
function getLayout(targets = []) {
  return targets.map((title) => {
    return layout.find((i) => i.title === title);
  });
}

export default {
  name: "WorldPage",
  components: { YearHeader, RadioGroup, Radio, VanList, MyTable },
  data() {
    // console.log("this.$route.query", this.$route.query);
    const { typeBig = "1", typeIsAll = "2" } = this.$route.query;
    return {
      currentYear: 2023,
      typeBig,
      typeIsAll,
      configs: {
        simple_industry: getLayout(["排名", "简称", "行业"]),
        simple_country: getLayout(["排名", "国家", "简称"]),
        industry: getLayout(["排名", "名称", "行业", "营收", "净利润"]),
      },
    };
  },
  computed: {
    currentData() {
      return (
        getWorldYearData(this.currentYear).map((i) => {
          i.simpleName = i.name.replace(
            /有限公司|股份有限公司|有限责任公司|公司$/,
            ""
          );
          return i;
        }) || []
      );
    },
    // 按国家分类
    countryData() {
      const data = this.currentData
        .reduce((r, i) => {
          const target = r.find((j) => j.name === i.country);
          if (!target) {
            r.push({ name: i.country, count: 0, children: [i] });
          } else {
            target.children.push(i);
          }

          return r;
        }, [])
        .map((i) => {
          i.count = i.children.length;
          return i;
        })
        .sort((a, b) => b.count - a.count);

      // console.log("countryData", data);

      return data;
    },
    // 按行业分类
    industryData() {
      return this.currentData
        .reduce((r, i) => {
          const target = r.find((j) => j.name === i.industry);
          if (target) {
            target.children.push(i);
          } else {
            r.push({ name: i.industry, count: 1, children: [i] });
          }
          return r;
        }, [])
        .map((i) => {
          i.count = i.children.length;
          return i;
        })
        .sort((a, b) => b.count - a.count);
    },
  },
  //   watch: {
  //     typeBig(val) {
  //       console.log("this.$route", this.$route);
  //       const { query } = this.$route;
  //       query.typeBig = val;
  //       this.$router.push({
  //         path: this.$route.path,
  //         query
  //       });
  //     },
  //     typeIsAll() {}
  //   },
  mounted() {
    // console.log("currentData", this.currentData);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.radios {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.simpleTable {
  margin: 0 auto;
}
</style>
