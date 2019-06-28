<template>
  <div class="home">
    <Form :label-width="80">
      <FormItem label="V2Ray">
        <i-switch
          v-model="v2raySwitch"
          :loading="v2rayLoading"
          size="large"
          @on-change="v2raySwitchChange"
        >
          <span slot="open">ON</span>
          <span slot="close">OFF</span>
        </i-switch>
      </FormItem>
      <FormItem label="Shadowsocks">
        <i-switch v-model="ssSwitch" :loading="ssLoading" size="large" @on-change="ssSwitchChange">
          <span slot="open">ON</span>
          <span slot="close">OFF</span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Global from '@/Global.vue';
import { ipcRenderer, Event, app } from 'electron';
import { stat } from 'fs';

export default Vue.extend({
  data() {
    return {
      v2raySwitch: Global.v2rayState === 'start' ? true : false,
      ssSwitch: false,
      v2rayLoading: false,
      ssLoading: false,
    };
  },
  methods: {
    v2raySwitchChange(status: boolean) {
      this.v2rayLoading = true;
      ipcRenderer.send('v2ray-state', status ? 'start' : 'stop');
    },
    ssSwitchChange(status: boolean) {},
  },
  mounted() {
    ipcRenderer.on('v2ray-state-response', (event: Event, args: any) => {
      this.v2raySwitch = args === 'done' ? true : false;
      this.v2rayLoading = false;
      Global.v2rayState = args === 'done' ? 'start' : 'stop';

    });
  },
});
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 30px;
  height: 100%;
}
</style>
