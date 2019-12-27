///<reference path="TextChatView.ts"/>
var TextChatModel = (function () {
    function TextChatModel(view) {
        this.view = view;
    }
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
        //serverData = JSON.parse(strings[1]).serverData;
        return { clientData: clientData, message: data.message };
    };
    return TextChatModel;
}());
//# sourceMappingURL=TextChatModel.js.map