<template>
  <div id="app">
    <nav>
      <!-- <router-link to="/">Home</router-link> | -->
      <router-link to="/">中国</router-link> |
      <router-link to="/world">世界</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
console.log("app in");
export default {
  mounted() {
    console.log('app mounted', this.$route)
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
