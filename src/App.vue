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
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import Global from '@/Global.vue';
import MainMenu from '@/components/MainMenu.vue'; // @ is an alias to /src
import GlobalVue from '@/Global.vue';

export default Vue.extend({
  components: {
    MainMenu,
  },
  mounted() {
    ipcRenderer.on('v2ray-state', (event: Event, args: any) => {
      console.log(args)
      Global.v2rayState = args
    });
    ipcRenderer.on('v2ray-config-path', (event: Event, args: any) => {
      console.log(args);
      Global.v2rayConfigPath = args;
    });
  },
});
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
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 16px;
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
      width: 250px;
      background-color: #3f51b5;
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
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      #top-frame {
        width: 100%;
        height: 40px;
        line-height: 40px;
        -webkit-app-region: drag;
        /* 无Frame的窗口，可拖动的位置 */
        -webkit-user-select: none;
        /* 文字不可选 */
        // position: fixed;
        // top: 0;
        // left: 250px;
        // right: 0;
        // background-color: rgba($color: #c0c0c0, $alpha: 0.5);
        background-color: #fff;
        border: 1px solid rgba($color: #c0c0c0, $alpha: 0.3);
      }
      .content {
        flex: 1;
        // margin-top: 40px;
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
