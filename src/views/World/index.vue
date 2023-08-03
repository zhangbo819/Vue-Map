<template>
  <div>
    <YearHeader v-model="currentYear" :yearList="supportList" />

    <div class="radios">
      <RadioGroup v-model="form.type" direction="horizontal">
        <Radio name="3">按排名</Radio>
        <Radio name="1">按国家</Radio>
        <Radio name="2">按行业</Radio>
      </RadioGroup>

      <RadioGroup
        v-if="supportList.includes(currentYear - 1)"
        v-model="form.compare"
        direction="horizontal"
        style="margin-top: 12px"
      >
        <Radio name="0">正常</Radio>
        <Radio name="1">与去年对比</Radio>
      </RadioGroup>

      <RadioGroup
        v-model="form.isAll"
        direction="horizontal"
        style="margin-top: 12px"
      >
        <Radio name="2">精简版</Radio>
        <Radio name="1">完整版</Radio>
      </RadioGroup>
      <p><i>单位: 百万美元</i></p>
    </div>

    <!-- 按国家 -->
    <template v-if="form.type === '1'">
      <div v-for="item in countryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable
          class="simpleTable"
          :config="
            form.isAll === '1' ? configs.industry : configs.simple_industry
          "
          :data="item.children"
        />
      </div>
    </template>

    <!-- 按行业 -->
    <template v-else-if="form.type === '2'">
      <div v-for="item in industryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable
          class="simpleTable"
          :config="
            form.isAll === '1' ? configs.industry : configs.simple_country
          "
          :data="item.children"
        />
      </div>
    </template>

    <!-- 按排名 -->
    <MyTable
      v-else-if="form.type === '3'"
      class="simpleTable"
      :config="form.isAll === '1' ? configs.industry : configs.simple_country"
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

const layout = [
  { title: "排名", key: "index" },
  { title: "排名", key: "compare_index" },
  { title: "简称", key: "simpleName" },
  { title: "名称", key: "name" },
  { title: "行业", key: "industry" },
  { title: "国家", key: "country" },
  { title: "营收", key: "revenue" },
  { title: "净利润", key: "profit" }
];
function getLayout(targets = []) {
  return targets.map(key => {
    return layout.find(i => i.key === key);
  });
}

export default {
  name: "WorldPage",
  components: { YearHeader, RadioGroup, Radio, VanList, MyTable },
  data() {
    // console.log("this.$route.query", this.$route.query);
    const { type = "1", isAll = "2" } = this.$route.query;
    return {
      currentYear: new Date().getFullYear(),
      supportList: [2021, 2022, 2023],
      form: {
        type,
        isAll,
        compare: "0"
      },
      configs: {
        simple_industry: getLayout(["index", "simpleName", "industry"]),
        simple_country: getLayout(["index", "country", "simpleName"]),
        industry: getLayout(["index", "name", "industry", "revenue", "profit"])
      }
    };
  },
  computed: {
    currentData() {
      return (
        getWorldYearData(this.currentYear).map(i => {
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

      // console.log("countryData", data);

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
  watch: {
    currentYear() {
      this.form.compare = "0";
    },
    // 对比功能
    "form.compare"(val) {
      const compare_keys = ["index"];
      if (val === "1") {
        const previousYear = this.currentYear - 1;
        const previousData = getWorldYearData(previousYear);

        this.currentData.forEach(item => {
          if (typeof item.compare_index === "undefined") {
            const target = previousData.find(j => j.name === item.name);
            if (target) {
              const compareNumber = target.index - item.index;
              item.compare_index =
                compareNumber === 0
                  ? "- 0"
                  : compareNumber > 0
                  ? `↑ ${compareNumber}`
                  : `↓ ${Math.abs(compareNumber)}`;
            } else {
              item.compare_index = "新";
            }
          }
        });
        // console.log("this.currentData", this.currentData);
        for (let key in this.configs) {
          compare_keys.forEach(compare_key => {
            const target = this.configs[key].find(i => i.key === compare_key);
            if (target) {
              target.key = "compare_" + compare_key;
            }
          });
        }
      } else {
        for (let key in this.configs) {
          compare_keys.forEach(compare_key => {
            const target = this.configs[key].find(
              i => i.key === "compare_" + compare_key
            );
            if (target) {
              target.key = compare_key;
            }
          });
        }
      }
    }
  },
  mounted() {
    // console.log("currentData", this.currentData);
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
.simpleTable {
  margin: 0 auto;
}
</style>
