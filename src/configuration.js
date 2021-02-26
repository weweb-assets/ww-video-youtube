const COMMON_VIDEO_OPTIONS = {
    url: {
        path: 'url',
        label: { en: 'Video url', fr: 'Url de la vidéo' },
        type: 'Text',
        options: {
            placeholder: 'Url',
        },
        bindable: true,
    },
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
};

const OTHER_PROVIDER_OPTIONS = {
    settingsOptions: {
        ...COMMON_VIDEO_OPTIONS,
        previewImage: {
            label: { en: 'Preview image', fr: "Image de d'aperçu" },
            type: 'Image',
        },
    },
};

export const getSettingsConfigurations = content => {
    return content.provider === 'other' || content.provider === 'local'
        ? OTHER_PROVIDER_OPTIONS
        : { settingsOptions: { ...COMMON_VIDEO_OPTIONS } };
};
