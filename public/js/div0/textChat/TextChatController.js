///<reference path="TextChatModel.ts"/>
var TextChatController = (function () {
    function TextChatController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener("ON_NEW_TEXT_CHAT_MESSAGE", function (data) { return _this.onNewTextChatMessage(data); });
    }
    TextChatController.prototype.onNewTextChatMessage = function (data) {
        this.model.onNewMessage(data);
    };
    return TextChatController;
}());
//# sourceMappingURL=TextChatController.js.map