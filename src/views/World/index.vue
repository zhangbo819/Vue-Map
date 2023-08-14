<template>
  <div>
    <YearHeader v-model="currentYear" :yearList="supportList" />

    <div class="radios">
      <van-radio-group v-model="form.type" direction="horizontal">
        <van-radio :name="enumTypes.index">按排名</van-radio>
        <van-radio :name="enumTypes.country">按国家</van-radio>
        <van-radio :name="enumTypes.industry">按行业</van-radio>
      </van-radio-group>

      <van-radio-group
        v-if="supportList.includes(currentYear - 1)"
        v-model="form.compare"
        direction="horizontal"
        style="margin-top: 12px"
      >
        <van-radio name="0">正常</van-radio>
        <van-radio name="1">与去年对比</van-radio>
      </van-radio-group>

      <van-radio-group
        v-model="form.isAll"
        direction="horizontal"
        style="margin-top: 12px"
      >
        <van-radio name="0">精简版</van-radio>
        <van-radio name="1">完整版</van-radio>
      </van-radio-group>

      <!-- 列表项 -->
      <van-checkbox-group
        v-model="form.layout"
        direction="horizontal"
        style="margin-top: 12px; justify-content: center;"
      >
        <van-checkbox
          v-for="item in showConfig"
          :key="item.key"
          :name="item.key"
          :disabled="form.layout.length === 1 && form.layout[0] === item.key"
          >{{ item.title }}</van-checkbox
        >
      </van-checkbox-group>

      <p><i>单位: 百万美元</i></p>
    </div>

    <!-- 按国家 -->
    <template v-if="form.type === enumTypes.country">
      <!-- <nav class="navList">
        <span v-for="item in countryData" :key="'nav'+ item.name">
          {{ `${item.name}` }}
        </span>
      </nav> -->
      <div v-for="item in countryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable class="simpleTable" :config="configs" :data="item.children" />
      </div>
    </template>

    <!-- 按行业 -->
    <template v-else-if="form.type === enumTypes.industry">
      <div v-for="item in industryData" :key="item.name">
        <h3>{{ `${item.name} (${item.count}个)` }}</h3>
        <MyTable class="simpleTable" :config="configs" :data="item.children" />
      </div>
    </template>

    <!-- 按排名 -->
    <template v-else-if="form.type === enumTypes.index">
      <h3>{{ `${currentYear}年排名` }}</h3>
      <MyTable class="simpleTable" :config="configs" :data="currentData" />
    </template>
  </div>
</template>

<script>
import {
  RadioGroup as VanRadioGroup,
  Radio as VanRadio,
  List as VanList,
  Checkbox as VanCheckbox,
  CheckboxGroup as VanCheckboxGroup
} from "vant";
import YearHeader from "@/components/YearHeader.vue";
import MyTable from "@/components/MyTable.vue";
import { getWorldYearData } from "../China/util";
import { sortByZhKey } from "../../utils/util";

const layout = [
  { title: "排名", key: "index", sort: true },
  {
    title: "名次",
    key: "compare_index",
    sort: true,
    sortFormatter: v => v.replace(/ \((.+?)\)/, "")
  },
  { title: "简称", key: "simpleName" }, // 简称
  { title: "名称", key: "name" },
  {
    title: "行业",
    key: "industry",
    sort: true,
    sortFn: sortByZhKey("industry")
  },
  {
    title: "国家",
    key: "country",
    sort: true,
    sortFn: sortByZhKey("country")
  },
  {
    title: "营收",
    key: "revenue",
    sort: true,
    sortFormatter: v => v.replace(",", "")
  },
  {
    title: "净利润",
    key: "profit",
    sort: true,
    sortFormatter: v => v.replace(",", "")
  },
  {
    title: "利润率",
    key: "profitMargin",
    sort: true,
    sortFormatter: v => v.replace("%", "")
  }
];
function getLayout(targets = []) {
  return targets.map(key => {
    return layout.find(i => i.key === key);
  });
}
const enumTypes = {
  country: "1",
  industry: "2",
  index: "3"
};

export default {
  name: "WorldPage",
  components: {
    VanRadioGroup,
    VanRadio,
    VanList,
    VanCheckbox,
    VanCheckboxGroup,
    YearHeader,
    MyTable
  },
  data() {
    // console.log("this.$route.query", this.$route.query);
    const { type = enumTypes.country, isAll = "0" } = this.$route.query;
    return {
      enumTypes,
      currentYear: new Date().getFullYear(),
      supportList: [2020, 2021, 2022, 2023],
      form: {
        layout: ["index", "simpleName", "industry"],
        type, // enumTypes
        isAll, //  0 精简 1 完整
        compare: "0" // 0 正常 1 和去年对比
      },
      showConfig: [...layout]
    };
  },
  computed: {
    currentData() {
      const data = getWorldYearData(this.currentYear) || [];
      data.forEach(i => {
        i.simpleName = i.name.replace(
          /(集团)?(有限公司|股份有限公司|控股有限公司|有限责任公司|总公司|公司|集团)$/,
          ""
        );
        let { revenue = 0, profit = 0 } = i;
        if (revenue && profit) {
          revenue = revenue.replace(/,/g, "");
          profit = profit.replace(/,/g, "");
          i.profitMargin = ((profit / revenue) * 100).toFixed(2) + "%";
        }
        return i;
      });
      return data;
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

      //   console.log("countryData", data);

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
    },
    genConfig() {
      let res = [];
      const { type, compare } = this.form;

      const indexKey = compare === "0" ? "index" : "compare_index";
      const isAll = this.form.isAll === "0";

      switch (type) {
        case enumTypes.country: {
          res = isAll
            ? [indexKey, "simpleName", "industry"]
            : [
                indexKey,
                "simpleName",
                "industry",
                "revenue",
                "profit",
                "profitMargin"
              ];
          break;
        }
        case enumTypes.industry:
        case enumTypes.index: {
          res = isAll
            ? [indexKey, "country", "simpleName"]
            : [
                indexKey,
                "simpleName",
                "country",
                "revenue",
                "profit",
                "profitMargin"
              ];
          break;
        }
      }

      // if (this.currentYear === 2023) {
      //   // 2023 暂时没有利润 利润率
      //   res = res.filter(i => !["profit", "profitMargin"].includes(i));
      // }

      return res;
    },
    configs() {
      return getLayout(this.form.layout);
    }
  },
  watch: {
    genConfig(val) {
      this.form.layout = val;
    },
    currentYear: {
      immediate: true,
      handler() {
        this.form.compare = "0";
      }
    },
    // 对比功能
    "form.compare"(val) {
      // const compare_keys = ["index"];
      if (val === "1") {
        const previousYear = this.currentYear - 1;
        const previousData = getWorldYearData(previousYear);

        this.currentData.forEach(item => {
          if (typeof item.compare_index === "undefined") {
            const target = previousData.find(j => j.name === item.name);
            let text;
            if (target) {
              const compareNumber = target.index - item.index;
              text =
                compareNumber === 0
                  ? "-0"
                  : compareNumber > 0
                  ? `↑${compareNumber}`
                  : `↓${Math.abs(compareNumber)}`;
            } else {
              text = "新";
            }
            item.compare_index = `${item.index} (${text})`;
          }
        });
        // console.log("this.currentData", this.currentData);
      }
    }
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
.navList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  > span {
    display: inline-block;
    margin: 0 8px;
  }
}
</style>
