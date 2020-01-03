///<reference path="SocketEvent.ts"/>
var SocketService = (function () {
    function SocketService(url, userData) {
        this.url = url;
        this.userData = userData;
        this.connect();
    }
    SocketService.prototype.connect = function () {
        this.socket = io.connect(this.url, this.userData);
        //this.socket = io(this.url, {secure: false, rejectUnauthorized: false});
        console.log("socket server url=" + this.url);
        this.socket.on('socketMessage', function (message) {
            console.log("on socketMessage msg=", message);
            if (message == "connectionComplete") {
                EventBus.dispatchEvent(SocketEvent.ON_SOCKET_CONNECTED, null);
            }
        });
        this.socket.on('connect', function () {
            console.log("connected to socket server");
        });
        this.socket.on("newMessage", function (msg) {
            console.log("onNewSocketMessage msg=", msg);
        });
        this.socket.on("newMessage", function (msg) {
            console.log("onNewSocketMessage msg=", msg);
        });
        //this.socket.on("onAuthComplete", ()=>this.onAuthComplete());
    };
    SocketService.prototype.auth = function (name) {
        this.socket.emit("auth", name);
    };
    SocketService.prototype.onAuthComplete = function () {
        EventBus.dispatchEvent(SocketEvent.ON_AUTH_COMPLETE, null);
    };
    return SocketService;
}());
//# sourceMappingURL=SocketService.js.map