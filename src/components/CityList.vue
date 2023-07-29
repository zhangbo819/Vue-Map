<template>
  <div v-if="provinceData">
    <p>{{ provinceData.name }} {{ provinceData.count }}</p>
    <div v-for="province in provinceData.children" :key="province.name">
      <p>{{ province.name }} {{ province.count }}</p>
      <div v-for="city in province.children" :key="city.name">
        <span>第{{ city.index }}名 {{ city.name }} {{ city.count }}</span>
        <span v-if="isDetails">{{ city.address }}</span>
        <span>{{ city.revenue }}</span>
      </div>
    </div>
  </div>
  <div v-else>
    暂无数据
  </div>
</template>

<script>
export default {
  name: "CityList",

  props: {
    provinceData: {
      type: Object,
      default: () => ({
        name: "",
        count: 0,
        children: []
      })
    },
    isDetails: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  watch: {
    provinceData(val) {
      console.log('val', val)
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style lang="scss" scoped></style>
