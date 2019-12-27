///<reference path="AppEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var ApplicationView = (function () {
    function ApplicationView(j) {
        this.j = j;
        this.currentState = ApplicationView.LOGGING_IN;
        this.onStateChanged();
        this.createListeners();
    }
    ApplicationView.prototype.cleanSessionView = function () {
        this.removeAllUserData();
        this.cleanMainVideo();
        this.j('#main-video video').css("background", "");
    };
    ApplicationView.prototype.removeUserData = function (connectionId) {
        var userNameRemoved = this.j("#data-" + connectionId);
        if (this.j(userNameRemoved).find('p.userName').html() === this.j('#main-video p.userName').html()) {
            this.cleanMainVideo(); // The participant focused in the main video has left
        }
        this.j("#data-" + connectionId).remove();
    };
    ApplicationView.prototype.joinComplete = function (sessionName) {
        this.j('#session-title').text(sessionName);
        this.j('#join').hide();
        this.j('#session').show();
    };
    ApplicationView.prototype.initMainVideoThumbnail = function () {
        this.j('#main-video video').css("background", "url('images/subscriber-msg.jpg') round");
    };
    ApplicationView.prototype.initMainVideo = function (videoElement, data) {
        this.j('#main-video video').get(0).srcObject = videoElement.srcObject;
        this.j('#main-video p.nickName').html(data.nickName);
        this.j('#main-video p.userName').html(data.userName);
        this.j('#main-video video').prop('muted', true);
        this.j(videoElement).prop('muted', true); // Mute local video
    };
    ApplicationView.prototype.appendUserData = function (videoElement, data) {
        var clientData;
        var serverData;
        var nodeId;
        console.log("appendUserData data=", data);
        if (data.nickName) {
            clientData = data.nickName;
            serverData = data.userName;
            nodeId = 'main-videodata';
        }
        else {
            clientData = JSON.parse(data.data.split('%/%')[0]).clientData;
            serverData = JSON.parse(data.data.split('%/%')[1]).serverData;
            nodeId = data.connectionId;
        }
        var dataNode = document.createElement('div');
        dataNode.className = "data-node";
        dataNode.id = "data-" + nodeId;
        dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
        videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
    };
    ApplicationView.prototype.onLogOut = function () {
        this.currentState = ApplicationView.LOGGING_IN;
        this.onStateChanged();
    };
    ApplicationView.prototype.onLogIn = function (sessionName, user, nickName) {
        this.userName = user;
        this.nickName = nickName;
        this.sessionName = sessionName;
        this.currentState = ApplicationView.CHATTING;
        this.onStateChanged();
    };
    ApplicationView.prototype.cleanMainVideo = function () {
        this.j('#main-video video').get(0).srcObject = null;
        this.j('#main-video p').each(function () {
            this.j(this).html('');
        });
    };
    ApplicationView.prototype.removeAllUserData = function () {
        this.j(".data-node").remove();
    };
    ApplicationView.prototype.onStateChanged = function () {
        switch (this.currentState) {
            case ApplicationView.CHATTING:
                this.hideLoggingInElement();
                this.j("#name-user").text(this.userName);
                this.j("#sessionName").val(this.sessionName);
                this.j("#nickName").val(this.nickName);
                this.createLogoutButtonListener();
                this.showChatElement();
                break;
            case ApplicationView.LOGGING_IN:
                this.showLoggingInElement();
                this.removeLogoutButtonListener();
                this.hideChatElement();
                break;
        }
    };
    ApplicationView.prototype.showLoggingInElement = function () {
        this.j("#not-logged").show();
    };
    ApplicationView.prototype.hideLoggingInElement = function () {
        this.j("#not-logged").hide();
    };
    ApplicationView.prototype.showChatElement = function () {
        this.j("#logged").show();
    };
    ApplicationView.prototype.hideChatElement = function () {
        this.j("#logged").hide();
    };
    ApplicationView.prototype.createListeners = function () {
    };
    ApplicationView.prototype.createLogoutButtonListener = function () {
        var _this = this;
        this.j("#logoutBtn").on("click", function (event) { return _this.onLogoutButtonClicked(event); });
    };
    ApplicationView.prototype.removeLogoutButtonListener = function () {
        var _this = this;
        this.j("#logoutBtn").off("click", function (event) { return _this.onLogoutButtonClicked(event); });
    };
    ApplicationView.prototype.onLogoutButtonClicked = function (event) {
        EventBus.dispatchEvent(AppEvent.LOGOUT_REQUEST, null);
    };
    ApplicationView.LOGGING_IN = "LOGGING_IN";
    ApplicationView.CHATTING = "CHATTING";
    return ApplicationView;
}());
//# sourceMappingURL=ApplicationView.js.map