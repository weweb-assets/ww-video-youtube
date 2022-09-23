<template>
    <div class="ww-video-youtube" :class="{ editing: isEditing }">
        <div ref="videoPlayer"></div>
    </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:sidepanel-content', 'trigger-event'],
    setup(props) {
        const player = null;
        const { variableValue: isPlayingVariableValue, setValue: setIsPlayingValue } =
            wwLib.wwVariable.useComponentVariable({
                uid: props.uid,
                name: 'Is Playing',
                type: 'boolean',
                defaultValue: false,
                readonly: true,
            });
        const { variableValue: currentTimeVariableValue, setValue: setCurrentTimeValue } =
            wwLib.wwVariable.useComponentVariable({
                uid: props.uid,
                name: 'Current time',
                type: 'number',
                defaultValue: 0,
                readonly: true,
            });

        return { player, isPlayingVariableValue, setIsPlayingValue, currentTimeVariableValue, setCurrentTimeValue };
    },
    data() {
        return {
            timeUpdater: null,
        };
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        videoId() {
            if (!this.content.url || typeof this.content.url !== 'string') return '';

            if (this.content.url.indexOf('youtube.com') !== -1) {
                return this.content.url.split('v=')[1].split('?')[0];
            } else if (this.content.url.indexOf('youtu.be') !== -1) {
                return this.content.url.split('be/')[1].split('?')[0];
            }

            return '';
        },
    },
    watch: {
        isEditing() {
            this.initPlayer();
        },
        'content.url'() {
            this.initPlayer();
        },
        'content.controls'() {
            this.initPlayer();
        },
        'content.loop'(value) {
            if (this.player) this.player.setLoop(value);
        },
        'content.muted'(value) {
            if (this.player) {
                if (value) {
                    this.player.mute();
                } else {
                    this.player.unMute();
                }
            }
        },
    },
    methods: {
        async initPlayer() {
            if (!this.videoId) return;
            if (this.player) await this.player.destroy();

            const el = this.$refs.videoPlayer;
            this.player = await YouTubePlayer(el, {
                videoId: this.videoId,
                startSeconds: this.content.videoStartTime,
                playerVars: { controls: this.content.controls, autoplay: this.isEditing ? 0 : this.content.autoplay },
            });

            this.player.on('ready', async () => {
                if (this.content.muted) this.player.mute();
                if (this.content.loop) this.player.setLoop(true);

                /* wwEditor:start */
                // Get the video duration to adapt the option of videoStartTime
                const videoDuration = await this.player.getDuration();
                if (this.isEditing)
                    this.$emit('update:sidepanel-content', {
                        path: 'videoDuration',
                        value: videoDuration,
                    });
                /* wwEditor:end */

                if (this.isEditing) return;
                this.player.loadVideoById(settings);
                this.timeUpdater = setInterval(await this.updateCurrentTime, 250);

                this.player.on('stateChange', event => {
                    switch (event.data) {
                        // https://developers.google.com/youtube/iframe_api_reference#Events
                        case 1:
                            this.setIsPlayingValue(true);
                            this.$emit('trigger-event', { name: 'play', event: { value: data.seconds } });
                            break;
                        case 2:
                            this.setIsPlayingValue(false);
                            this.$emit('trigger-event', { name: 'pause', event: { value: data.seconds } });
                            break;
                        case 0:
                            this.setIsPlayingValue(false);
                            this.$emit('trigger-event', { name: 'end', event: {} });
                            break;
                        default:
                            break;
                    }
                });
            });
        },
        async updateCurrentTime() {
            const currentTime = await this.player.getCurrentTime();
            this.setCurrentTimeValue(Math.ceil(currentTime * 10) / 10);
        },
    },
    beforeUnmount() {
        clearInterval(this.timeUpdater);
    },
    async mounted() {
        await this.initPlayer();
    },
};
</script>

<style lang="scss">
.ww-video-youtube {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 9;

    &.editing {
        pointer-events: none;
    }

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
