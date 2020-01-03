var OV;
var session;

var sessionName;	// Name of the video session the user will connect to
var token;			// Token retrieved from OpenVidu Server
var userName;
var role;
var sessionToConnect;
var roomName;
var videoResolution;
var socketServiceURL;
var socketService;

var ver = "0.0.1";

function startApplication(_userName, _role, _sessionToConnect, _roomName){
    log(ver);
    userName = _userName;
    role = _role;
    sessionToConnect = _sessionToConnect;
    roomName = _roomName;

    parseConfig();
    //createSocketService();
    joinSession();
}

function parseConfig(){
    videoResolution = config.resolution;
    socketServiceURL = config.socketServiceURL;
}

function createSocketService(){
    /*
    var socket = require('socket.io-client')(socketServiceURL, {secure: true, rejectUnauthorized: false});
    socket.on('connect', function () {
        console.log("connected to socket server");
    });
    */

    EventBus.addEventListener(SocketEvent.ON_SOCKET_CONNECTED, ()=>this.onSocketConnected());
    socketService = new SocketService(socketServiceURL,{query:"userData="+userName});
}

function onSocketConnected(){
    console.log("connected to socket");
}

/* OPENVIDU METHODS */
function joinSession() {
    console.log("join session");
    getToken((token) => {
        OV = new OpenVidu();

        session = OV.initSession();

        session.on('streamCreated', (event) => {
            $("#video-container").empty();

            var subscriber = session.subscribe(event.stream, 'video-container');

            subscriber.on('videoElementCreated', (event) => {
                appendUserData(event.element, subscriber.stream.connection);
            });
        });

        session.on('streamDestroyed', (event) => {
            alert("STREAM DESTROYED");
            removeUserData(event.stream.connection);

        });

        var nickName = userName;
        session.connect(token, { clientData: nickName })
            .then(() => {

                $('#session-title').text(sessionName);

                var isPublisher = role=="PUBLISHER";

                if (isPublisher==true) {

                    var publisher = OV.initPublisher('video-container', {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: true,
                        publishVideo: true,
                        resolution: videoResolution,
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: true
                    });

                    publisher.on('videoElementCreated', (event) => {
                        var userData = {
                            nickName: nickName,
                            userName: userName
                        };

                        initMainVideo(event.element, userData);
                        appendUserData(event.element, userData);

                        $(event.element).prop('muted', true);
                    });

                    session.publish(publisher);
                    startRecording();
                    startPublisherPingTimer();
                } else {
                    console.warn('You don\'t have permissions to publish');
                    log("You don\'t have permissions to publish");
                    initMainVideoThumbnail(); // Show SUBSCRIBER message in main video
                }
            })
            .catch(error => {
                log("There was an error connecting to the session: code="+error.code+"  message="+error.message);
                console.warn('There was an error connecting to the session:', error.code, error.message);
            });

        createTextChat(session);
    },(error)=>{
        onGetTokenError(error);
        log("getTokenError "+error);
        //console.log("getToken error: ",error);
        });

    return false;
}

function startPublisherPingTimer(){
    console.log("startPublisherPingTimer");
    setInterval(sendPingPublisher, 2000);
}

function sendPingPublisher(){
    httpPostRequest(
        'api-sessions/ping',
        {sessionName:sessionToConnect, role:role},
        'Send pong wrong',
        (response) => {

        }
    );
}

function leaveSession() {
    session.disconnect();
    session = null;
    cleanSessionView();
    stopRecording();
}
/* OPENVIDU METHODS */


var createTextChat = function (session) {
    console.log("createTextChat session=",session);
    var view = new TextChatView($);
    var model = new TextChatModel(view, session);
    new TextChatController(model);
};

/* APPLICATION REST METHODS */
function logOut() {
    httpPostRequest(
        'api-login/logout',
        {loggedUser:sessionToConnect},
        'Logout WRONG',
        (response) => {
            $("#not-logged").show();
            $("#logged").hide();
        }
    );
}

function getToken(callback, errorCallback) {
    httpPostRequest(
        'api-sessions/get-token',
        {sessionName: sessionToConnect, role:role, roomName:roomName},
        'Request of TOKEN gone WRONG:',
        (response) => {
            console.log("getToken response:",response);
            token = response[0]; // Get token from response
            console.warn('Request of TOKEN gone WELL (TOKEN:' + token + ')');
            callback(token); // Continue the join operation
        },
        (error)=>{
            errorCallback(error)
        }
    );
}

