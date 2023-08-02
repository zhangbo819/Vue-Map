<template>
  <header class="yearList">
    <p
      v-for="year in yearList"
      :key="year"
      :class="{ active: year === currentYear }"
      @click="handerYear(year)"
    >
      {{ year === new Date().getFullYear() ? year + "(未完)" : year }}
    </p>
  </header>
</template>

<script>
export default {
  name: "YearHeader",

  props: {
    value: {
      type: Number,
      default: new Date().getFullYear()
    },
    yearList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      //   yearList: [2021, 2022, 2023],
      currentYear: this.value
    };
  },

  methods: {
    handerYear(year) {
      this.currentYear = year;
      this.$emit("input", year);
    }
  }
};
</script>

<style lang="scss" scoped>
.yearList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    cursor: pointer;
    font-size: 18px;

    &.active {
      text-decoration-line: underline;
      color: #f008;
    }

    & + p {
      margin-left: 16px;
    }
  }
}
</style>
