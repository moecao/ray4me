<template>
  <Form id="from-container" :model="rayConfig" :label-width="80">
    <FormItem label="Address">
      <Input v-model="rayConfig.address" placeholder="Enter the server address"/>
    </FormItem>
    <FormItem label="Port">
      <Input v-model="rayConfig.port" placeholder="Enter the server port"/>
    </FormItem>
    <FormItem label="UserID">
      <Input v-model="rayConfig.userId" placeholder="Enter v2ray user ID"/>
    </FormItem>
    <FormItem label="AlterID">
      <Input v-model="rayConfig.alterId" placeholder="Enter v2ray alter ID"/>
    </FormItem>
    <FormItem label="Level">
      <Input v-model="rayConfig.level" placeholder="Enter v2ray level"/>
    </FormItem>
    <FormItem label="Security">
      <Select v-model="rayConfig.security">
        <Option value="auto">auto</Option>
        <Option value="aes-128-gcm">aes-128-gcm</Option>
        <Option value="chacha20-poly1305">chacha20-poly1305</Option>
        <Option value="none">none</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit()">Submit</Button>
      <Button @click="handleReset()" style="margin-left: 8px">Reset</Button>
    </FormItem>
  </Form>
</template>

<script lang="ts">
import fs from "fs";
import path from "path";
import { ipcRenderer, Event, app } from "electron";
import Vue from "vue";
import Global from "@/Global.vue";
import { config } from "@fortawesome/fontawesome-svg-core";

// tslint:disable-next-line: variable-name
const __static = "public";

interface RayOutboundSettingVnextUser {
  id: string;
  alterId: number;
  level: number;
  security: string;
}
interface RayOutboundSettingVnext {
  address: string;
  port: number;
  users: Array<RayOutboundSettingVnextUser>;
}
interface RayOutboundSetting {
  vnext: Array<RayOutboundSettingVnext>;
}
interface RayConfig {
  outbounds: Array<RayOutboundSetting>;
}

export default Vue.extend({
  data() {
    return {
      v2rayConfigPath: Global.v2rayConfigPath,
      originConfig: {
        inbounds: [
          {
            port: 1080,
            listen: "127.0.0.1",
            protocol: "socks",
            settings: {
              udp: true
            }
          },
          {
            port: 1087,
            listen: "127.0.0.1",
            protocol: "http",
            settings: {
              timeout: 0
            }
          }
        ],
        outbounds: [
          {
            sendThrough: "0.0.0.0",
            mux: {
              enabled: false,
              concurrency: 8
            },
            protocol: "vmess",
            settings: {
              vnext: [
                {
                  address: "23.106.141.238",
                  users: [
                    {
                      id: "4eb0ea4f-9e98-337e-7ff3-6fcc7024d16e",
                      alterId: 100,
                      security: "auto",
                      level: 1
                    }
                  ],
                  port: 10443
                }
              ]
            },
            tag: "US-V2Ray",
            streamSettings: {
              wsSettings: {
                path: "",
                headers: {}
              },
              quicSettings: {
                key: "",
                header: {
                  type: "none"
                },
                security: "none"
              },
              tlsSettings: {
                allowInsecure: false,
                alpn: ["http/1.1"],
                serverName: "23.106.141.238",
                allowInsecureCiphers: false
              },
              httpSettings: {
                path: ""
              },
              kcpSettings: {
                header: {
                  type: "none"
                },
                mtu: 1350,
                congestion: false,
                tti: 20,
                uplinkCapacity: 5,
                writeBufferSize: 1,
                readBufferSize: 1,
                downlinkCapacity: 20
              },
              tcpSettings: {
                header: {
                  type: "none"
                }
              },
              security: "none",
              network: "kcp"
            }
          },
          {
            protocol: "freedom",
            settings: {},
            tag: "direct"
          }
        ],
        routing: {
          domainStrategy: "IPOnDemand",
          rules: [
            {
              type: "field",
              outboundTag: "direct",
              domain: ["geosite:cn", "music.126.net", "126.net"]
            },
            {
              type: "field",
              outboundTag: "direct",
              ip: ["geoip:cn", "geoip:private"]
            }
          ]
        }
      },
      rayConfig: {
        address: "",
        port: "",
        userId: "",
        alterId: "",
        level: "",
        security: ""
      }
    };
  },
  methods: {
    loadV2rayConfig() {
      console.log(Global.v2rayConfigPath);
      fs.readFile(
        Global.v2rayConfigPath,
        { encoding: "UTF-8" },
        (err, data: string) => {
          if (err) {
            throw err;
          }
          console.log(data);
          const configJson = JSON.parse(data);
          this.originConfig = configJson;
          const outbounds = configJson.outbounds[0];
          const settings = outbounds.settings;
          const vnexts = settings.vnext;
          const vnext = vnexts[0];
          const user = vnext.users[0];

          this.rayConfig.address = vnext.address;
          this.rayConfig.port = vnext.port;
          this.rayConfig.userId = user.id;
          this.rayConfig.alterId = user.alterId;
          this.rayConfig.level = user.level;
          this.rayConfig.security = user.security;
          console.log(configJson);
        }
      );
    },
    handleSubmit() {
      this.originConfig.outbounds[0].settings.vnext![0].address = this.rayConfig.address;
      this.originConfig.outbounds[0].settings.vnext![0].port = Number(
        this.rayConfig.port
      );
      this.originConfig.outbounds[0].settings.vnext![0].users[0].id = this.rayConfig.userId;
      this.originConfig.outbounds[0].settings.vnext![0].users[0].alterId = Number(
        this.rayConfig.alterId
      );
      this.originConfig.outbounds[0].settings.vnext![0].users[0].level = Number(
        this.rayConfig.level
      );
      this.originConfig.outbounds[0].settings.vnext![0].users[0].security = this.rayConfig.security;
      const jsonString = JSON.stringify(this.originConfig);
      fs.writeFile(Global.v2rayConfigPath, jsonString, err => {
        if (err) {
          throw err;
        }
        console.log("save config success!");
        ipcRenderer.send("ray-state", "restart");
      });
    },
    handleReset() {}
  },
  created() {},

  mounted() {
    this.loadV2rayConfig();
  }
});
</script>

<style lang="scss" scoped>
#from-container {
  padding: 30px;
}
</style>
