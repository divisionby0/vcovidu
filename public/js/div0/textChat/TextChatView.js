///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="TextChatMessageRenderer.ts"/>
var TextChatView = (function () {
    function TextChatView(j) {
        this.$j = j;
        this.createListener();
    }
    TextChatView.prototype.addMessage = function (data) {
        console.log("adding message", data);
        new TextChatMessageRenderer(data, this.$j("#textChatMessagesList"), this.$j);
        this.scrollToBottom();
    };
    TextChatView.prototype.createListener = function () {
        var _this = this;
        this.$j("#sendTextMessageButton").click(function (event) { return _this.onButtonClicked(event); });
    };
    TextChatView.prototype.scrollToBottom = function () {
        var top = this.$j("#textChatMessagesList").scrollHeight;
        this.$j("#textChatMessagesList").scrollTop = top;
        console.log("top=", top);
    };
    TextChatView.prototype.onButtonClicked = function (event) {
        console.log("send button clicked");
        var message = this.$j("#textMessageInput").val();
        if (message == "" || message == undefined || message == null) {
            console.error("empty message");
            alert("Message is empty");
        }
        else {
            EventBus.dispatchEvent("SEND_TEXT_MESSAGE_REQUEST", message);
            this.$j("#textMessageInput").val("");
        }
    };
    return TextChatView;
}());
//# sourceMappingURL=TextChatView.js.map