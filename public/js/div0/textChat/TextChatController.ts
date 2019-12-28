///<reference path="TextChatModel.ts"/>
class TextChatController{
    private model:TextChatModel;

    constructor(model:TextChatModel){
        this.model = model;
        EventBus.addEventListener(TextChatEvent.SEND_TEXT_CHAT_MESSAGE, (message)=>this.onSendMessageRequest(message));
        EventBus.addEventListener(TextChatEvent.ON_NEW_TEXT_CHAT_MESSAGE, (data)=>this.onNewTextChatMessage(data));
    }

    private onNewTextChatMessage(data:any):void{
        this.model.onNewMessage(data);
    }

    private onSendMessageRequest(message:string):void {
        this.model.sendMessage(message);
    }
}
