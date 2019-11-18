<template>
    <div class="ww-video" v-bind:class="{'ww-video-loaded' : videoLoaded}">
        <!-- wwManager:start -->
        <wwOrangeButton class="ww-orange-button" v-if="wwObjectCtrl.getSectionCtrl().getEditMode()"></wwOrangeButton>
        <!-- wwManager:end -->
        <div class="ww-video-container">
            <!-- PREVIEW -->
            <div v-if="wwAttrs.wwCategory == 'background'" class="ww-video-preview" v-bind:class="{'ww-video-loaded' : videoLoaded}" v-bind:style="{'background-image' : 'url(' + wwObject.content.data.preview + ')'}"></div>

            <!-- LOCAL -->
            <video v-if="wwObject.content.data.provider == 'local' && wwAttrs.wwCategory == 'background'" class="ww-video-element ww-local-video ww-video-bg" autoplay="true" loop="true" preload="metadata" playsinline>
                <source v-bind:src="wwObject.content.data.id +  '#t=0.1'" type="video/mp4" />
            </video>

            <video v-if="wwObject.content.data.provider == 'local' && wwAttrs.wwCategory != 'background'" class="ww-video-element ww-local-video" controlslist="nodownload" preload="metadata" playsinline v-bind:loop="wwObject.content.data.loop" v-bind:autoplay="wwObject.content.data.autoplay" v-bind:muted="wwObject.content.data.muted" v-bind:controls="wwObject.content.data.controls">
                <source v-bind:src="wwObject.content.data.id +  '#t=0.1'" type="video/mp4" />
            </video>

            <!-- YOUTUBE -->
            <iframe v-if="wwObject.content.data.provider == 'youtube' && wwAttrs.wwCategory == 'background'" class="ww-video-element ww-video-bg" v-bind:src="'//www.youtube.com/embed/' + wwObject.content.data.id + '?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1&playlist=' + wwObject.content.data.id " frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <iframe v-if="wwObject.content.data.provider == 'youtube' && wwAttrs.wwCategory != 'background'" class="ww-video-element" v-bind:src="'//www.youtube.com/embed/' + wwObject.content.data.id + '?rel=0' + 
			(wwObject.content.data.loop ? '&loop=1&playlist=' + wwObject.content.data.id : '') + 
			(wwObject.content.data.autoplay ? '&autoplay=1' : '') + 
			(wwObject.content.data.muted ? '' : '') + 
			(!wwObject.content.data.controls ? '&controls=0' : '') + 
			(!wwObject.content.data.showinfo ? '&showinfo=0' : '')" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <!-- VIMEO -->
            <iframe v-if="wwObject.content.data.provider == 'vimeo' && wwAttrs.wwCategory == 'background'" class="ww-video-element ww-video-bg" v-bind:src="'//player.vimeo.com/video/' + wwObject.content.data.id + '?autoplay=1&loop=1&background=1' " frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <iframe v-if="wwObject.content.data.provider == 'vimeo' && wwAttrs.wwCategory != 'background'" class="ww-video-element" v-bind:src="'//player.vimeo.com/video/' + wwObject.content.data.id + '?a=0' + 
			(wwObject.content.data.loop ? '&loop=1' : '') + 
			(wwObject.content.data.autoplay ? '&autoplay=1' : '') + 
			(wwObject.content.data.muted ? '&mute=1' : '') + 
			(!wwObject.content.data.controls ? '&controls=0' : '')" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <!-- DAILYMOTION -->
            <iframe v-if="wwObject.content.data.provider == 'dailymotion' && wwAttrs.wwCategory == 'background'" class="ww-video-element ww-video-bg" v-bind:src="'//www.dailymotion.com/embed/video/' + wwObject.content.data.id + '?autoplay=1&mute=1' " frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <iframe v-if="wwObject.content.data.provider == 'dailymotion' && wwAttrs.wwCategory != 'background'" class="ww-video-element" v-bind:src="'//www.dailymotion.com/embed/video/' + wwObject.content.data.id" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <!-- TWITCH -->
            <iframe v-if="wwObject.content.data.provider == 'twitch' && wwAttrs.wwCategory == 'background'" class="ww-video-element ww-video-bg" v-bind:src="'//player.twitch.tv/?channel=' + wwObject.content.data.id + '?autoplay=1&muted=1' " frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

            <iframe v-if="wwObject.content.data.provider == 'twitch' && wwAttrs.wwCategory != 'background'" class="ww-video-element" v-bind:src="'//player.twitch.tv/?channel=' + wwObject.content.data.id" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        </div>
    </div>
