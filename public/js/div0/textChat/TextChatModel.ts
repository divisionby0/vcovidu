///<reference path="TextChatView.ts"/>
class TextChatModel{
    private view:TextChatView;

    constructor(view:TextChatView){
        this.view = view;
    }

    public onNewMessage(data:any):void{
        var message:any = this.parseMessage(data);
        this.view.addMessage(message);
    }

    private parseMessage(data:any):any{
        var fromString:string = data.from.data;
        fromString = fromString.replace("%/%",",");
        var clientData:any;
        var serverData:any;
        var strings:string[] = fromString.split(",");
        clientData = JSON.parse(strings[0]).clientData;
        //serverData = JSON.parse(strings[1]).serverData;

        return {clientData:clientData, message:data.message};
    }
}
