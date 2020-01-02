"use strict";
var EventBus = require("../events/EventBus");
var SocketServer = (function () {
    function SocketServer(currentDir) {
        var _this = this;
        this.ver = "0.1.1";
        this.port = 4433;
        console.log("Socket server init " + this.ver);
        var fs = require('fs');
        var https = require('https');
        var express = require('express');
        var app = express();
        var options = {
            key: fs.readFileSync(currentDir + '/openvidukey.pem'),
            cert: fs.readFileSync(currentDir + '/openviducert.pem')
        };
        //var serverPort = 443;
        var server = https.createServer(options, app);
        this.io = require('socket.io')(server);
        server.listen(this.port, function () { return _this.connectionListener(); });
        this.createListener();
    }
    SocketServer.prototype.onAuthComplete = function (socketId) {
        var currentSocket = this.io.sockets.connected[socketId];
        if (currentSocket != null && currentSocket != undefined) {
            currentSocket.emit("onAuthComplete");
        }
        else {
            console.log("socket by id " + socketId + " not found");
        }
    };
    SocketServer.prototype.connectionListener = function () {
        console.log('socket server up and running at ' + this.port + ' port');
    };
    SocketServer.prototype.createListener = function () {
        var _this = this;
        this.io.sockets.on('connection', function (socket) { return _this.onClientConnected(socket); });
    };
    SocketServer.prototype.onClientConnected = function (socket) {
        var _this = this;
        this.socket = socket;
        var socketId = socket.id;
        console.log("\nsocket connected id=" + socketId);
        var data = socket.handshake.query;
        var userName = data.userData;
        console.log("userName = ", userName);
        EventBus.dispatchEvent(SocketServer.ON_CLIENT_CONNECTED, { name: userName, socketId: this.socket.id, socket: socket });
        //socket.on("auth", (msg, socket)=>this.onAuth(msg, socket));
        socket.on("send message", function (sent_msg, callback) { return _this.sendMessage(sent_msg, callback); });
        socket.on('disconnect', function () { return _this.onClientDisconnected(socketId); });
        socket.emit("socketMessage", "connectionComplete");
    };
    SocketServer.prototype.onAuth = function (msg, socket) {
        console.log("onAuth msg=" + msg + " socket=", socket);
        EventBus.dispatchEvent(SocketServer.ON_CLIENT_AUTH, { name: msg, socketId: this.socket.id, socket: socket });
        //socket.emit("onAuthComplete");
    };
    SocketServer.prototype.sendMessage = function (msg, callback) {
        this.io.sockets.emit("new message", msg);
        callback();
    };
    SocketServer.prototype.onClientDisconnected = function (socketId) {
        EventBus.dispatchEvent(SocketServer.ON_CLIENT_DISCONNECTED, socketId);
        this.io.sockets.emit("newMessage", JSON.stringify({ 'type': 'onClientDisconnected', 'data': socketId }));
    };
    SocketServer.ON_CLIENT_DISCONNECTED = "ON_CLIENT_DISCONNECTED";
    SocketServer.ON_CLIENT_CONNECTED = "ON_CLIENT_CONNECTED";
    SocketServer.ON_CLIENT_AUTH = "ON_CLIENT_AUTH";
    return SocketServer;
}());
module.exports = SocketServer;
//# sourceMappingURL=SocketServer.js.map