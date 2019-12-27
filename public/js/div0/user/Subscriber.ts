///<reference path="../../lib/events/EventBus.ts"/>
class Subscriber{
    public static SUBSCRIBER_ELEMENT_CREATED:string = "SUBSCRIBER_ELEMENT_CREATED";
    private subscriber:any;

    constructor(session:any, stream:any){
        this.subscriber = session.subscribe(stream, 'video-container');
        this.subscriber.on('videoElementCreated', (event) => this.onElementCreated(event));
    }

    private onElementCreated(event:any):void {
        console.log("Subscriber onElementCreated event=",event);
        var element:any = event.element;
        console.log("element=",element);
        var connection:any = this.subscriber.stream.connection;
        EventBus.dispatchEvent(Subscriber.SUBSCRIBER_ELEMENT_CREATED, {element:element, connection:connection});
    }
}
