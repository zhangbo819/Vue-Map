<template>
  <table>
    <tr>
      <td v-for="i in config" :key="i.title">{{ i.title }}</td>
    </tr>
    <tr v-for="item in data" :key="'simple' + item.name">
      <td v-for="j in config" :key="j.key + item[j.key]">
        {{ item[j.key] || "-" }}
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
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.simpleTable {
  margin: 0 auto;
}
</style>
