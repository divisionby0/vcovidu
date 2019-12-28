///<reference path="TextChatEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var TextChatService = (function () {
    function TextChatService(session) {
        this.channel = "defaultChannel";
        console.log("TextChatService session=", session);
        this.session = session;
        this.createSessionListener();
    }
    TextChatService.prototype.setChannel = function (channel) {
        this.channel = channel;
    };
    TextChatService.prototype.sendTextChatMessage = function (message) {
        this.session.signal({
            data: message,
            to: [],
            type: this.channel // The type of message (optional)
        })
            .then(function () {
            console.log("Message '" + message + "' successfully sent");
        })
            .catch(function (error) {
            console.error(error);
        });
    };
    TextChatService.prototype.createSessionListener = function () {
        console.log(" TextChatService createListener");
        var signal = 'signal:' + this.channel;
        console.log("signal = " + signal);
        this.session.on(signal, function (event) {
            EventBus.dispatchEvent(TextChatEvent.ON_NEW_TEXT_CHAT_MESSAGE, { from: event.from, message: event.data });
        });
    };
    return TextChatService;
}());
//# sourceMappingURL=TextChatService.js.map