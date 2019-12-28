///<reference path="TextChatEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class TextChatService{
    private session:any;
    private channel:string = "defaultChannel";

    constructor(session){
        console.log("TextChatService session=",session);
        this.session = session;
        this.createSessionListener();
    }
    public setChannel(channel:string):void{
        this.channel = channel;
    }
    public sendTextChatMessage(message:string):void{
        this.session.signal({
            data: message,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: this.channel          // The type of message (optional)
        })
            .then(() => {
                console.log("Message '"+message+"' successfully sent");
            })
            .catch(error => {
                console.error(error);
            });
    }

    private createSessionListener():void {
        console.log(" TextChatService createListener");
        var signal:string = 'signal:'+this.channel;
        console.log("signal = "+signal);

        this.session.on(signal, (event) => {
            EventBus.dispatchEvent(TextChatEvent.ON_NEW_TEXT_CHAT_MESSAGE, {from:event.from, message:event.data});
        });
    }
}
