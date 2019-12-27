class TextChatMessageRenderer{
    private messageData:any;
    private parentElement:any;
    private $j:any;

    constructor(messageData:any, parentElement:any, $j:any){
        this.messageData = messageData;
        this.parentElement = parentElement;
        this.$j = $j;
        this.createChildren();
    }

    private createChildren():void {
        var sender:string = this.messageData.clientData;
        var message:string = this.messageData.message;

        var d:any = new Date();
        var nowTime:string = d.toLocaleTimeString();

        var fromContainer:any = this.$j("<div class='col-md-3'>"+sender+" : "+nowTime+"</div>");
        var messageContainer:any = this.$j("<div class='col-md-9'>"+message+"</div>");
        var container:any = this.$j("<div class='row textChatMessageRenderer'></div>");

        fromContainer.appendTo(container);
        messageContainer.appendTo(container);

        container.appendTo(this.parentElement);
    }
}
