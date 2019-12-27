///<reference path="../application/AppEvent.ts"/>
///<reference path="HttpPostRequest.ts"/>
var Service = (function () {
    function Service(session) {
        if (session === void 0) { session = null; }
        if (this.session) {
            this.session = session;
        }
    }
    Service.prototype.setSession = function (session) {
        this.session = session;
        this.createSessionListeners();
    };
    Service.prototype.sendTextChatMessage = function (message) {
        console.log("sending signal");
        this.session.signal({
            data: message,
            to: [],
            type: 'my-chat' // The type of message (optional)
        })
            .then(function () {
            console.log("Message '" + message + "' successfully sent");
        })
            .catch(function (error) {
            console.error(error);
        });
    };
    Service.prototype.startPublish = function (publisher) {
        this.session.publish(publisher);
    };
    Service.prototype.connect = function (token, userName) {
        this.session.connect(token, { clientData: userName })
            .then(function () {
            EventBus.dispatchEvent(AppEvent.JOIN_COMPLETE, token);
        }).catch(function (error) {
            console.warn('There was an error connecting to the session: error.code=', error.code, "errorMessage", error.message);
        });
    };
    Service.prototype.getToken = function (sessionName, role) {
        var _this = this;
        var request = new HttpPostRequest('api-sessions/get-token', { sessionName: sessionName, role: role }, 'HttpPostRequest of TOKEN gone WRONG:', function (response) { return _this.getTokenResponse(response); });
        request.execute();
    };
    Service.prototype.getTokenResponse = function (response) {
        /*
        чтобы быстрее написать и не переделывать BaseHttpRequest и HttpPostRequest на события вместо колбэков, сравниваю response с undefined
        */
        if (response != undefined && response != null) {
            EventBus.dispatchEvent(Service.GET_TOKEN_RESPONSE, response);
        }
    };
    Service.prototype.leaveSession = function () {
    };
    Service.prototype.login = function (user) {
        var _this = this;
        var request = new HttpPostRequest('api-login/login', { user: user }, 'Login WRONG', function (response) { return _this.loginResponse(response); });
        request.execute();
    };
    Service.prototype.logout = function () {
        var _this = this;
        var request = new HttpPostRequest('api-login/logout', {}, 'Logout WRONG', function (response) { return _this.logoutResponse(response); });
        request.execute();
    };
    Service.prototype.removeUser = function (sessionName, token) {
        var _this = this;
        var request = new HttpPostRequest('api-sessions/remove-user', { sessionName: sessionName, token: token }, 'User couldn\'t be removed from session', function (response) { return _this.removeUserResponse(response); });
        request.execute();
    };
    Service.prototype.startRecording = function () {
    };
    Service.prototype.stopRecording = function () {
    };
    Service.prototype.createSessionListeners = function () {
        var _this = this;
        console.log("createSessionListeners() session=", this.session);
        // TODO проверить происходят ли эти события у подписчика
        this.session.on('streamCreated', function (event) { return _this.onStreamCreated(event); });
        this.session.on('streamDestroyed', function (event) { return _this.onStreamDestroyed(event); });
        /*
        this.session.on('signal:my-chat', (event) => {
            console.log(event.data); // Message
            console.log(event.from); // Connection object of the sender
            console.log(event.type); // The type of message ("my-chat")

            EventBus.dispatchEvent("ON_NEW_TEXT_CHAT_MESSAGE",{from:event.from,message:event.data});
        });
        */
    };
    Service.prototype.loginResponse = function (response) {
        EventBus.dispatchEvent(Service.LOGIN_RESPONSE, response);
    };
    Service.prototype.logoutResponse = function (response) {
        EventBus.dispatchEvent(Service.ON_LOG_OUT, response);
    };
    Service.prototype.onStreamDestroyed = function (event) {
        var connection = event.stream.connection;
        EventBus.dispatchEvent(Service.STREAM_DESTROYED, connection);
        //view.removeUserData(event.stream.connection);
    };
    Service.prototype.onStreamCreated = function (event) {
        EventBus.dispatchEvent(Service.STREAM_CREATED, { session: this.session, stream: event.stream });
        //var subscriber = this.session.subscribe(event.stream, 'video-container');
        // subscriber.on('videoElementCreated', (event) => this.onElementCreated(event));
    };
    Service.prototype.removeUserResponse = function (response) {
        EventBus.dispatchEvent(Service.REMOVE_USER_RESPONSE, response);
    };
    Service.STREAM_CREATED = "STREAM_CREATED";
    Service.STREAM_DESTROYED = "STREAM_DESTROYED";
    Service.ON_LOG_OUT = "ON_LOG_OUT";
    Service.LOGIN_RESPONSE = "LOGIN_RESPONSE";
    Service.GET_TOKEN_RESPONSE = "GET_TOKEN_RESPONSE";
    Service.REMOVE_USER_RESPONSE = "REMOVE_USER_RESPONSE";
    return Service;
}());
//# sourceMappingURL=Service.js.map