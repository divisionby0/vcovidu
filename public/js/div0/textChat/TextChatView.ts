///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="TextChatMessageRenderer.ts"/>
///<reference path="TextChatEvent.ts"/>
class TextChatView{
    private $j:any;

    constructor(j:any){
        this.$j = j;
        this.createListener();
    }

    public addMessage(data:any):void{
        console.log("adding message",data);
        new TextChatMessageRenderer(data, this.$j("#textMessagesContainer"), this.$j);
        this.scrollToBottom();
    }

    private createListener():void {
        this.$j("#sendTextMessageButton").click((event)=>this.onButtonClicked(event));
    }

    private scrollToBottom():void {
        this.$j("#textMessagesContainer").scrollTop(this.$j("#textMessagesContainer")[0].scrollHeight);
    }

    private onButtonClicked(event:any):void{
        var message:string = this.$j("#textMessageInput").val();
        if(message == "" || message == undefined || message == null){
            console.error("empty message");
            alert("Message is empty");
        }
        else{
            EventBus.dispatchEvent(TextChatEvent.SEND_TEXT_CHAT_MESSAGE,message);
            this.$j("#textMessageInput").val("");
        }
    }
}
