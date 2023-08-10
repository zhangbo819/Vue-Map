<template>
  <table>
    <tr>
      <td v-for="i in showConfig" :key="i.title">
        {{ i.title }}
      </td>
    </tr>
    <tr v-for="item in data" :key="'simple' + item.name">
      <td v-for="j in showConfig" :key="j.key + item[j.key]" v-if="item[j.key]">
        <span
          v-if="j.key === 'compare_index'"
          :class="{
            up: item[j.key].includes('↑') || item[j.key].endsWith('(新)'),
            down: item[j.key].includes('↓')
          }"
        >
          {{ item[j.key] }}
        </span>
        <span v-else>
          {{ item[j.key] || "-" }}
        </span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "MyTable",
  props: {
    config: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showConfig () {
      return this.config.filter(i => !i.hidden)
    }
  }
  // data() {
  //   return {};
  // },
  // methods: {}
};
</script>

<style lang="scss" scoped>
.simpleTable {
  margin: 0 auto;
}
.up {
  color: #3bc160;
}

.down {
  color: #ee0a23;

}
</style>
