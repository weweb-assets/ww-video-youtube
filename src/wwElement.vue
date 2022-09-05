<template>
    <div class="ww-video"></div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content:effect'],
    data() {
        return {};
    },
    computed: {},
    watch: {
        'content.autoplay'(newAuto, oldAuto) {
            if (this.content.autoplay) {
                this.$emit('update:content:effect', {
                    muted: true,
                });
            }
            if (newAuto !== oldAuto && newAuto) {
                this.updateweWeWebVideo();
            }
        },
        'content.loop'(newLoop, oldLoop) {
            if (newLoop !== oldLoop && newLoop) {
                this.updateweWeWebVideo();
            }
        },
    },
    unmounted() {
        if (this.isEventListener) {
            const videoEl = document.querySelector('.ww-video-element');
            videoEl.removeEventListener('click', this.handleVideoClick);
            this.isEventListener = false;
        }
    },
    methods: {
        getInfoFromUrl(url) {
            if (!this.content.url) return {};
            return {
                id: url.split('m/')[1].split('?')[0],
                provider: 'vimeo',
            };
        },
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
}
</style>
