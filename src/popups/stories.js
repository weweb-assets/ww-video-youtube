wwLib.wwPopups.addStory('WWVIDEO_EDIT', {
    title: {
        en: 'Edit video',
        fr: 'Editer la vidéo',
    },
    type: 'wwPopupEditWwObject',
    buttons: null,
    storyData: {
        list: {
            WWVIDEO_URL: {
                title: {
                    en: 'Source',
                    fr: 'Source',
                },
                desc: {
                    en: 'Edit video source',
                    fr: 'Éditer la source de la vidéo',
                },
                icon: 'wwi wwi-video',
                shortcut: 's',
                next: 'WWVIDEO_URL',
            },
            EDIT_OPTIONS: {
                title: {
                    en: 'Video player',
                    fr: 'Lecteur video',
                },
                desc: {
                    en: 'autoplay, controls, loop ...',
                    fr: 'autoplay, controls, loop ...',
                },
                icon: 'wwi wwi-config',
                shortcut: 'o',
                next: 'WWVIDEO_OPTIONS',
            },
            EDIT_RATIO: {
                title: {
                    en: 'Ratio',
                    fr: 'Ratio',
                },
                desc: {
                    en: 'Portrait, square, landscape, ...',
                    fr: 'Portrait, carré, paysage, ...',
                },
                icon: 'wwi wwi-ratio',
                shortcut: 'r',
                next: 'WWVIDEO_RATIO',
            },
        },
    },
});

wwLib.wwPopups.addStory('WWVIDEO_OPTIONS', {
    title: {
        en: 'Video player Options',
        fr: 'Paramètres du lecteur vidéo',
    },
    type: 'wwPopupForm',
    storyData: {
        fields: [
            {
                label: {
                    en: 'Autoplay :',
                    fr: 'Lecture automatique :',
                },
                desc: {
                    en: 'Video starts automatically',
                    fr: 'La vidéo se lance automatiquement',
                },
                type: 'radio',
                key: 'autoplay',
                valueData: 'autoplay',
            },
            {
                label: {
                    en: 'Controls :',
                    fr: 'Contrôles :',
                },
                desc: {
                    en: 'See player controls options',
                    fr: 'Voir les options de contrôle du lecteur',
                },
                type: 'radio',
                key: 'controls',
                valueData: 'controls',
            },
            {
                label: {
                    en: 'Loop :',
                    fr: 'Boucle :',
                },
                desc: {
                    en: 'The video plays in loop',
                    fr: 'La vidéo joue en boucle',
                },
                type: 'radio',
                key: 'loop',
                valueData: 'loop',
            },
            {
                label: {
                    en: 'Muted :',
                    fr: 'Silencieux :',
                },
                desc: {
                    en: 'The video is muted',
                    fr: 'Le son de la vidéo est coupé',
                },
                type: 'radio',
                key: 'muted',
                valueData: 'muted',
            },
        ],
    },
    buttons: {
        NEXT: {
            text: {
                en: 'Save',
                fr: 'Sauvegarder',
            },
            next: false,
        },
    },
});

wwLib.wwPopups.addStory('WWVIDEO_RATIO', {
    title: {
        en: 'Slider Ratio',
        fr: 'Ratio du slider',
    },
    type: 'wwPopupWwObjectRatio',
    buttons: {
        NEXT: {
            text: {
                en: 'Save',
                fr: 'Sauvegarder',
            },
            next: false,
        },
    },
});

wwLib.wwPopups.addStory('WWVIDEO_URL', {
    title: {
        en: 'EDIT URL',
        fr: "EDITEZ l'URL",
    },
    type: 'wwPopupForm',
    storyData: {
        fields: [
            {
                label: {
                    en: 'Video URL :',
                    fr: 'URL de la vidéo :',
                },
                desc: {
                    en: 'The address on top of your browser',
                    fr: "L'adresse en haut de votre navigateur",
                },
                type: 'text',
                key: 'url',
                valueData: 'url',
            },
        ],
    },
    buttons: {
        NEXT: {
            text: {
                en: 'Save',
                fr: 'Sauvegarder',
            },
            next: false,
        },
    },
});
