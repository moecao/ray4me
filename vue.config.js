module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                appId: "iteck.cc.ray4me",
                mac: {
                    // target: "dmg",
                    icon: "public/assets/icon.icns",
                    gatekeeperAssess: false,
                    extendInfo: {
                        LSUIElement: 1
                    }
                },
                // asar: false,
                extraResources: [
                    "public/assets/*/**"
                ],
                copyright: "Copyright © 2019 ${author}"
            }
        }
    }
}
