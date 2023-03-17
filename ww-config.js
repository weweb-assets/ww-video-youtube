export default {
    options: {
        sizable: true,
    },
    editor: {
        label: {
            fr: 'Vidéo - Youtube',
            en: 'Vidéo - Youtube',
        },
        icon: 'logos/youtube',
    },
    triggerEvents: [
        { name: 'play', label: { en: 'On play' }, event: { value: '' }, default: true },
        { name: 'pause', label: { en: 'On pause' }, event: { value: '' } },
        { name: 'end', label: { en: 'On end' }, event: { value: '' } },
    ],
    properties: {
        url: {
            path: 'url',
            label: { en: 'Video url', fr: 'Url de la vidéo' },
            type: 'Text',
            section: 'settings',
            options: {
                placeholder: 'Url',
            },
            bindable: true,
            defaultValue: 'https://www.youtube.com/watch?v=r8z4Omw-D2s',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A Youtube url: `"https://www.youtube.com/watch?v=r8z4Omw-D2s"`',
            },
            /* wwEditor:end */
        },
        videoStartTime: {
            label: {
                en: 'Start time (s)',
            },
            type: 'Number',
            options: (_, sidepanelContent) => {
                return { min: 0, max: sidepanelContent.videoDuration };
            },
            section: 'settings',
            bindable: true,
            defaultValue: 0,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'A number that defines the video start time, in seconds: `42`',
            },
            /* wwEditor:end */
        },
        videoDuration: {
            editorOnly: true,
            defaultValue: 0,
            hidden: true,
        },
        autoplay: {
            label: { en: 'Autoplay', fr: 'Lecture automatique' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: 0,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the video should start automatically: `true | false`',
            },
            /* wwEditor:end */
        },
        muted: {
            label: { en: 'Muted', fr: 'Muet' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the video is muted: `true | false`',
            },
            /* wwEditor:end */
        },
        loop: {
            label: { en: 'Loop', fr: 'Lecture en boucle' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
        },
        controls: {
            label: { en: 'Controls', fr: 'Contrôles' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: 1,
        },
    },
};
