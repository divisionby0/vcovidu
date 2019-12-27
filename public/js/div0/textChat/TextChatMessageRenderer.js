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
        var fromContainer = this.$j("<div class='col-md-3'>" + sender + " : " + nowTime + "</div>");
        var messageContainer = this.$j("<div class='col-md-9'>" + message + "</div>");
        var container = this.$j("<div class='row textChatMessageRenderer'></div>");
        fromContainer.appendTo(container);
        messageContainer.appendTo(container);
        container.appendTo(this.parentElement);
    };
    return TextChatMessageRenderer;
}());
//# sourceMappingURL=TextChatMessageRenderer.js.map