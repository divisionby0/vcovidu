"use strict";
var Client = (function () {
    function Client(userName, socket) {
        this.status = Client.JOINING;
        this.userName = userName;
        this.socket = socket;
        //this.socket.on('disconnect',()=>this.onClientDisconnected());
    }
    Client.prototype.getName = function () {
        return this.userName;
    };
    Client.prototype.setSessionName = function (value) {
        this.sessionName = value;
    };
    Client.prototype.getSessionName = function () {
        return this.sessionName;
    };
    Client.prototype.setToken = function (token) {
        console.log("[Client] setToken ", token);
        this.token = token;
    };
    Client.prototype.getToken = function () {
        return this.token;
    };
    Client.prototype.isNameEquals = function (value) {
        return this.userName === value;
    };
    Client.prototype.getSessionId = function () {
        return this.session.id;
    };
    Client.prototype.setSession = function (session) {
        this.session = session;
    };
    Client.prototype.getSession = function () {
        return this.session;
    };
    Client.JOINING = "JOINING";
    Client.PUBLISHING = "PUBLISHING";
    Client.SUBSCRIBING = "SUBSCRIBING";
    Client.CHATTING = "CHATTING";
    return Client;
}());
module.exports = Client;
//# sourceMappingURL=Client.js.map