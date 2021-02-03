<template>
    <div class="ww-video">
        <div class="ww-video-container">
            <iframe
                ref="video"
                v-if="isVideo"
                class="ww-video-element"
                :class="{ 'ww-editing': isEditing }"
                :srcdoc="srcdoc"
                frameborder="0"
                webkitallowfullscreen
                mozallowfullscreen
                allowfullscreen
                scrolling="no"
                loading="lazy"
            ></iframe>
            <iframe
                v-else
                class="ww-video-element"
                :class="{ 'ww-editing': isEditing }"
                :src="src"
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
import { getSettingsConfigurations } from './configuration';

export default {
    name: '__COMPONENT_NAME__',
    props: {
        content: Object,
        /* wwEditor:start */
        wwEditorState: Object,
        /* wwEditor:end */
    },
    wwDefaultContent: {
        url: 'https://youtu.be/76CMCIW-wGk',
        provider: 'youtube',
        autoplay: false,
        controls: true,
        loop: false,
        muted: false,
        previewImage: '',
    },
    /* wwEditor:start */
    wwEditorConfiguration({ content }) {
        return getSettingsConfigurations(content);
    },
    /* wwEditor:end */
    watch: {
        'content.url'() {
            if (!this.content.url) return;
            const provider = this.getInfoFromUrl(this.content.url).provider;
            this.$emit('update', {
                provider: provider,
            });
        },
    },
    computed: {
        videoIframeElement() {
            return this.isVideo ? this.$refs.video : null;
        },
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwSectionHelper.EDIT_MODES.CONTENT;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        isVideo() {
            return this.content.provider === 'other' || this.content.provider === 'local';
        },
        src() {
            if (!this.content.url) return;
            let src = this.content.url;
            const provider = this.getInfoFromUrl(src).provider;

            const id = this.getInfoFromUrl(src).id;
            if (provider === 'other' || provider === 'local') return;
            switch (provider) {
                case 'youtube':
                    src = `//www.youtube.com/embed/${id}?rel=0`;
                    break;
                case 'twitch':
                    src = `//player.twitch.tv/?video=${id}&parent=${window.location.hostname}`;
                    break;
                case 'dailymotion':
                    src = `//www.dailymotion.com/embed/video/${id}?`;
                    break;
                case 'vimeo':
                    src = `//player.vimeo.com/video/${id}?`;
                    break;
                default:
                    break;
            }
            if (provider === 'youtube') {
                if (this.content.loop) src += `&loop=1&playlist=${id}`;
                if (this.content.autoplay) src += '&autoplay=1';
                if (this.content.muted) src += '&mute=1';
                if (!this.content.controls) src += '&controls=0';
            } else if (provider === 'twitch') {
                src += `&autoplay=${this.content.autoplay}`;
                src += `&mute=${this.content.muted}`;
            } else {
                if (this.content.muted) src += '&muted=1';
                if (!this.content.controls) src += '&controls=0';
                if (this.content.autoplay) src += '&autoplay=1';
                if (this.content.loop) src += '&loop=1';
            }

            return src;
        },
        srcdoc() {
            const previewUrl = `${wwLib.wwUtils.getCdnPrefix()}${this.content.previewImage}`;

            return `<html style='height:100%'>
                        <body style='padding:0;margin:0;overflow: hidden;height:100%;'>
                                <video
                                    class='video'
                                    style='width:100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);'
                                    preload='none'
                                    playsinline
                                    webkit-playsinline
                                    ${this.content.previewImage ? 'poster=' + previewUrl : ''}
                                    ${this.content.autoplay ? 'autoplay' : ''}
                                    ${this.content.loop ? 'loop' : ''}
                                    ${this.content.muted ? 'muted' : ''}
                                    ${this.content.controls ? 'controls' : ''}
                                    >
                                    <source src='${this.content.url}' type='video/mp4' />
                                </video>
                         </body>
                    </html>
                `;
        },
    },
    methods: {
        getInfoFromUrl(url) {
            if (!this.content.url) return {};
            if (url.indexOf('youtube.com') !== -1) {
                return {
                    id: url.split('v=')[1].split('?')[0],
                    provider: 'youtube',
                };
            } else if (url.indexOf('youtu.be') !== -1) {
                return {
                    id: url.split('be/')[1].split('?')[0],
                    provider: 'youtube',
                };
            } else if (url.indexOf('vimeo.com') !== -1) {
                return {
                    id: url.split('m/')[1].split('?')[0],
                    provider: 'vimeo',
                };
            } else if (url.indexOf('dailymotion.com') !== -1) {
                return {
                    id: url.split('video/')[1].split('?')[0],
                    provider: 'dailymotion',
                };
            } else if (url.indexOf('twitch.tv') !== -1) {
                return {
                    id: url.split('tv/videos/')[1].split('?')[0],
                    provider: 'twitch',
                };
            } else {
                return {
                    id: url,
                    provider: 'other',
                };
            }
        },
        handlePreviewClick() {
            if (
                this.videoIframeElement &&
                this.videoIframeElement.contentWindow &&
                this.videoIframeElement.contentWindow.document
            ) {
                this.videoIframeElement.contentWindow.document.querySelector('.video').play();
            }
            return;
        },
    },
    mounted() {
        const wwVideo = document.querySelector('.ww-video-container');
        wwVideo.addEventListener('click', this.handlePreviewClick);
    },
    beforeDestroy() {
        const wwVideo = document.querySelector('.ww-video-container');
        wwVideo.removeEventListener('click', this.handlePreviewClick);
    },
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
