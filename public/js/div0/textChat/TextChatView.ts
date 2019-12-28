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
        new TextChatMessageRenderer(data, this.$j("#textMessagesContainer"), this.$j);
        this.scrollToBottom();
    }

    private createListener():void {
        this.$j("#sendTextMessageButton").click((event)=>this.onSendButtonClicked(event));
        this.$j('#textMessageInput').on('keyup', (event)=>this.onInputKeyUp(event));
    }

    private onInputKeyUp(event):boolean{
        if (event.keyCode === 13) {
            this.sendMessage();
            event.preventDefault();
            return false;
        }
        return true;
    }

    private scrollToBottom():void {
        this.$j("#textMessagesContainer").scrollTop(this.$j("#textMessagesContainer")[0].scrollHeight);
    }

    private onSendButtonClicked(event:any):void{
        this.sendMessage();
    }

    private sendMessage():void{
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
