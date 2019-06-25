import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    }, {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }, {
      path: '/v2ray',
      name: 'v2ray',
      component: () => import('./views/V2Ray.vue'),
    }, {
      path: '/shadowsocks',
      name: 'shadowsocks',
      component: () => import('./views/Shadowsocks.vue'),
    },{
      path: '/preference',
      name: 'preference',
      component: () => import('./views/Preference.vue'),
    },
  ],
});
