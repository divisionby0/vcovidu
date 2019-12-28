///<reference path="TextChatView.ts"/>
///<reference path="TextChatService.ts"/>
var TextChatModel = (function () {
    function TextChatModel(view, session) {
        this.view = view;
        this.session = session;
        console.log("TextChatModel session=", session);
        this.service = new TextChatService(this.session);
    }
    TextChatModel.prototype.sendMessage = function (message) {
        this.service.sendTextChatMessage(message);
    };
    TextChatModel.prototype.onNewMessage = function (data) {
        var message = this.parseMessage(data);
        this.view.addMessage(message);
    };
    TextChatModel.prototype.parseMessage = function (data) {
        var fromString = data.from.data;
        fromString = fromString.replace("%/%", ",");
        var clientData;
        var serverData;
        var strings = fromString.split(",");
        clientData = JSON.parse(strings[0]).clientData;
        return { clientData: clientData, message: data.message };
    };
    return TextChatModel;
}());
//# sourceMappingURL=TextChatModel.js.map