///<reference path="../../lib/events/EventBus.ts"/>
class Publisher{
    public static PUBLISHER_ELEMENT_CREATED:string = "PUBLISHER_ELEMENT_CREATED";
    private publisher:any;

    constructor(OV:any, videoResolution:string){
        this.publisher = OV.initPublisher('video-container', {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
            publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
            resolution: videoResolution,  // The resolution of your video
            frameRate: 30,			// The frame rate of your video
            insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
            mirror: false       	// Whether to mirror your local video or not
        });


        this.publisher.on('videoElementCreated', (event) => {
            console.log('this.publisher.on("videoElementCreated" event=',event);
            var element:any = event.element;
            console.log("element=",element);
            EventBus.dispatchEvent(Publisher.PUBLISHER_ELEMENT_CREATED, element);
        });
    }

    public getPublisher():any{
        return this.publisher;
    }
}
