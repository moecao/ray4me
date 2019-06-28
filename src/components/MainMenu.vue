<template>
  <nav>
    <ul id="menu-list">
      <li :key="menu.id" v-for="menu in menus">
        <router-link :to="menu.route">
          <font-awesome-icon :icon="menu.icon"/>
          <span class="menu-text">{{ menu.text }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTachometerAlt,
  faLeaf,
  faPaperPlane,
  faTools,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTachometerAlt);
library.add(faLeaf);
library.add(faPaperPlane);
library.add(faTools);
library.add(faInfoCircle);

Vue.component('font-awesome-icon', FontAwesomeIcon);

export default Vue.extend({
  data: () => ({
    menus: [
      { id: 1, text: 'Dashboard', icon: 'tachometer-alt', route: '/' },
      { id: 2, text: 'V2Ray', icon: 'leaf', route: '/v2ray' },
      {
        id: 3,
        text: 'Shadowsocks',
        icon: 'paper-plane',
        route: '/shadowsocks',
      },
      { id: 4, text: 'Preference', icon: 'tools', route: '/preference' },
      { id: 5, text: 'About', icon: 'info-circle', route: '/about' },
    ],
  }),
});
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  padding: 0;
  li {
    padding: 10px;
    text-align: left;
    a {
      font-size: 18px;
      text-decoration-line: none;
      color: #fff;
      .menu-text {
        padding: 7px;
      }
    }
  }
}
</style>