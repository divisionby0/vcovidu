///<reference path="SocketEvent.ts"/>
declare var io:any;
declare function require(name:string);
class SocketService {
    private url:string;
    private socket:any;
    private io:any;
    private userData:any;

    constructor(url:string, userData:any) {
        this.url = url;
        this.userData = userData;
        this.connect();
    }

    public connect():void {
        this.socket = io.connect(this.url, this.userData);
        //this.socket = io(this.url, {secure: false, rejectUnauthorized: false});

        console.log("socket server url="+this.url);

        this.socket.on('socketMessage', function (message) {
            console.log("on socketMessage msg=",message);
            if(message == "connectionComplete"){
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
    }

    public auth(name:string):void{
        this.socket.emit("auth", name);
    }


    private onAuthComplete():void {
        EventBus.dispatchEvent(SocketEvent.ON_AUTH_COMPLETE, null);
    }
}
