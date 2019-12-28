///<reference path="TextChatView.ts"/>
///<reference path="TextChatService.ts"/>
class TextChatModel{
    private view:TextChatView;
    private session:any;
    private service:TextChatService;

    constructor(view:TextChatView, session:string){
        this.view = view;
        this.session = session;
        console.log("TextChatModel session=",session);
        this.service = new TextChatService(this.session);
    }

    public sendMessage(message:string):void{
        this.service.sendTextChatMessage(message);
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

        return {clientData:clientData, message:data.message};
    }
}