function removeUser() {
    httpPostRequest(
        'api-sessions/remove-user',
        {sessionName: sessionToConnect, token: token},
        'User couldn\'t be removed from session',
        (response) => {
            console.warn("You have been removed from session " + sessionName);
        }
    );
}

function httpPostRequest(url, body, errorMsg, callback, errorCallback) {
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.addEventListener('readystatechange', processRequest, false);
    http.send(JSON.stringify(body));

    function processRequest() {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {
                    callback(JSON.parse(http.responseText));
                } catch (e) {
                    callback();
                }
            } else {
                console.warn(errorMsg);
                console.warn(http.responseText);
                errorCallback(http.responseText);
            }
        }
    }
}

/* APPLICATION REST METHODS */



/* APPLICATION BROWSER METHODS */
function startRecording() {
    console.log("start recording...");

    var request = new HttpPostRequest('api/recording/start',{
            session: session.sessionId,
            outputMode: "COMPOSED",
            hasAudio: true,
            hasVideo: true,
            resolution:videoResolution
        },
        'Start recording WRONG',
        function(response){
            forceRecordingId = response.id;
            console.log("forceRecordingId=",forceRecordingId,"response=",response);
        }
    );
    request.execute();
}

function stopRecording() {
    console.log("stopRecording forceRecordingId=",forceRecordingId);
    var request = new HttpPostRequest('api/recording/stop',{recording: forceRecordingId},
        'Stop recording WRONG',
        function(response){
            console.log(response);
        }
    );
    request.execute();
}

window.onbeforeunload = () => { // Gracefully leave session
    if (session) {
        removeUser();
        leaveSession();
    }
    logOut();
};

function appendUserData(videoElement, connection) {
    var clientData;
    var serverData;
    var nodeId;
    if (connection.nickName) { // Appending local video data
        clientData = connection.nickName;
        serverData = connection.userName;
        nodeId = 'main-videodata';
    } else {
        clientData = JSON.parse(connection.data.split('%/%')[0]).clientData;
        serverData = JSON.parse(connection.data.split('%/%')[1]).serverData;
        nodeId = connection.connectionId;
    }

    var dataNode = document.createElement('div');
    dataNode.className = "data-node";
    dataNode.id = "data-" + nodeId;
    dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";

    if(role=="SUBSCRIBER"){
        $(videoElement).removeAttr("autoplay");
        $(videoElement).attr("poster","./assets/mainVideoPlaceholderMirrored.jpg");
        $(videoElement).addClass("videoMirrored");
    }
    addClickListener(videoElement, clientData, serverData);
}

function removeUserData(connection) {
    var userNameRemoved = $("#data-" + connection.connectionId);
    if ($(userNameRemoved).find('p.userName').html() === $('#main-video p.userName').html()) {
        cleanMainVideo(); // The participant focused in the main video has left
    }
    $("#data-" + connection.connectionId).remove();
}

function removeAllUserData() {
    $(".data-node").remove();
}

function cleanMainVideo() {
    $('div[id^="remote-video-_"]').srcObject = null;
}

function addClickListener(videoElement, clientData, serverData) {
    videoElement.addEventListener('click', function (event) {
        event.currentTarget.play();
    });
}

function initMainVideo(videoElement, userData) {
    //$('#main-video video').get(0).srcObject = videoElement.srcObject;
    //$('#main-video p.nickName').html(userData.nickName);
    //$('#main-video p.userName').html(userData.userName);
    //$('#main-video video').prop('muted', true);
}

function initMainVideoThumbnail() {
    $('#main-video video').css("background", "url('images/subscriber-msg.jpg') round");
}

function cleanSessionView() {
    removeAllUserData();
    cleanMainVideo();
    $('#main-video video').css("background", "");
}
function onGetTokenError(error){
    console.log("Error: ",error);
    var errorData = JSON.parse(error);
    alert(errorData.text);
}

function log(message){
    var messageItem = $("<span style='width:100%; float: left; display: block;'>"+message+"</span>");
    var logContainer = $("#logContainer");
    messageItem.appendTo(logContainer);

}
/* APPLICATION BROWSER METHODS */