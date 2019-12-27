///<reference path="../../lib/events/EventBus.ts"/>
var Publisher = (function () {
    function Publisher(OV, videoResolution) {
        this.publisher = OV.initPublisher('video-container', {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: videoResolution,
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false // Whether to mirror your local video or not
        });
        this.publisher.on('videoElementCreated', function (event) {
            console.log('this.publisher.on("videoElementCreated" event=', event);
            var element = event.element;
            console.log("element=", element);
            EventBus.dispatchEvent(Publisher.PUBLISHER_ELEMENT_CREATED, element);
        });
    }
    Publisher.prototype.getPublisher = function () {
        return this.publisher;
    };
    Publisher.PUBLISHER_ELEMENT_CREATED = "PUBLISHER_ELEMENT_CREATED";
    return Publisher;
}());
//# sourceMappingURL=Publisher.js.map