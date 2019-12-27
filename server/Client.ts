//import EventBus = require("./events/EventBus");
import SocketServer = require("./socketServer/SocketServer");
class Client{
    public static JOINING:string = "JOINING";
    public static PUBLISHING:string = "PUBLISHING";
    public static SUBSCRIBING:string = "SUBSCRIBING";
    public static CHATTING:string = "CHATTING";

    private userName:string;
    private status:string = Client.JOINING;
    private session:any;
    private sessionName:string;
    private socket:any;
    private token:any;

    constructor(userName:string, socket:any){
        this.userName = userName;
        this.socket = socket;
        //this.socket.on('disconnect',()=>this.onClientDisconnected());
    }

    public getName():string{
        return this.userName;
    }

    public setSessionName(value:string):void{
        this.sessionName = value;
    }
    public getSessionName():string{
        return this.sessionName;
    }

    public setToken(token:any):void{
        console.log("[Client] setToken ",token);
        this.token = token;
    }
    public getToken():any{
        return this.token;
    }

    public isNameEquals(value:string):boolean{
        return this.userName === value;
    }

    public getSessionId():string{
        return this.session.id;
    }

    public setSession(session:any):void{
        this.session = session;
    }
    public getSession():any{
        return this.session;
    }

    /*
    private onClientDisconnected():void {
        var socketId:string = this.socket.id;
        EventBus.dispatchEvent(SocketServer.ON_CLIENT_DISCONNECTED, socketId);
    }
    */
}
export = Client;
