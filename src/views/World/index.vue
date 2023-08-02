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
        style="margin-top: 12px;"
      >
        <Radio name="2">精简版</Radio>
        <Radio name="1">完全版</Radio>
      </RadioGroup>
      <p><i>单位: 百万美元</i></p>
    </div>

    <van-list v-if="typeBig === '1'">
      <div v-for="item in countryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <template v-if="typeIsAll === '1'">
          <div v-for="i in item.children" :key="'all' + i.name">
            {{
              `第${i.index}名 ${i.name} | ${i.industry} 营收 ${i.revenue} ${
                i.profit ? "净利润 " + i.profit : ""
              }`
            }}
          </div>
        </template>
        <template v-else>
          <div v-for="i in item.children" :key="'simple' + i.name">
            {{ `${i.index} ${i.name} | ${i.industry}` }}
          </div>
        </template>
      </div>
    </van-list>
    <van-list v-else-if="typeBig === '2'">
      <div v-for="item in industryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <template v-if="typeIsAll === '1'">
          <div v-for="i in item.children" :key="'all' + i.name">
            {{
              `第${i.index}名 ${i.country} ${i.name} 营收 ${i.revenue} ${
                i.profit ? "净利润 " + i.profit : ""
              }`
            }}
          </div>
        </template>
        <template v-else>
          <div v-for="i in item.children" :key="'simple' + i.name">
            {{ `${i.index} ${i.country} ${i.name}` }}
          </div>
        </template>
      </div>
    </van-list>
    <van-list v-else-if="typeBig === '3'">
      <div v-for="i in currentData" :key="i.name">
        <template v-if="typeIsAll === '1'">
          <p>
            {{
              `第${i.index}名 ${i.country} ${i.name} 营收 ${i.revenue} ${
                i.profit ? "净利润 " + i.profit : ""
              }`
            }}
          </p>
        </template>
        <template v-else>
          <p>
            {{ `${i.index} ${i.country} ${i.name}` }}
          </p>
        </template>
      </div>
    </van-list>
    <!-- {{ JSON.stringify(countryData, null, 4) }} -->
  </div>
</template>

<script>
// import { VanRadioGroup, VanRadio } from "vant";
import { RadioGroup, Radio, List as VanList } from "vant";
import YearHeader from "../../components/YearHeader.vue";
import { getWorldYearData } from "../China/util";

// getWorldYearData

export default {
  name: "WorldPage",
  components: { YearHeader, RadioGroup, Radio, VanList },
  data() {
    console.log("this.$route.query", this.$route.query);
    const { typeBig = "1", typeIsAll = "2" } = this.$route.query;
    return {
      currentYear: 2023,
      typeBig,
      typeIsAll
    };
  },
  computed: {
    currentData() {
      return getWorldYearData(this.currentYear) || [];
    },
    // 按国家分类
    countryData() {
      const data = this.currentData
        .reduce((r, i) => {
          const target = r.find(j => j.name === i.country);
          if (!target) {
            r.push({ name: i.country, count: 0, children: [i] });
          } else {
            target.children.push(i);
          }

          return r;
        }, [])
        .map(i => {
          i.count = i.children.length;
          return i;
        })
        .sort((a, b) => b.count - a.count);

      console.log("countryData", data);

      return data;
    },
    // 按行业分类
    industryData() {
      return this.currentData
        .reduce((r, i) => {
          const target = r.find(j => j.name === i.industry);
          if (target) {
            target.children.push(i);
          } else {
            r.push({ name: i.industry, count: 1, children: [i] });
          }
          return r;
        }, [])
        .map(i => {
          i.count = i.children.length;
          return i;
        })
        .sort((a, b) => b.count - a.count);
    }
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
    console.log("currentData", this.currentData);
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.radios {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
