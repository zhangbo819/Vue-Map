<template>
  <div id="app">
    <router-view />
    <van-tabbar route placeholder>
      <van-tabbar-item to="/astrology" icon="home-o">占星</van-tabbar-item>
      <!-- <van-tabbar-item to="/world" icon="search">标签</van-tabbar-item> -->
      <van-tabbar-item to="/china" icon="balance-list-o">500强</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
// console.log('app in');
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
  padding: 8px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
