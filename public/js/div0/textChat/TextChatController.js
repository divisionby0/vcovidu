///<reference path="TextChatModel.ts"/>
var TextChatController = (function () {
    function TextChatController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener(TextChatEvent.SEND_TEXT_CHAT_MESSAGE, function (message) { return _this.onSendMessageRequest(message); });
        EventBus.addEventListener(TextChatEvent.ON_NEW_TEXT_CHAT_MESSAGE, function (data) { return _this.onNewTextChatMessage(data); });
    }
    TextChatController.prototype.onNewTextChatMessage = function (data) {
        this.model.onNewMessage(data);
    };
    TextChatController.prototype.onSendMessageRequest = function (message) {
        this.model.sendMessage(message);
    };
    return TextChatController;
}());
//# sourceMappingURL=TextChatController.js.map