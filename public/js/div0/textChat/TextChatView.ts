///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="TextChatMessageRenderer.ts"/>
class TextChatView{
    private $j:any;

    constructor(j:any){
        this.$j = j;
        this.createListener();
    }

    public addMessage(data:any):void{
        console.log("adding message",data);
        new TextChatMessageRenderer(data, this.$j("#textChatMessagesList"), this.$j);
        this.scrollToBottom();
    }

    private createListener():void {
        this.$j("#sendTextMessageButton").click((event)=>this.onButtonClicked(event));
    }

    private scrollToBottom():void {
        var top:number = this.$j("#textChatMessagesList").scrollHeight;
        this.$j("#textChatMessagesList").scrollTop = top;
        console.log("top=",top);
    }

    private onButtonClicked(event:any):void{
        console.log("send button clicked");
        var message:string = this.$j("#textMessageInput").val();
        if(message == "" || message == undefined || message == null){
            console.error("empty message");
            alert("Message is empty");
        }
        else{
            EventBus.dispatchEvent("SEND_TEXT_MESSAGE_REQUEST",message);
            this.$j("#textMessageInput").val("");
        }
    }
}
