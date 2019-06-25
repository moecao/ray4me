<template>
  <div id="app">
    <div id="container">
      <div id="nav">
        <img id="logo" alt="Traffic logo" src="./assets/logo.png">
        <div id="logo-text">Traffic</div>
        <MainMenu/>
      </div>
      <div id="content">
        <header id="top-frame">
          <h3>Traffic</h3>
        </header>
        <router-view class="content"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainMenu from "@/components/MainMenu.vue"; // @ is an alias to /src

@Component({
  components: {
    MainMenu
  }
})
export default class App extends Vue {}
</script>


<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  #container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    #nav {
      -webkit-app-region: drag;
      /* 无Frame的窗口，可拖动的位置 */
      -webkit-user-select: none;
      /* 文字不可选 */
      width: 180px;
      background-color: #3F51B5;
      padding: 30px;
      text-align: center;
      #logo {
        width: 100px;
        height: 100px;
      }
      #logo-text {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 30px;
      }
    }
    #content {
      flex: 1;
      position: relative;
      #top-frame {
        height: 40px;
        line-height: 40px;
        -webkit-app-region: drag;
        /* 无Frame的窗口，可拖动的位置 */
        -webkit-user-select: none;
        /* 文字不可选 */
        position: fixed;
        top: 0;
        left: 240px;
        right: 0;
        // background-color: rgba($color: #c0c0c0, $alpha: 0.5);
        background-color: #FFF;
        border: 1px solid rgba($color: #c0c0c0, $alpha: .3);
      }
      .content {
        margin-top: 40px;
      }
    }
  }
}
h3 {
  margin: 0;
  padding: 0;
}

button {
  -webkit-app-region: no-drag;
  /* button不能拖动，不然就不可以点击了 */
}
</style>
