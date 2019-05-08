import wwObject from './wwObjectVideo.vue'

const name = "__NAME__";
const version = '__VERSION__';

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.register({
            content: {
                type: name,
                data: {
                    provider: "youtube",
                    id: "o_Lj93pjK1U",
                    loop: false,
                    controls: true,
                    muted: false,
                    autoplay: false,
                    showinfo: true,
                    preview: "",
                    alt: {
                        "fr": "Une vidéo"
                    },
                    videoRatio: 16 / 9
                }
            },
            upsales: {
                wwAnalytics: {
                    click: false
                }
            },
            /* wwManager:start */
            cmsOptions: {
                wwObjectHover: {
                    pluses: false,
                },
                wwObjectMenu: {
                    items: [
                        {
                            name: 'OPTIONS',
                            text: {
                                en: 'Options',
                                fr: 'Options'
                            },
                            icon: 'wwi wwi-edit-other',
                            action: 'edit'
                        }
                    ]
                }
            }
            /* wwManager:end */
        });

        window.vm.addComponent({
            name: name,
            version: version,
            content: wwObject
        });

        return true;
    }
    return false;
}

if (!addComponent()) {
    const iniInterval = setInterval(function () {
        if (addComponent()) {
            clearInterval(iniInterval);
        }
    }, 10);
}