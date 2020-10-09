<template>
    <div class="ww-video" :style="style">
        <div class="ww-video-container">
            <iframe
                class="ww-video-element"
                :class="{ 'ww-video-bg': isBackground, 'ww-editing': isEditing }"
                :src="isVideo ? src : undefined"
                frameborder="0"
                webkitallowfullscreen
                mozallowfullscreen
                allowfullscreen
                scrolling="no"
                loading="lazy"
            ></iframe>
        </div>
    </div>
</template>

<script>
/* wwEditor:start */
import openPopup from './popups';
/* wwEditor:end */

export default {
    name: '__COMPONENT_NAME__',
    props: {
        content: Object,
        isBackground: Boolean,
        /* wwEditor:start */
        wwEditorState: Object,
        /* wwEditor:end */
    },
    wwDefaultContent: {
        id: '76CMCIW-wGk',
        url: 'https://youtu.be/76CMCIW-wGk',
        provider: 'youtube',
        autoplay: false,
        controls: true,
        loop: false,
        muted: false,
        ratio: 33.33,
    },
    computed: {
        style() {
            return {
                paddingBottom: this.isBackground ? '' : (Math.max(0, this.content.ratio) || 66.66) + '%',
            };
        },
        isEditing() {
            return this.wwEditorState.editMode === wwLib.wwSectionHelper.EDIT_MODES.CONTENT;
        },
        isVideo() {
            return this.content.provider === 'other' || this.content.provider === 'local';
        },
        src() {
            const provider = this.content.provider;
            let src = this.content.id;
            switch (provider) {
                case 'youtube':
                    if (this.isBackground) src = `//www.youtube.com/embed/${src}`;
                    else if (!this.isBackground) src = `//www.youtube.com/embed/${src}?rel=0`;
                    break;
                case 'twitch':
                    src = `//player.twitch.tv/?video=${src}&parent=${window.location.hostname}`;
                    break;
                case 'dailymotion':
                    src = `//www.dailymotion.com/embed/video/${src}?`;
                    break;
                case 'vimeo':
                    src = `//player.vimeo.com/video/${src}?`;
                    break;
                default:
                    break;
            }

            if (!this.isVideo) {
                if (provider === 'youtube') {
                    if (this.content.loop) src += `&loop=1&playlist=${this.content.id}`;
                    if (this.content.autoplay) src += '&autoplay=1';
                    if (this.content.muted) src += '&mute=1';
                    if (this.content.controls) src += '&controls=1';
                    else src += '&controls=0';
                } else if (provider === 'twitch') {
                    src += `&autoplay=${this.content.autoplay}`;
                    src += `&mute=${this.content.muted}`;
                } else {
                    if (this.content.muted) src += '&muted=1';
                    if (this.content.controls) src += '&controls=1';
                    if (this.content.autoplay) src += '&autoplay=1';
                    if (this.content.loop) src += '&loop=1';
                }
            }

            return src;
        },
        srcdoc() {
            const autoplay = this.content.autoplay ? true : false;
            const muted = autoplay ? true : this.content.muted ? true : false;
            const controls = this.content.controls ? true : false;
            const loop = this.content.loop ? true : false;

            return `
                <html style="height:100%">
                    <body style="padding: 0; margin: 0; overflow: hidden; height: 100%;">
                        <video
                            style="width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                            preload="none"
                            playsinline
                            webkit-playsinline
                            autoplay=${autoplay}
                            loop=${loop}
                            muted=${muted}
                            controls=${controls}>
                                <source src="${this.src}" >
                        </video>
                    </body>
                </html>`;
        },
    },
    /* wwEditor:start */
    methods: {
        async setOptions() {
            const result = await openPopup(this.content);
            if (result) this.$emit('update', result);
        },
    },
    /* wwEditor:end */
};
</script>

<style lang="scss" scoped>
.ww-video {
    position: relative;
    width: 100%;
    height: 100%;
    .ww-video-container {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        .ww-video-bg {
            display: none;
            pointer-events: none;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            @media (min-width: 769px) {
                display: block !important;
            }
        }
        .ww-video-element {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            &.ww-editing {
                pointer-events: none;
            }
        }
    }
    /* wwEditor:start */
    .ww-orange-button {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        z-index: 1;
    }
    /* wwEditor:end */
}
</style>
