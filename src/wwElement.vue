<template>
    <div class="ww-video-vimeo" :class="{ editing: isEditing }">
        <div class="video-player" ref="videoPlayer"></div>
    </div>
</template>

<script>
import Vimeo from '@vimeo/player';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content:effect', 'update:sidepanel-content', 'trigger-event'],
    setup(props) {
        const player = null;
        const { variableValue: isPlayedVariableValue, setValue: setIsPlayedValue } =
            wwLib.wwVariable.useComponentVariable({
                uid: props.uid,
                name: 'Is Played',
                type: 'boolean',
                defaultValue: false,
            });
        const { variableValue: currentTimeVariableValue, setValue: setCurrentTimeValue } =
            wwLib.wwVariable.useComponentVariable({
                uid: props.uid,
                name: 'Current time',
                type: 'number',
                defaultValue: 0,
            });

        return { player, isPlayedVariableValue, setIsPlayedValue, currentTimeVariableValue, setCurrentTimeValue };
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
            if (!this.content.url) return '';
            return this.content.url.split('m/')[1].split('?')[0];
        },
    },
    watch: {
        isEditing: {
            async handler() {
                await this.initPlayer();
            },
        },
        'content.url': {
            async handler() {
                await this.initPlayer();
            },
        },
        'content.videoStartTime': {
            async handler() {
                await this.initPlayer();
            },
        },
        'content.controls': {
            async handler() {
                await this.initPlayer();
            },
        },
        'content.loop'(value) {
            if (this.player) this.player.setLoop(value);
        },
        'content.muted'(value) {
            if (this.player) this.player.setMuted(value);
        },
    },
    methods: {
        async initPlayer() {
            if (this.player) await this.player.destroy();

            this.$nextTick(async () => {
                const el = this.$refs.videoPlayer;
                let options = {
                    id: this.videoId,
                    controls: this.content.controls,
                };
                this.player = new Vimeo(el, options);

                // Get the video duration to adapt the option of videoStartTime
                const videoDuration = await this.player.getDuration();
                this.$nextTick(() => {
                    if (this.isEditing) this.$emit('update:content:effect', { videoDuration });
                });

                this.player.setCurrentTime(this.content.videoStartTime);
                this.player.setLoop(this.content.loop);
                this.player.setMuted(this.content.muted);

                // Dont play the video & dont init events in edition mode
                if (this.isEditing) return;

                if (this.content.autoplay) this.player.play();

                this.player.on('timeupdate', data => {
                    this.setCurrentTimeValue(data.seconds);
                });

                this.player.on('play', data => {
                    this.setIsPlayedValue(true);
                    this.$emit('trigger-event', { name: 'play', event: { value: data.seconds } });
                });

                this.player.on('pause', data => {
                    this.setIsPlayedValue(false);
                    this.$emit('trigger-event', { name: 'pause', event: { value: data.seconds } });
                });

                this.player.on('ended', () => {
                    this.setIsPlayedValue(false);
                    this.$emit('trigger-event', { name: 'end', event: {} });
                });
            });
        },
    },
    beforeUnmount() {
        if (this.player) {
            this.player.off('timeupdate');
            this.player.off('play');
            this.player.off('pause');
            this.player.off('ended');
        }
    },
    async mounted() {
        await this.initPlayer();
    },
};
</script>

<style lang="scss">
.ww-video-vimeo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 9;

    &.editing {
        pointer-events: none;
    }

    .video-player iframe {
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
