<template>
  <table class="table">
    <thead class="thead">
      <tr>
        <th v-for="i in showConfig" :key="i.title">
          {{ i.title }}
        </th>
      </tr>
    </thead>
    <tbody class="tbody">
      <tr v-for="item in data" :key="'simple' + item.name">
        <td
          v-for="j in showConfig"
          :key="j.key + item[j.key]"
          v-if="item[j.key]"
        >
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
    </tbody>
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
    showConfig() {
      return this.config.filter(i => !i.hidden);
    }
  }
  // data() {
  //   return {};
  // },
  // methods: {}
};
</script>

<style lang="scss" scoped>


.table {
  border-spacing: 8px;
  // border-collapse: collapse;

}
.thead {
  white-space: nowrap;
}
.tbody tr {
  // margin: 8px 0;
  vertical-align: top;
}
.up {
  color: #3bc160;
}

.down {
  color: #ee0a23;
}
</style>
