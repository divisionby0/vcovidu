///<reference path="ApplicationView.ts"/>
///<reference path="../user/Subscriber.ts"/>
///<reference path="../user/Publisher.ts"/>
///<reference path="../service/Service.ts"/>
///<reference path="../service/socket/SocketService.ts"/>
declare function isPublisher(value:string):boolean;
declare function createOpenVidu():any;
declare var config:any;
class ApplicationModel{

    private ver:string = "0.0.2";

    private view:ApplicationView;
    private service:Service;
    private socketService:SocketService;
    private socketServiceURL:string;
    private OV:any;

    private session:any;
    private userName:string;
    private userRole:string;
    private nickName:string;
    private sessionName:string;
    private subscriber:Subscriber;
    private publisher:Publisher;
    private videoResolution:string = "800x600";
    private token:any;

    constructor(view:ApplicationView, userName:string, userRole:string, sessionToConnect:string){
        console.log("AppModel ver="+this.ver);
        this.view=view;
        this.userRole = userRole;
        this.userName = userName;
        EventBus.addEventListener(Publisher.PUBLISHER_ELEMENT_CREATED, (element)=>this.onPublisherElementCreated(element));
        EventBus.addEventListener(Subscriber.SUBSCRIBER_ELEMENT_CREATED, (data)=>this.onSubscriberElementCreated(data));

        var isPublisher:boolean = this.userRole == "PUBLISHER";
        if(isPublisher){
            this.createSessionName();
        }
        else{
            this.sessionName = sessionToConnect;
        }

        this.parseConfig();
        this.createSocketService();
    }

    public loginRequest():void{
        console.log("loginRequest");
        this.service.login(this.userName);
    }
    public logoutRequest():void{
        this.service.logout();
    }

    private joinRequest():void{
        this.OV = createOpenVidu();

        this.session = this.OV.initSession();

        this.service.setSession(this.session);
        this.service.connect(this.token, this.userName);
    }

    public joinComplete(token:any):void{
        console.log("join complete");
        this.view.joinComplete(this.sessionName);

        var isPublisher:boolean = this.userRole=="PUBLISHER";

        if(isPublisher){
            this.createPublisher();

            this.service.startPublish(this.publisher.getPublisher());
        }
        else{
            console.log("is subscriber");
            this.view.initMainVideoThumbnail(); // Show SUBSCRIBER message in main video

            //TODO проверить это предположение а также проверить это https://openvidu.io/docs/cheatsheet/subscribe-unsubscribe/
            //this.service.connect(token, this.userName);
        }
    }

    private createService(session:any = null):void {
        this.service = new Service(session);
        EventBus.addEventListener(Service.STREAM_CREATED, (data)=>this.onStreamCreated(data));
        EventBus.addEventListener(Service.STREAM_DESTROYED, (data)=>this.onStreamDestroyed(data));
        EventBus.addEventListener(Service.ON_LOG_OUT,(response)=>this.onLogOut(response));
        EventBus.addEventListener(Service.LOGIN_RESPONSE,(data)=>this.onLogInResponse(data));
        EventBus.addEventListener(Service.GET_TOKEN_RESPONSE,(response)=>this.getTokenResponse(response));
        EventBus.addEventListener(Service.REMOVE_USER_RESPONSE, (response)=>this.onRemoveUserResponse(response));
    }

    private onStreamCreated(data:any):void {
        var session:any = data.session;
        var stream:any = data.stream;
        this.createSubscriber(session, stream);
    }
    private createSubscriber(session:any, stream:any):void{
        this.subscriber = new Subscriber(session, stream);
    }

    private createPublisher():void{
        this.publisher = new Publisher(this.OV, this.videoResolution);
    }

    private onStreamDestroyed(connection:any):void {
        this.view.removeUserData(connection);
    }

    private onLogOut(response):void {
        this.view.onLogOut();
    }

    private onLogInResponse(data:any):void {
        this.view.onLogIn(this.sessionName, this.userName, this.nickName);
        this.service.getToken(this.sessionName, this.userRole);
        //this.socketService.auth(this.userName);
    }

    private onRemoveUserResponse(response:any):void{
        console.log("onRemoveUserResponse response=",response);
    }

    private onPublisherElementCreated(element:any):void {
        var userData = {nickName: this.userName, userName: this.userName};
        this.view.initMainVideo(element, userData);

        //var element:any = data.element;
        this.view.appendUserData(element, userData);
    }

    private onSubscriberElementCreated(data:any):void {
        console.log("onSubscriberElementCreated data=",data);
        this.view.appendUserData(data.element, data.connection);
    }

    private parseConfig():void {
        this.videoResolution = config.resolution;
        this.socketServiceURL = config.socketServiceURL;
    }

    private createSocketService():void {
        //EventBus.addEventListener(SocketEvent.ON_AUTH_COMPLETE, ()=>this.onAuthComplete());
        EventBus.addEventListener(SocketEvent.ON_SOCKET_CONNECTED, ()=>this.onSocketConnected());

        this.socketService = new SocketService(this.socketServiceURL,{query:"userData="+this.userName});
    }

    private onAuthComplete():void {
        console.log("onAuthComplete(). removing listener SocketEvent.ON_AUTH_COMPLETE");
        EventBus.removeEventListener(SocketEvent.ON_AUTH_COMPLETE, ()=>this.onAuthComplete());
       // this.service.getToken(this.sessionName, this.userRole);
    }
    private getTokenResponse(response:any):void{
        this.token = response[0];
        //EventBus.removeEventListener(Service.GET_TOKEN_RESPONSE,this.getTokenResponse(response));
        this.joinRequest();
    }
    private createSessionName():void{
        this.sessionName = this.userName+"__";
    }

    private onSocketConnected():void {
        this.createService();
        this.loginRequest();
    }
}
