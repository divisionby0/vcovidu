var TextChatMessageRenderer = (function () {
    function TextChatMessageRenderer(messageData, parentElement, $j) {
        this.messageData = messageData;
        this.parentElement = parentElement;
        this.$j = $j;
        this.createChildren();
    }
    TextChatMessageRenderer.prototype.createChildren = function () {
        var sender = this.messageData.clientData;
        var message = this.messageData.message;
        var d = new Date();
        var nowTime = d.toLocaleTimeString();
        var container = this.$j("<tr></tr>");
        var image = this.$j("<td><img src='http://via.placeholder.com/50x50?text=A'></td>");
        var text = this.$j("<td>" + message + "</td>");
        var date = this.$j("<td>" + nowTime + "</td>");
        /*
        var fromContainer:any = this.$j("<div class='col-md-3'>"+sender+" : "+nowTime+"</div>");
        var messageContainer:any = this.$j("<div class='col-md-9'>"+message+"</div>");
        var container:any = this.$j("<div class='row textChatMessageRenderer'></div>");

        fromContainer.appendTo(container);
        messageContainer.appendTo(container);
        */
        image.appendTo(container);
        text.appendTo(container);
        date.appendTo(container);
        container.appendTo(this.parentElement);
    };
    return TextChatMessageRenderer;
}());
//# sourceMappingURL=TextChatMessageRenderer.js.map