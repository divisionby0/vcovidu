import EventBus = require("../events/EventBus");
class SocketServer{
    public static ON_CLIENT_DISCONNECTED:string = "ON_CLIENT_DISCONNECTED";
    public static ON_CLIENT_CONNECTED:string = "ON_CLIENT_CONNECTED";
    public static ON_CLIENT_AUTH:string = "ON_CLIENT_AUTH";
    private ver:string = "0.1.1";

    private fs:any;
    private port:number = 4433;
    private io:any;
    private socket:any;

    constructor(currentDir:string){
        console.log("Socket server init "+this.ver);
        var fs = require('fs');
        var https = require('https');

        var express = require('express');
        var app = express();

        var options = {
            key: fs.readFileSync(currentDir+'/openvidukey.pem'),
            cert: fs.readFileSync(currentDir+'/openviducert.pem')
        };

        var server = https.createServer(options, app);
        this.io = require('socket.io')(server, {origins: '*:*'});

        server.listen(this.port, ()=>this.connectionListener());

        this.createListener();
    }

    public onAuthComplete(socketId:string):void{
        var currentSocket:any = this.io.sockets.connected[socketId];
        if(currentSocket!=null && currentSocket!=undefined){
            currentSocket.emit("onAuthComplete");
        }
        else{
            console.log("socket by id "+socketId+" not found");
        }
    }

    private connectionListener():void{
        console.log('socket server up and running at '+this.port+' port');
    }

    private createListener():void {
        this.io.sockets.on('connection', (socket)=>this.onClientConnected(socket));
    }

    private onClientConnected(socket:any):void{
        this.socket = socket;
        var socketId:string = socket.id;
        console.log("\nsocket connected id="+socketId);
        var data:any = socket.handshake.query;
        var userName:string = data.userData;
        console.log("userName = ",userName);

        EventBus.dispatchEvent(SocketServer.ON_CLIENT_CONNECTED, {name:userName, socketId:this.socket.id, socket:socket});

        //socket.on("auth", (msg, socket)=>this.onAuth(msg, socket));
        socket.on("send message", (sent_msg, callback)=>this.sendMessage(sent_msg, callback));
        socket.on('disconnect',()=>this.onClientDisconnected(socketId));

        socket.emit("socketMessage", "connectionComplete");
    }

    private onAuth(msg, socket:any):void{
        console.log("onAuth msg="+msg+" socket=",socket);
        EventBus.dispatchEvent(SocketServer.ON_CLIENT_AUTH, {name:msg, socketId:this.socket.id, socket:socket});
        //socket.emit("onAuthComplete");
    }

    private sendMessage(msg:string, callback:any):void{
        this.io.sockets.emit("new message", msg);
        callback();
    }

    private onClientDisconnected(socketId:string):void{
        EventBus.dispatchEvent(SocketServer.ON_CLIENT_DISCONNECTED, socketId);
        this.io.sockets.emit("newMessage", JSON.stringify({'type':'onClientDisconnected', 'data':socketId}));
    }
}
export = SocketServer;
