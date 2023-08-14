<template>
  <table class="table">
    <thead class="thead">
      <tr>
        <th
          v-for="i in showConfig"
          :key="i.title"
          @click="handleTitle(i, i.key)"
          :class="{ sortTh: i.sort }"
        >
          {{ i.title }}
          <template v-if="i.sort">
            <template v-if="activeKey === i.key">
              <van-icon v-if="isSortUp" name="arrow-up" class="sortIcon" />
              <van-icon v-else name="arrow-down" class="sortIcon" />
            </template>
            <van-icon v-else name="minus" class="sortIcon" />
          </template>
        </th>
      </tr>
    </thead>
    <tbody class="tbody">
      <tr v-for="item in sortData" :key="'simple' + item.name">
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
import { Icon as VanIcon } from "vant";

export default {
  name: "MyTable",
  components: { VanIcon },
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
    },
    sortData() {
      if (this.activeKey === null) return this.data;
      
      const targetConfigItem = this.config.find(i => i.key === this.activeKey);
      if (!targetConfigItem) return this.data
      
      const { sortFn = null, sortFormatter = v => v } = targetConfigItem;

      console.log("sortFormatter", sortFormatter);

      const newData = this.data.map(i => i);

      newData.sort((a, b) =>
        sortFn
          ? sortFn(a, b, this.isSortUp)
          : this.isSortUp
          ? sortFormatter(a[this.activeKey]) - sortFormatter(b[this.activeKey])
          : sortFormatter(b[this.activeKey]) - sortFormatter(a[this.activeKey])
      );

      console.log("newData", newData);

      return newData;
    }
  },
  data() {
    return {
      activeKey: null,
      isSortUp: true
    };
  },
  methods: {
    handleTitle(i, key) {
      if (!i.sort) return
      // console.log("key", key);
      if (this.activeKey !== key) {
        this.activeKey = key;
        this.isSortUp = true;
      } else if (this.isSortUp) {
        this.isSortUp = !this.isSortUp;
      } else {
        this.activeKey = null;
      }

      console.log("activeKey", this.activeKey);
      console.log("isSortUp", this.isSortUp);
    }
  }
};
</script>

<style lang="scss" scoped>
.simpleTable {
  margin: 0 auto;
}
.table {
  border-spacing: 8px;
  // border-collapse: collapse;
}
.thead {
  white-space: nowrap;

  .sortTh {
    cursor: pointer;
  }
  .sortIcon {
    font-size: 12px;
    transform: scale(0.8);
  }
}
.tbody tr {
  // margin: 8px 0;
  vertical-align: top;
}
.up {
  color: #ee0a23;
}

.down {
  color: #3bc160;
}
</style>
