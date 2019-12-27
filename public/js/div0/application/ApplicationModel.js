///<reference path="ApplicationView.ts"/>
///<reference path="../user/Subscriber.ts"/>
///<reference path="../user/Publisher.ts"/>
///<reference path="../service/Service.ts"/>
///<reference path="../service/socket/SocketService.ts"/>
var ApplicationModel = (function () {
    function ApplicationModel(view, userName, userRole, sessionToConnect) {
        var _this = this;
        this.ver = "0.0.2";
        this.videoResolution = "800x600";
        console.log("AppModel ver=" + this.ver);
        this.view = view;
        this.userRole = userRole;
        this.userName = userName;
        EventBus.addEventListener(Publisher.PUBLISHER_ELEMENT_CREATED, function (element) { return _this.onPublisherElementCreated(element); });
        EventBus.addEventListener(Subscriber.SUBSCRIBER_ELEMENT_CREATED, function (data) { return _this.onSubscriberElementCreated(data); });
        var isPublisher = this.userRole == "PUBLISHER";
        if (isPublisher) {
            this.createSessionName();
        }
        else {
            this.sessionName = sessionToConnect;
        }
        this.parseConfig();
        this.createSocketService();
    }
    ApplicationModel.prototype.loginRequest = function () {
        console.log("loginRequest");
        this.service.login(this.userName);
    };
    ApplicationModel.prototype.logoutRequest = function () {
        this.service.logout();
    };
    ApplicationModel.prototype.joinRequest = function () {
        this.OV = createOpenVidu();
        this.session = this.OV.initSession();
        this.service.setSession(this.session);
        this.service.connect(this.token, this.userName);
    };
    ApplicationModel.prototype.joinComplete = function (token) {
        console.log("join complete");
        this.view.joinComplete(this.sessionName);
        var isPublisher = this.userRole == "PUBLISHER";
        if (isPublisher) {
            this.createPublisher();
            this.service.startPublish(this.publisher.getPublisher());
        }
        else {
            console.log("is subscriber");
            this.view.initMainVideoThumbnail(); // Show SUBSCRIBER message in main video
        }
    };
    ApplicationModel.prototype.createService = function (session) {
        var _this = this;
        if (session === void 0) { session = null; }
        this.service = new Service(session);
        EventBus.addEventListener(Service.STREAM_CREATED, function (data) { return _this.onStreamCreated(data); });
        EventBus.addEventListener(Service.STREAM_DESTROYED, function (data) { return _this.onStreamDestroyed(data); });
        EventBus.addEventListener(Service.ON_LOG_OUT, function (response) { return _this.onLogOut(response); });
        EventBus.addEventListener(Service.LOGIN_RESPONSE, function (data) { return _this.onLogInResponse(data); });
        EventBus.addEventListener(Service.GET_TOKEN_RESPONSE, function (response) { return _this.getTokenResponse(response); });
        EventBus.addEventListener(Service.REMOVE_USER_RESPONSE, function (response) { return _this.onRemoveUserResponse(response); });
    };
    ApplicationModel.prototype.onStreamCreated = function (data) {
        var session = data.session;
        var stream = data.stream;
        this.createSubscriber(session, stream);
    };
    ApplicationModel.prototype.createSubscriber = function (session, stream) {
        this.subscriber = new Subscriber(session, stream);
    };
    ApplicationModel.prototype.createPublisher = function () {
        this.publisher = new Publisher(this.OV, this.videoResolution);
    };
    ApplicationModel.prototype.onStreamDestroyed = function (connection) {
        this.view.removeUserData(connection);
    };
    ApplicationModel.prototype.onLogOut = function (response) {
        this.view.onLogOut();
    };
    ApplicationModel.prototype.onLogInResponse = function (data) {
        this.view.onLogIn(this.sessionName, this.userName, this.nickName);
        this.service.getToken(this.sessionName, this.userRole);
        //this.socketService.auth(this.userName);
    };
    ApplicationModel.prototype.onRemoveUserResponse = function (response) {
        console.log("onRemoveUserResponse response=", response);
    };
    ApplicationModel.prototype.onPublisherElementCreated = function (element) {
        var userData = { nickName: this.userName, userName: this.userName };
        this.view.initMainVideo(element, userData);
        //var element:any = data.element;
        this.view.appendUserData(element, userData);
    };
    ApplicationModel.prototype.onSubscriberElementCreated = function (data) {
        console.log("onSubscriberElementCreated data=", data);
        this.view.appendUserData(data.element, data.connection);
    };
    ApplicationModel.prototype.parseConfig = function () {
        this.videoResolution = config.resolution;
        this.socketServiceURL = config.socketServiceURL;
    };
    ApplicationModel.prototype.createSocketService = function () {
        var _this = this;
        //EventBus.addEventListener(SocketEvent.ON_AUTH_COMPLETE, ()=>this.onAuthComplete());
        EventBus.addEventListener(SocketEvent.ON_SOCKET_CONNECTED, function () { return _this.onSocketConnected(); });
        this.socketService = new SocketService(this.socketServiceURL, { query: "userData=" + this.userName });
    };
    ApplicationModel.prototype.onAuthComplete = function () {
        var _this = this;
        console.log("onAuthComplete(). removing listener SocketEvent.ON_AUTH_COMPLETE");
        EventBus.removeEventListener(SocketEvent.ON_AUTH_COMPLETE, function () { return _this.onAuthComplete(); });
        // this.service.getToken(this.sessionName, this.userRole);
    };
    ApplicationModel.prototype.getTokenResponse = function (response) {
        this.token = response[0];
        //EventBus.removeEventListener(Service.GET_TOKEN_RESPONSE,this.getTokenResponse(response));
        this.joinRequest();
    };
    ApplicationModel.prototype.createSessionName = function () {
        this.sessionName = this.userName + "__";
    };
    ApplicationModel.prototype.onSocketConnected = function () {
        this.createService();
        this.loginRequest();
    };
    return ApplicationModel;
}());
//# sourceMappingURL=ApplicationModel.js.map