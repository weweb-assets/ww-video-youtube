<template>
    <div class="ww-video" v-bind:class="{ 'ww-video-loaded': true }" :style="c_style">
        <!-- wwManager:start -->
        <wwOrangeButton class="ww-orange-button" v-if="wwObjectCtrl.getSectionCtrl().getEditMode()"></wwOrangeButton>
        <!-- wwManager:end -->
        <div class="ww-video-container">
            <!-- PREVIEW -->
            <div v-if="isBackground" class="ww-video-preview" v-bind:class="{ 'ww-video-loaded': videoLoaded }" v-bind:style="{ 'background-image': 'url(' + wwObject.content.data.preview + ')' }"></div>
            <video
                v-if="isVideo"
                class="ww-video-element"
                :class="{ 'ww-video-bg': isBackground }"
                v-bind:src="c_src"
                preload="auto"
                playsinline=""
                webkit-playsinline=""
                v-bind:muted="wwObject.content.data.muted"
                v-bind:controls="wwObject.content.data.controls"
                v-bind:autoplay="wwObject.content.data.autoplay"
                v-bind:loop="wwObject.content.data.loop"
            ></video>
            <iframe v-else ref="youtubeIframe" class="ww-video-element" :class="{ 'ww-video-bg': isBackground }" v-bind:src="c_src" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: '__COMPONENT_NAME__',
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            videoLoaded: false,
            d_el: undefined
        };
    },
    computed: {
        isVideo() {
            const provider = this.wwObject.content.data.provider;
            return provider === 'local' || provider === 'other';
        },
        isBackground() {
            return this.wwAttrs.wwCategory === 'background';
        },
        c_src() {
            const provider = this.wwObject.content.data.provider;
            let pureSrc = this.wwObject.content.data.id; // save source url for youtube loop parameter
            let src = this.wwObject.content.data.id;

            switch (provider) {
                case 'youtube':
                    if (this.isBackground) src = `//www.youtube.com/embed/${src}`;
                    else if (!this.isBackground) src = `//www.youtube.com/embed/${src}?rel=0`;
                    break;
                // case 'twitch':
                //     src = `//https://player.twitch.tv/?channel=${src}&parent=streamernews.example.com&muted=true`;
                //     break;
                case 'dailymotion':
                    src = `//www.dailymotion.com/embed/video/${src}?`;
                    break;
                case 'vimeo':
                    src = `//player.vimeo.com/video/${src}?`;
                    break;
                default:
                    break;
            }

            this.wwObject.content.data.url = src.substring(2);

            if (!this.isVideo) {
                if (provider === 'twitch') {
                    return src;
                }
                if (provider === 'youtube') {
                    if (this.wwObject.content.data.loop) src += `&loop=1&playlist=${pureSrc}`;
                    if (this.wwObject.content.data.autoplay) src += '&autoplay=1';
                    if (this.wwObject.content.data.muted) src += '&mute=1';
                    if (this.wwObject.content.data.controls) src += '&controls=1';
                    else if (!this.wwObject.content.data.controls) src += '&controls=0';
                } else {
                    if (this.wwObject.content.data.muted) src += '&muted=1';
                    if (this.wwObject.content.data.controls) src += '&controls=1';
                    if (this.wwObject.content.data.autoplay) src += '&autoplay=1';
                    if (this.wwObject.content.data.loop) src += '&loop=1';
                }
            }
            console.log(src);
            return src;
        },
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        c_style() {
            if (!this.d_el) return {};

            this.wwObject.content.data.style = this.wwObject.content.data.style || {};
            let styles = {};
            styles.background = this.wwObject.content.data.backgroundColor || 'transparent';
            styles.backgroundImage = this.wwObject.content.data.gradient || '';
            styles.paddingBottom = this.wwAttrs.wwCategory == 'background' ? '' : (Math.max(0, this.wwObject.ratio) || 66.66) + '%';

            //FORMAT
            styles.boxShadow = this.getShadow();

            //BORDER
            const w = this.$el.getBoundingClientRect().width;
            const unit = this.wwObject.content.data.style.borderRadiusUnit || '%';
            const borderRadius = (this.wwObject.content.data.style.borderRadius / (unit == '%' ? 2 : 1) || 0) + unit;
            styles.borderRadius = borderRadius;
            const borderWidth = this.wwObject.content.data.style.borderWidth ? this.wwObject.content.data.style.borderWidth : 0;
            styles.borderWidth = borderWidth + 'px';
            styles.borderColor = this.wwObject.content.data.style.borderColor || 'black';
            styles.borderStyle = this.wwObject.content.data.style.borderStyle || 'none';

            return styles;
        }
    },
    methods: {
        init() {
            let needUpdate = false;
            if (!this.wwObject.content.data.autoplay) {
                this.wwObject.content.data.autoplay = this.isBackground;
                needUpdate = true;
            }
            if (!this.wwObject.content.data.controls) {
                this.wwObject.content.data.controls = !this.isBackground;
                needUpdate = true;
            }
            if (!this.wwObject.content.data.loop) {
                this.wwObject.content.data.loop = this.isBackground;
                needUpdate = true;
            }
            if (!this.wwObject.content.data.muted) {
                this.wwObject.content.data.muted = this.isBackground;
                needUpdate = true;
            }

            if (needUpdate) {
                this.wwObjectCtrl.update(this.wwObject);
            }
            this.wwLoadVideo();
        },
        getRatio() {
            //If ratio is fixed in ww-object directive, override it here
            if (this.wwAttrs.wwFixedRatio) {
                try {
                    var ratio = parseFloat(this.wwAttrs.wwFixedRatio);
                    if (ratio) {
                        return ratio;
                    }
                } catch (error) {
                    console.log('wwRatio error', error);
                }
            }

            if (!this.wwObject.ratio || this.wwObject.ratio < 0) {
                if (this.wwAttrs.wwDefaultRatio) {
                    return this.wwAttrs.wwDefaultRatio;
                } else {
                    return (100 / 3) * 2;
                }
            }

            return this.wwObject.ratio;
        },
        getShadow() {
            this.wwObject.content.data.style = this.wwObject.content.data.style || {};
            const shadow = this.wwObject.content.data.style.boxShadow || {};
            if (shadow.x || shadow.y || shadow.b || shadow.s || shadow.c) {
                return shadow.x + 'px ' + shadow.y + 'px ' + shadow.b + 'px ' + shadow.s + 'px ' + shadow.c;
            }
            return '';
        },
        wwAppendPreview() {
            var wwPreviewHTML = "<div class='ww-video-preview' style='background-image:url(" + this.wwObject.content.data.preview + ")'></div>";

            wwVideoContainer.append(wwPreviewHTML);
        },
        wwLoadVideo: async function() {
            try {
                let wwVideoData = this.wwObject.content.data;

                if (wwVideoData.provider == 'local') {
                    const wwVideoHTML = document.createElement('video');
                    wwVideoHTML.appendChild(document.createElement('source', { src: this.wwObject.content.data.id + '#t=0.1', type: 'video/mp4' }));
                    return;
                }
            } catch (e) {}

            this.videoLoaded = true;
        },
        wwGetVideoPreviewAndRatio: async function(provider, videoId, videoPreview) {
            let noImage = videoPreview || 'https://cdn.wewebapp.io/public/images/no_image_selected.png';

            let responce = null;

            try {
                switch (provider) {
                    case 'youtube':
                        var previewAndRatio = {
                            preview: videoPreview || '//img.youtube.com/vi/' + videoId + '/maxresdefault.jpg',
                            ratio: 1920 / 1080
                        };
                        return previewAndRatio;
                        break;
                    case 'dailymotion':
                        responce = await axios.get('https://api.dailymotion.com/video/' + videoId + '?fields=thumbnail_1080_url,height,width');

                        if (!responce) {
                            return {
                                preview: noImage,
                                ratio: 1920 / 1080
                            };
                        }

                        var previewAndRatio = {
                            preview: noImage,
                            ratio: 1920 / 1080
                        };

                        if (responce.data.thumbnail_1080_url) {
                            previewAndRatio.preview = videoPreview || responce.data.thumbnail_1080_url;
                        }

                        if (responce.data.width && responce.data.height) {
                            previewAndRatio.ratio = responce.data.width / responce.data.height;
                        }

                        return previewAndRatio;

                        break;
                    case 'vimeo':
                        responce = await axios.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + videoId);

                        if (!responce) {
                            return {
                                preview: noImage,
                                ratio: 1920 / 1080
                            };
                        }

                        var previewAndRatio = {
                            preview: noImage,
                            ratio: 1920 / 1080
                        };

                        if (responce.data.thumbnail_url) {
                            var thumb = responce.data.thumbnail_url;
                            var reg = /i.vimeocdn.com\/video\/([^_]*)_/;
                            var matches = thumb.match(reg);
                            if (matches.length == 2) {
                                previewAndRatio.preview = videoPreview || '//i.vimeocdn.com/video/' + matches[1] + '_1920x1080.jpg';
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
                console.log('TEMP', temp);
                info.id = temp[1].split('?')[0];
            } else if (url.indexOf('vimeo.com') != -1) {
                info.provider = 'vimeo';
                const temp = url.split('m/')[1];
                info.id = temp.split('?')[0];
            } else if (url.indexOf('dailymotion.com') != -1) {
                info.provider = 'dailymotion';
                const temp = url.split('video/')[1];
                info.id = temp.split('?')[0];
            } /*else if (url.indexOf('twitch.tv') != -1) {
                info.provider = 'twitch';
                const temp = url.split('tv/')[1];
                info.id = temp.split('?')[0];
            }*/ else {
                info.provider = 'other';
                info.id = url;
            }
            console.log('INFO ', info);
            return info;
        },
        /*=============================================m_ÔÔ_m=============================================\
          EDIT VIDEO
        \================================================================================================*/
        /* wwManager:start */
        async edit() {
            wwLib.wwObjectHover.setLock(this);

            wwLib.wwPopups.addStory('WWVIDEO_EDIT', {
                title: {
                    en: 'Edit video',
                    fr: 'Editer la vidéo'
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: {
                        WWVIDEO_URL: {
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
                        EDIT_OPTIONS: {
                            separator: {
                                en: 'Video player',
                                fr: 'Lecteur video'
                            },
                            title: {
                                en: 'Change video player options',
                                fr: "Changer l'apparence du lecteur video"
                            },
                            desc: {
                                en: 'autoplay, controls, loop ...',
                                fr: 'autoplay, controls, loop ...'
                            },
                            icon: 'wwi wwi-config',
                            shortcut: 'o',
                            next: 'WWVIDEO_OPTIONS'
                        },
                        EDIT_STYLE: {
                            separator: {
                                en: 'Style',
                                fr: 'Style'
                            },
                            title: {
                                en: 'Change video style',
                                fr: "Changer l'apparence de la video"
                            },
                            desc: {
                                en: 'Size, shadow, ...',
                                fr: 'Taille, ombres, ...'
                            },
                            icon: 'wwi wwi-edit-style',
                            shortcut: 's',
                            next: 'WWVIDEO_STYLE'
                        },
                        EDIT_RATIO: {
                            title: {
                                en: 'Change video ratio',
                                fr: 'Changer le ratio de la vidéo'
                            },
                            desc: {
                                en: 'Portrait, square, landscape, ...',
                                fr: 'Portrait, carré, paysage, ...'
                            },
                            icon: 'wwi wwi-ratio',
                            shortcut: 'r',
                            next: 'WWVIDEO_RATIO'
                        }
                    }
                }
            });
            wwLib.wwPopups.addStory('WWVIDEO_OPTIONS', {
                title: {
                    en: 'Video player Options',
                    fr: 'Paramètres du lecteur vidéo'
                },
                type: 'wwPopupForm',
                storyData: {
                    fields: [
                        {
                            label: {
                                en: 'Autoplay :',
                                fr: 'Lecture automatique :'
                            },
                            desc: {
                                en: 'Video starts automatically',
                                fr: 'La vidéo se lance automatiquement'
                            },
                            type: 'radio',
                            key: 'autoplay',
                            valueData: 'wwObject.content.data.autoplay'
                        },
                        {
                            label: {
                                en: 'Controls :',
                                fr: 'Contrôles :'
                            },
                            desc: {
                                en: 'See player controls options',
                                fr: 'Voir les options de contrôle du lecteur'
                            },
                            type: 'radio',
                            key: 'controls',
                            valueData: 'wwObject.content.data.controls'
                        },
                        {
                            label: {
                                en: 'Loop :',
                                fr: 'Boucle :'
                            },
                            desc: {
                                en: 'The video plays in loop',
                                fr: 'La vidéo joue en boucle'
                            },
                            type: 'radio',
                            key: 'loop',
                            valueData: 'wwObject.content.data.loop'
                        },
                        {
                            label: {
                                en: 'Muted :',
                                fr: 'Silencieux :'
                            },
                            desc: {
                                en: 'The video is muted',
                                fr: 'Le son de la vidéo est coupé'
                            },
                            type: 'radio',
                            key: 'muted',
                            valueData: 'wwObject.content.data.muted'
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
            wwLib.wwPopups.addStory('WWVIDEO_RATIO', {
                title: {
                    en: 'Slider Ratio',
                    fr: 'Ratio du slider'
                },
                type: 'wwPopupWwObjectRatio',
                buttons: {
                    NEXT: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            });
            wwLib.wwPopups.addStory('WWVIDEO_STYLE', {
                title: {
                    en: 'Image style',
                    fr: "Style de l'image"
                },
                type: 'wwPopupWwObjectStyle',
                buttons: {
                    OK: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            });
            wwLib.wwPopups.addStory('WWVIDEO_URL', {
                title: {
                    en: 'EDIT URL',
                    fr: "EDITEZ l'URL"
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
                                fr: "l'adresse en haut de votre navigateur"
                            },
                            type: 'text',
                            key: 'url',
                            valueData: 'wwObject.content.data.url'
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

            const options = {
                firstPage: 'WWVIDEO_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            };

            try {
                const result = await wwLib.wwPopups.open(options);

                // console.log('Result 💻 :', result);
                // console.log('Data before 🚀 :', this.wwObject.content.data);

                if (typeof result.url != 'undefined') {
                    const info = this.getInfoFromUrl(result.url);
                    if (info) {
                        this.wwObject.content.data.id = info.id;
                        this.wwObject.content.data.provider = info.provider;
                    }
                }

                /*=============================================m_ÔÔ_m=============================================\
                  VIDEO PLAYER
                \================================================================================================*/
                if (typeof result.autoplay != 'undefined') {
                    this.wwObject.content.data.autoplay = result.autoplay;
                }

                if (typeof result.controls != 'undefined') {
                    this.wwObject.content.data.controls = result.controls;
                }

                if (typeof result.loop != 'undefined') {
                    this.wwObject.content.data.loop = result.loop;
                }

                if (typeof result.muted != 'undefined') {
                    this.wwObject.content.data.muted = result.muted;
                }

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/

                if (typeof result.borderColor != 'undefined') {
                    this.wwObject.content.data.style.borderColor = result.borderColor;
                }
                if (typeof result.borderRadius != 'undefined') {
                    this.wwObject.content.data.style.borderRadius = result.borderRadius;
                }
                if (typeof result.borderRadiusUnit != 'undefined') {
                    this.wwObject.content.data.style.borderRadiusUnit = result.borderRadiusUnit;
                }
                if (typeof result.borderStyle != 'undefined') {
                    this.wwObject.content.data.style.borderStyle = result.borderStyle;
                }
                if (typeof result.borderWidth != 'undefined') {
                    this.wwObject.content.data.style.borderWidth = result.borderWidth;
                }
                if (typeof result.boxShadow != 'undefined') {
                    this.wwObject.content.data.style.boxShadow = result.boxShadow;
                }
                if (typeof result.filter != 'undefined') {
                    this.wwObject.content.data.style.filter = result.filter;
                }
                if (typeof result.overlay != 'undefined') {
                    this.wwObject.content.data.style.overlay = result.overlay;
                }
                if (typeof result.ratio != 'undefined') {
                    this.wwObject.ratio = result.ratio;
                }
                if (typeof result.maxHeight != 'undefined') {
                    this.wwObject.content.data.style.maxHeight = result.maxHeight;
                }
                if (typeof result.minWidth != 'undefined') {
                    this.wwObject.content.data.style.minWidth = result.minWidth;
                }

                //console.log('Data after 🔥 :', this.wwObject.content.data);

                this.wwObjectCtrl.update(this.wwObject);

                this.wwObjectCtrl.globalEdit(result);
            } catch (error) {
                wwLib.wwLog.error(error);
            }

            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */
    },
    mounted() {
        this.init();

        wwLib.wwElementsStyle.applyAllStyles({
            wwObject: this.wwObject,
            lastWwObject: null,
            element: this.$el,
            noAnim: this.wwAttrs.wwNoAnim,
            noClass: false
        });

        this.d_el = this.$el;

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
