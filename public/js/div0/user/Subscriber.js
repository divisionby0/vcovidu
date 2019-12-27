///<reference path="../../lib/events/EventBus.ts"/>
var Subscriber = (function () {
    function Subscriber(session, stream) {
        var _this = this;
        this.subscriber = session.subscribe(stream, 'video-container');
        this.subscriber.on('videoElementCreated', function (event) { return _this.onElementCreated(event); });
    }
    Subscriber.prototype.onElementCreated = function (event) {
        console.log("Subscriber onElementCreated event=", event);
        var element = event.element;
        console.log("element=", element);
        var connection = this.subscriber.stream.connection;
        EventBus.dispatchEvent(Subscriber.SUBSCRIBER_ELEMENT_CREATED, { element: element, connection: connection });
    };
    Subscriber.SUBSCRIBER_ELEMENT_CREATED = "SUBSCRIBER_ELEMENT_CREATED";
    return Subscriber;
}());
//# sourceMappingURL=Subscriber.js.map