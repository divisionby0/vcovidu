///<reference path="../application/AppEvent.ts"/>
///<reference path="HttpPostRequest.ts"/>
declare var EventBus:any;
class Service{
    public static STREAM_CREATED:string = "STREAM_CREATED";
    public static STREAM_DESTROYED:string = "STREAM_DESTROYED";
    public static ON_LOG_OUT:string = "ON_LOG_OUT";
    public static LOGIN_RESPONSE:string = "LOGIN_RESPONSE";
    public static GET_TOKEN_RESPONSE:string = "GET_TOKEN_RESPONSE";
    public static REMOVE_USER_RESPONSE:string = "REMOVE_USER_RESPONSE";
    private session:any;

    constructor(session:any = null){
        if(this.session){
            this.session = session;
        }
    }
    public setSession(session:any):void{
        this.session = session;
        this.createSessionListeners();
    }

    public sendTextChatMessage(message:string):void{
        console.log("sending signal");
        this.session.signal({
            data: message,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'my-chat'             // The type of message (optional)
        })
            .then(() => {
                console.log("Message '"+message+"' successfully sent");
            })
            .catch(error => {
                console.error(error);
            });
    }
    public startPublish(publisher:any):void{
        this.session.publish(publisher);
    }

    public connect(token:any, userName:string):void{
        this.session.connect(token, { clientData: userName })
            .then(() => {
                EventBus.dispatchEvent(AppEvent.JOIN_COMPLETE, token);
        }).catch(error => {
                console.warn('There was an error connecting to the session: error.code=', error.code, "errorMessage",error.message);
        });
    }

    public getToken(sessionName:string, role:string):void{
        var request = new HttpPostRequest('api-sessions/get-token',{sessionName: sessionName, role:role},'HttpPostRequest of TOKEN gone WRONG:',(response)=>this.getTokenResponse(response));
        request.execute();
    }

    private getTokenResponse(response:any):void{
        /*
        чтобы быстрее написать и не переделывать BaseHttpRequest и HttpPostRequest на события вместо колбэков, сравниваю response с undefined
        */
         if(response!=undefined && response!=null){
             EventBus.dispatchEvent(Service.GET_TOKEN_RESPONSE, response);
         }
    }

    private leaveSession():void{

    }

    public login(user:string):void{
        var request = new HttpPostRequest('api-login/login',{user: user},'Login WRONG',(response)=>this.loginResponse(response));
        request.execute();
    }

    public logout():void{
        var request = new HttpPostRequest('api-login/logout',{},'Logout WRONG',(response)=>this.logoutResponse(response));
        request.execute();
    }

    private removeUser(sessionName:string, token:any):void{
        var request = new HttpPostRequest('api-sessions/remove-user',{sessionName: sessionName, token: token},'User couldn\'t be removed from session',(response)=>this.removeUserResponse(response));
        request.execute();
    }
    private startRecording():void{

    }
    private stopRecording():void{

    }

    private createSessionListeners():void {
        console.log("createSessionListeners() session=",this.session);

        // TODO проверить происходят ли эти события у подписчика
        this.session.on('streamCreated', (event) => this.onStreamCreated(event));
        this.session.on('streamDestroyed', (event) => this.onStreamDestroyed(event));

        /*
        this.session.on('signal:my-chat', (event) => {
            console.log(event.data); // Message
            console.log(event.from); // Connection object of the sender
            console.log(event.type); // The type of message ("my-chat")

            EventBus.dispatchEvent("ON_NEW_TEXT_CHAT_MESSAGE",{from:event.from,message:event.data});
        });
        */
    }

    private loginResponse(response:any):void{
        EventBus.dispatchEvent(Service.LOGIN_RESPONSE, response);
    }
    private logoutResponse(response):void{
        EventBus.dispatchEvent(Service.ON_LOG_OUT, response);
    }

    private onStreamDestroyed(event:any):void{
        var connection:any = event.stream.connection;
        EventBus.dispatchEvent(Service.STREAM_DESTROYED,connection);
        //view.removeUserData(event.stream.connection);
    }

    private onStreamCreated(event):void{
        EventBus.dispatchEvent(Service.STREAM_CREATED,{session:this.session, stream:event.stream});
        //var subscriber = this.session.subscribe(event.stream, 'video-container');
       // subscriber.on('videoElementCreated', (event) => this.onElementCreated(event));
    }

    private removeUserResponse(response:any):void {
        EventBus.dispatchEvent(Service.REMOVE_USER_RESPONSE, response);
    }
}
