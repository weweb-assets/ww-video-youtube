---
name: ww-video-youtube
description: A customizable YouTube video player component with autoplay, mute, loop, and control options, providing methods for video playback control and event triggering.
keywords:
  - youtube integration
  - video playback control
  - autoplay feature
  - muted video
  - video loop
  - video controls
  - youtube player api
  - video state events
  - video start time
  - property binding
---

#### ww-video-youtube

Renders a YouTube video player with configuration options and playback control methods.

Properties:
- url: string - YouTube video URL. Default: "https://www.youtube.com/watch?v=r8z4Omw-D2s"
- videoStartTime: number - Video start time in seconds. Default: 0
- autoplay: boolean - Enable autoplay. Default: false
- muted: boolean - Mute video. Default: false
- loop: boolean - Enable video loop. Default: false
- controls: boolean - Show video controls. Default: true

Children: none

Features:
- YouTube Player API integration
- Playback methods: playVideo(), pauseVideo(), seekTo(time)

Events:
- play: {value: number} - Triggered when video starts playing. Value is current time in seconds
- pause: {value: number} - Triggered when video is paused. Value is current time in seconds
- end: {value: number} - Triggered when video ends. Value is current time in seconds

Variables:
- Is Playing: boolean - Indicates if video is currently playing
- Current time: number - Current video playback time in seconds

Note: Do not set height to 0 : a combination of width to 100% & aspectRatio to 16/9 will ensure the video is displayed correctly.

Example:
<elements>
{"uid":0,"tag":"ww-video-youtube","name":"Demo Video","props":{"default":{"url":"https://www.youtube.com/watch?v=sAd8aYSBGGc","loop":false,"muted":true,"autoplay":true,"controls":false,"videoStartTime":20}},"styles":{"default":{"width":"100%","height":"auto","maxWidth":"800px","aspectRatio":"16/9"}}}
</elements>
