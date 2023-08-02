<template>
  <div v-if="provinceData">
    <p>{{ provinceData.name }} {{ provinceData.count }}</p>
    <div v-for="province in provinceData.children" :key="province.name">
      <p>{{ province.name || "未知" }} {{ province.count }}</p>
      <!-- <div v-for="city in province.children" :key="city.name">
        <span>第{{ city.index }}名 {{ city.name }} {{ city.count }}</span>
        <span v-if="isDetails">{{ city.address }}</span>
        <span>{{ city.revenue }}</span>
      </div> -->
      <MyTable class="simpleTable" :config="config" :data="province.children" />
    </div>
  </div>
  <div v-else>暂无数据</div>
</template>

<script>
import MyTable from "@/components/MyTable.vue";

export default {
  name: "CityList",

  components: { MyTable },

  props: {
    provinceData: {
      type: Object,
      default: () => ({
        name: "",
        count: 0,
        children: [],
      }),
    },
    isDetails: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      config: [
        { title: "排名", key: "index" },
        { title: "名称", key: "name" },
        this.isDetails && { title: "地址", key: "address" },
        { title: "营收", key: "revenue" },
      ].filter((i) => i),
    };
  },

  watch: {
    provinceData(val) {
      console.log("val", val);
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
