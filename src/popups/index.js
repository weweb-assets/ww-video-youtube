import './stories';

// youtube
// https://www.youtube.com/watch?v=76CMCIW-wGk
// twitch
// https://www.twitch.tv/videos/756569491
// vimeo
// https://vimeo.com/76979871
// dailymotion
// https://www.dailymotion.com/video/x7wq7ux?playlist=x5nmbq

const getInfoFromUrl = url => {
    if (url.indexOf('youtube.com') !== -1) {
        return {
            provider: 'youtube',
            id: url.split('v=')[1].split('?')[0],
        };
    } else if (url.indexOf('youtu.be') !== -1) {
        return {
            provider: 'youtube',
            id: url.split('be/')[1].split('?')[0],
        };
    } else if (url.indexOf('vimeo.com') !== -1) {
        return {
            provider: 'vimeo',
            id: url.split('m/')[1].split('?')[0],
        };
    } else if (url.indexOf('dailymotion.com') !== -1) {
        return {
            provider: 'dailymotion',
            id: url.split('video/')[1].split('?')[0],
        };
    } else if (url.indexOf('twitch.tv') !== -1) {
        return {
            provider: 'twitch',
            id: url.split('tv/videos/')[1].split('?')[0],
        };
    } else {
        return {
            provider: 'other',
            id: url,
        };
    }
};

export default async function openPopup(content) {
    try {
        const options = {
            firstPage: 'WWVIDEO_EDIT',
            data: { ...content },
        };
        const result = await wwLib.wwPopups.open(options);
        return { ...result, ...getInfoFromUrl(result.url || content.url) };
    } catch (err) {
        wwLib.wwLog.error(err);
        return null;
    }
}
