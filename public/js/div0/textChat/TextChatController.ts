///<reference path="TextChatModel.ts"/>
class TextChatController{
    private model:TextChatModel;

    constructor(model:TextChatModel){
        this.model = model;
        EventBus.addEventListener("ON_NEW_TEXT_CHAT_MESSAGE", (data)=>this.onNewTextChatMessage(data));
    }

    private onNewTextChatMessage(data:any):void{
        this.model.onNewMessage(data);
    }
}
