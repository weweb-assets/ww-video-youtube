export default {
    options: {
        sizable: true,
    },
    editor: {
        label: {
            fr: 'Vidéo - Vimeo',
            en: 'Vidéo - Vimeo',
        },
        icon: 'play',
    },
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
            hidden: content => content.provider === 'weweb',
            defaultValue: 'https://youtu.be/76CMCIW-wGk',
        },
        autoplay: {
            label: { en: 'Autoplay', fr: 'Lecture automatique' },
            type: 'TextRadioGroup',
            section: 'settings',
            options: {
                choices: [
                    {
                        default: true,
                        value: false,
                        title: { en: 'Start', fr: 'Début' },
                        icon: 'none',
                    },
                    {
                        value: true,
                        title: { en: 'Center', fr: 'Milieu' },
                        icon: 'tick',
                    },
                ],
            },
            defaultValue: false,
        },
        muted: {
            label: { en: 'Muted', fr: 'Muet' },
            type: 'TextRadioGroup',
            section: 'settings',
            options: {
                choices: [
                    {
                        default: true,
                        value: false,
                        title: { en: 'Start', fr: 'Début' },
                        icon: 'none',
                    },
                    {
                        value: true,
                        title: { en: 'Center', fr: 'Milieu' },
                        icon: 'tick',
                    },
                ],
            },
            defaultValue: false,
        },
        loop: {
            label: { en: 'Loop', fr: 'Lecture en boucle' },
            type: 'TextRadioGroup',
            section: 'settings',
            options: {
                choices: [
                    {
                        default: true,
                        value: false,
                        title: { en: 'Start', fr: 'Début' },
                        icon: 'none',
                    },
                    {
                        value: true,
                        title: { en: 'Center', fr: 'Milieu' },
                        icon: 'tick',
                    },
                ],
            },
            defaultValue: false,
        },
        controls: {
            label: { en: 'Controls', fr: 'Contrôles' },
            type: 'TextRadioGroup',
            section: 'settings',
            options: {
                choices: [
                    {
                        value: false,
                        title: { en: 'Start', fr: 'Début' },
                        icon: 'none',
                    },
                    {
                        default: true,
                        value: true,
                        title: { en: 'Center', fr: 'Milieu' },
                        icon: 'tick',
                    },
                ],
            },
            defaultValue: true,
        },
    },
};