</template>
 

<script>			
import Vue from 'vue';

export default {
    name: "__COMPONENT_NAME__",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            videoLoaded: false
        }
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        }
    },
    watch: {
    },
    methods: {
        init() {
            //window.addEventListener('resize', this.wwOnResize);

            this.wwLoadVideo();
        },
        wwCheckRatio() {

            //If ratio is fixed in ww-object directive, override it here
            if (this.wwAttrs.wwFixedRatio) {
                try {
                    var ratio = parseFloat(this.wwAttrs.wwFixedRatio);
                    if (ratio) {
                        return ratio;
                    }
                }
                catch (error) {
                    console.log("wwRatio error", error);
                }
            }

            if (!this.wwObject.ratio || this.wwObject.ratio < 0) {
                if (this.wwAttrs.wwDefaultRatio) {
                    return this.wwAttrs.wwDefaultRatio;
                }
                else {
                    return 100 / 3 * 2;
                }
            }

            return this.wwObject.ratio;
        },
        wwApplyVideoRatio() {

            if (this.wwAttrs.wwCategory != "background") {

                var ratio = this.wwCheckRatio();
                this.$el.style.paddingBottom = ratio + "%";
            }

            this.videoLoaded = true;
        },
        wwAppendPreview() {
            var wwPreviewHTML = "<div class='ww-video-preview' style='background-image:url(" + this.wwObject.content.data.preview + ")'></div>";

            wwVideoContainer.append(wwPreviewHTML);
        },
        wwLoadVideo: async function () {

            try {
                let wwVideoData = this.wwObject.content.data;

                if (wwVideoData.provider == "local") {
                    const wwVideoHTML = document.createElement("video");
                    wwVideoHTML.appendChild(document.createElement('source', { src: this.wwObject.content.data.id + '#t=0.1', type: 'video/mp4' }));

                    var self = this;

                    await wwVideoHTML.addEventListener("loadedmetadata", function (e) {

                        self.wwObject.content.data.videoRatio = this.videoWidth / this.videoHeight;

                        self.wwApplyVideoRatio();

                        return;
                    }, false);


                    return;


                }
                //EXT VIDEO
                else {

                    if (this.wwAttrs.wwCategory == "background") {

                        previewAndRatio = await wwGetVideoPreviewAndRatio(wwVideoData.provider, wwVideoData.id, wwVideoData.preview);
                        if (previewAndRatio) {
                            this.wwObject.content.data.videoRatio = previewAndRatio.ratio;
                        }
                    }

                    this.wwApplyVideoRatio();
                    return;
                }
            }
            catch (e) {

            }

        },
        wwGetVideoPreviewAndRatio: async function (provider, videoId, videoPreview) {

            let noImage = videoPreview || "https://cdn.wewebapp.io/public/images/no_image_selected.png";

            let responce = null;

            try {
                switch (provider) {
                    case "youtube":
                        var previewAndRatio = {
                            preview: videoPreview || '//img.youtube.com/vi/' + videoId + '/maxresdefault.jpg',
                            ratio: 1920 / 1080
                        }
                        return previewAndRatio;
                        break;
                    case "dailymotion":

                        responce = await axios.get('https://api.dailymotion.com/video/' + videoId + '?fields=thumbnail_1080_url,height,width');

                        if (!responce) {
                            return {
                                preview: noImage,
                                ratio: 1920 / 1080
                            }
                        }

                        var previewAndRatio = {
                            preview: noImage,
                            ratio: 1920 / 1080
                        }

                        if (responce.data.thumbnail_1080_url) {
                            previewAndRatio.preview = videoPreview || responce.data.thumbnail_1080_url
                        }

                        if (responce.data.width && responce.data.height) {
                            previewAndRatio.ratio = responce.data.width / responce.data.height;
                        }

                        return previewAndRatio;


                        break;
                    case "vimeo":

                        responce = await axios.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + videoId);

                        if (!responce) {
                            return {
                                preview: noImage,
                                ratio: 1920 / 1080
                            }
                        }

                        var previewAndRatio = {
                            preview: noImage,
                            ratio: 1920 / 1080
                        }

                        if (responce.data.thumbnail_url) {

                            var thumb = responce.data.thumbnail_url;
                            var reg = /i.vimeocdn.com\/video\/([^_]*)_/;
                            var matches = thumb.match(reg);
                            if (matches.length == 2) {
                                previewAndRatio.preview = videoPreview || "//i.vimeocdn.com/video/" + matches[1] + "_1920x1080.jpg";
                            }
                        }

                        if (responce.data.width && responce.data.height) {
                            previewAndRatio.ratio = responce.data.width / responce.data.height;
                        }

                        return previewAndRatio;

                        break;
                    default:
                        return {
                            preview: noImage,
                            ratio: 1920 / 1080
                        };
                }
            } catch (e) {
                return {
                    preview: noImage,
                    ratio: 1920 / 1080
                };
            }
        },
        getInfoFromUrl(url) {
            const info = {};
            if (url.indexOf('youtube.com') != -1) {
                info.provider = 'youtube';
                const temp = url.split('v=')[1];
                info.id = temp.split('?')[0];
            } else if (url.indexOf('youtu.be') != -1) {
                info.provider = 'youtube';
                const temp = url.split('be/');
                console.log('TEMP', temp)
                info.id = temp[1].split('?')[0];
            } else if (url.indexOf('vimeo.com') != -1) {
                info.provider = 'vimeo';
                const temp = url.split('m/')[1];
                info.id = temp.split('?')[0];
            } else if (url.indexOf('dailymotion.com') != -1) {
                info.provider = 'dailymotion';
                const temp = url.split('video/')[1];
                info.id = temp.split('?')[0];
            } else if (url.indexOf('twitch.tv') != -1) {
                info.provider = 'twitch';
                const temp = url.split('tv/')[1];
                info.id = temp.split('?')[0];
            }
            console.log('INFO ', info)
            return info;
        },
        /*=============================================m_ÔÔ_m=============================================\
          EDIT VIDEO
        \================================================================================================*/
        async edit() {
            wwLib.wwObjectHover.setLock(this);

            wwLib.wwPopups.addStory('WWVIDEO_EDIT', {
                title: {
                    en: 'Edit video',
                    fr: 'Editer la vidéo'
                },
                type: 'wwPopupList',
                buttons: null,
                storyData: {
                    list: {
                        WWVIDEO_URL: {
                            separator: {
                                en: 'Style',
                                fr: 'Style'
                            },
                            title: {
                                en: 'URL',
                                fr: 'URL'
                            },
                            desc: {
                                en: 'Edit video source',
                                fr: 'Éditer la source de la vidéo'
                            },
                            icon: 'wwi wwi-edit-planet',
                            shortcut: 's',
                            next: 'WWVIDEO_URL'
                        },
                        EDIT_STILE: {
                            separator: {
                                en: 'Style',
                                fr: 'Style'
                            },
                            title: {
                                en: 'Change slider style',
                                fr: 'Changer l\'apparence du slider'
                            },
                            desc: {
                                en: 'Borders, shadow, ...',
                                fr: 'Bordures, ombres, ...'
                            },
                            icon: 'wwi wwi-edit-style',
                            shortcut: 's',
                            next: 'WWVIDEO_STYLE'
                        },
                        EDIT_RATIO: {
                            title: {
                                en: 'Change slider ratio',
                                fr: 'Changer le ratio du slider'
                            },
                            desc: {
                                en: 'Portrait, square, landscape, ...',
                                fr: 'Portrait, carré, paysage, ...'
                            },
                            icon: 'wwi wwi-ratio',
                            shortcut: 'r',
                            next: 'WWVIDEO_RATIO'
                        },
                        EDIT_ANIM: {
                            separator: {
                                en: 'Interaction',
                                fr: 'Interaction'
                            },
                            title: {
                                en: 'Animation',
                                fr: 'Animation'
                            },
                            desc: {
                                en: 'Change animation',
                                fr: 'Choisir l\'animation à l\'apparition de l\'image'
                            },
                            icon: 'wwi wwi-anim',
                            shortcut: 'a',
                            next: 'ANIMATION'
                        },
                        EDIT_CHANGE: {
                            title: {
                                en: 'Change object type',
                                fr: 'Changer le type d\'objet'
                            },
                            icon: 'wwi wwi-switch',
                            shortcut: 't',
                            next: 'SELECT_WWOBJECT'
                        },
                    }
                }
            })
            wwLib.wwPopups.addStory('WWVIDEO_RATIO', {
                title: {
                    en: 'Slider Ratio',
                    fr: 'Ratio du slider'
                },
                type: 'wwPopupImageRatio',
                buttons: {
                    NEXT: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            })
            wwLib.wwPopups.addStory('WWVIDEO_STYLE', {
                title: {
                    en: 'Image style',
                    fr: 'Style de l\'image'
                },
                type: 'wwPopupImageStyle',
                buttons: {
                    OK: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            })

            wwLib.wwPopups.addStory('WWVIDEO_URL', {
                title: {
                    'en': 'EDIT URL',
                    'fr': 'EDITEZ l\'URL',
                },
                type: 'wwPopupForm',
                storyData: {
                    fields: [
                        {
                            label: {
                                en: 'Video URL :',
                                fr: 'URL de la vidéo :'
                            },
                            desc: {
                                en: 'the address on top of your browser',
                                fr: 'l\'adresse en haut de votre navigateur'
                            },
                            type: 'text',
                            key: 'url',
                            valueData: 'url'
                        }
                    ]
                },
                buttons: {
                    NEXT: {
                        text: {
                            en: 'Ok',
                            fr: 'Ok'
                        },
                        next: false
                    }
                }
            });

            let options = {
                firstPage: 'WWVIDEO_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options);

                console.log(result)

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/
                if (typeof (result.url) != 'undefined') {
                    const info = this.getInfoFromUrl(result.url)
                    if (info) {
                        this.wwObject.content.data.id = info.id;
                        this.wwObject.content.data.provider = info.provider
                    }
                }

                this.wwObjectCtrl.update(this.wwObject);

                this.wwObjectCtrl.globalEdit(result);

            } catch (error) {
                console.log(error);
            }

            wwLib.wwObjectHover.removeLock();
        },
    },
    mounted() {
        this.init();

        wwLib.wwElementsStyle.applyAllStyles({
            wwObject: this.wwObject,
            lastWwObject: null,
            element: this.$el,
            noAnim: this.wwAttrs.wwNoAnim,
            noClass: false,
        });

        this.$emit('ww-loaded', this);

    },
    beforeDestroyed() {
        //window.removeEventListener('resize', this.wwOnResize);
    }
};
</script>

<style scoped>
.ww-video {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 0;

    /*opacity: 0;*/
    -webkit-transition: opacity 0.3s ease;
    -moz-transition: opacity 0.3s ease;
    -o-transition: opacity 0.3s ease;
    transition: opacity 0.3s ease;
}

.ww-video-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.ww-video-element {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.ww-video.ww-video-bg {
    display: none;
    pointer-events: none;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.ww-video-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    /* opacity: 0;*/
    -webkit-transition: opacity 0.3s ease;
    -moz-transition: opacity 0.3s ease;
    -o-transition: opacity 0.3s ease;
    transition: opacity 0.3s ease;
}

.ww-video-loaded.ww-video,
.ww-video-loaded.ww-video-preview {
    opacity: 1 !important;
}

@media (min-width: 769px) {
    .ww-video.ww-video-bg {
        display: block !important;
    }
    .ww-video-preview {
        display: none;
    }
}
/* wwManager:start */
.ww-orange-button {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    z-index: 1;
}
/* wwManager:end */
</style>
