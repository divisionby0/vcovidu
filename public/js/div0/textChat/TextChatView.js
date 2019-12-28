///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="TextChatMessageRenderer.ts"/>
///<reference path="TextChatEvent.ts"/>
var TextChatView = (function () {
    function TextChatView(j) {
        this.$j = j;
        this.createListener();
    }
    TextChatView.prototype.addMessage = function (data) {
        console.log("adding message", data);
        new TextChatMessageRenderer(data, this.$j("#textMessagesContainer"), this.$j);
        this.scrollToBottom();
    };
    TextChatView.prototype.createListener = function () {
        var _this = this;
        this.$j("#sendTextMessageButton").click(function (event) { return _this.onButtonClicked(event); });
    };
    TextChatView.prototype.scrollToBottom = function () {
        this.$j("#textMessagesContainer").scrollTop(this.$j("#textMessagesContainer")[0].scrollHeight);
    };
    TextChatView.prototype.onButtonClicked = function (event) {
        var message = this.$j("#textMessageInput").val();
        if (message == "" || message == undefined || message == null) {
            console.error("empty message");
            alert("Message is empty");
        }
        else {
            EventBus.dispatchEvent(TextChatEvent.SEND_TEXT_CHAT_MESSAGE, message);
            this.$j("#textMessageInput").val("");
        }
    };
    return TextChatView;
}());
//# sourceMappingURL=TextChatView.js.map