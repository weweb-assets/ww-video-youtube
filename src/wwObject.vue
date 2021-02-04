<template>
    <div class="ww-video">
        <div class="ww-video-container">
            <video
                v-if="isVideo"
                class="ww-video-element"
                ref="videoPlayer"
                preload="none"
                playsinline
                webkit-playsinline
            >
                <source :src="content.url" type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
            </video>
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
    data() {
        return {
            isVideoPlayed: false,
            isEventListener: false,
        };
    },
    /* wwEditor:start */
    wwEditorConfiguration({ content }) {
        return getSettingsConfigurations(content);
    },
    /* wwEditor:end */
    watch: {
        content() {
            this.handleVideoEvent();
        },
        'content.url'() {
            if (!this.content.url) return;

            const provider = this.getInfoFromUrl(this.content.url).provider;
            this.$emit('update', {
                provider: provider,
            });
        },
        'content.autoplay'() {
            this.handleVideoEvent();
        },
        'content.controls'() {
            this.handleVideoEvent();
        },
        'content.loop'() {
            this.handleVideoEvent();
        },
        'content.muted'() {
            this.handleVideoEvent();
        },
        'content.previewImage'() {
            this.handleVideoEvent();
        },
    },
    computed: {
        videoElement() {
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
        handleLocalVideoOptions() {
            if (!this.isVideo) return;

            const { controls, loop, autoplay, muted, previewImage } = this.content;
            const video = this.$refs.videoPlayer;

            if (!video) {
                return;
            }

            if (controls) {
                video.setAttribute('controls', '');
            } else {
                video.removeAttribute('controls');
            }

            if (loop) {
                video.setAttribute('loop', '');
            } else {
                video.removeAttribute('loop');
            }

            if (autoplay) {
                video.setAttribute('autoplay', '');
                video.play();
                this.isVideoPlayed = true;
            } else {
                video.removeAttribute('autoplay');
                video.pause();
                this.isVideoPlayed = false;
            }

            if (muted) {
                video.setAttribute('muted', '');
            } else {
                video.removeAttribute('muted');
            }

            if (previewImage && previewImage.length && previewImage.length > 1) {
                video.setAttribute('poster', `${wwLib.wwUtils.getCdnPrefix()}${this.content.previewImage}`);
            } else {
                video.removeAttribute('poster');
            }
        },
        handleVideoClick() {
            if (!this.isVideo) return;

            const video = this.$refs.videoPlayer;

            if (!this.isVideoPlayed) {
                video.play();
                this.isVideoPlayed = true;
            } else {
                video.pause();
                this.isVideoPlayed = false;
            }
        },
        handleVideoEvent() {
            const videoEl = document.querySelector('.ww-video-element');

            if (this.isEventListener) {
                videoEl.removeEventListener('click', this.handleVideoClick);
                this.isEventListener = false;
            }

            videoEl.addEventListener('click', this.handleVideoClick);
            this.isEventListener = true;

            this.$nextTick(() => {
                this.handleLocalVideoOptions();
            });
        },
    },
    mounted() {
        if (this.isVideo) {
            this.handleLocalVideoOptions;
        }

        this.$nextTick(() => {
            const videoEl = document.querySelector('.ww-video-element');
            videoEl.addEventListener('click', this.handleVideoClick);
            this.isEventListener = true;
        });
    },
    beforeDestroy() {
        if (this.isEventListener) {
            const videoEl = document.querySelector('.ww-video-element');
            videoEl.removeEventListener('click', this.handleVideoClick);
            this.isEventListener = false;
        }
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
