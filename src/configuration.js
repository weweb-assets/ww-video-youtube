const COMMON_VIDEO_OPTIONS = {
    autoplay: {
        label: { en: 'Autoplay', fr: 'Lecture automatique' },
        type: 'TextRadioGroup',
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
    },
    muted: {
        label: { en: 'Muted', fr: 'Muet' },
        type: 'TextRadioGroup',
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
    },
    loop: {
        label: { en: 'Loop', fr: 'Lecture en boucle' },
        type: 'TextRadioGroup',
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
    },
    controls: {
        label: { en: 'Controls', fr: 'Contrôles' },
        type: 'TextRadioGroup',
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
    },
};

const EXTERNAL_PROVIDER_OPTIONS = {
    settingsOptions: {
        url: {
            path: 'url',
            label: { en: 'Video url', fr: 'Url de la vidéo' },
            type: 'Text',
            options: {
                placeholder: 'Url',
            },
            bindable: true,
        },
        ...COMMON_VIDEO_OPTIONS,
    },
};

const WEWEB_PROVIDER_OPTIONS = {
    settingsOptions: {
        url: {
            path: 'url',
            label: { en: 'Video url', fr: 'Url de la vidéo' },
            type: 'Text',
            options: {
                placeholder: 'Url',
                disabled: true,
            },
        },
        file: {
            label: { en: 'File', fr: 'Fichier' },
            type: 'Video',
        },
        previewImage: {
            label: { en: 'Preview image', fr: "Image de d'aperçu" },
            type: 'Image',
        },
        ...COMMON_VIDEO_OPTIONS,
        preload: {
            label: { en: 'Preload', fr: 'Précharger' },
            type: 'TextRadioGroup',
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
        },
    },
};

export const getSettingsConfigurations = content => {
    return content.provider === 'weweb' ? WEWEB_PROVIDER_OPTIONS : EXTERNAL_PROVIDER_OPTIONS;
};
