/* CONFIGURATION */
var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var TokenOptions = require('openvidu-node-client').TokenOptions;

var ver = "0.0.7";
console.log(ver);

// Check launch arguments: must receive openvidu-server URL and the secret
if (process.argv.length != 4) {
    console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
    process.exit(-1);
}
// For demo purposes we ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Node imports
var path = require('path');
var mime = require('mime');
var URL = require('url').URL;
var express = require('express');
var fs = require('fs');
var session = require('express-session');
var https = require('https');
var bodyParser = require('body-parser'); // Pull information from HTML POST (express4)
var app = express(); // Create our app with express
var RecordingAPI = require('./server/api/recording/RecordingAPI');

var EventBus = require('./server/events/EventBus');
var Map = require('./server/collections/Map');
var MapIterator = require('./server/collections/iterators/MapIterator');
var Room = require('./server/room/Room');

//var SocketServer = require('./server/socketServer/SocketServer');

// Server configuration
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'too6iedaiphei6Awae'
}));
app.use(express.static(__dirname + '/public')); // Set the static files location
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // Parse application/vnd.api+json as json

// Listen (start app with node server.js)

var options = {
    key: fs.readFileSync('openvidukey.pem'),
    cert: fs.readFileSync('openviducert.pem')
};

https.createServer(options, app).listen(5000);

// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = process.argv[2];
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = process.argv[3];

// Entrypoint to OpenVidu Node Client SDK
var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// Collection to pair session names with OpenVidu Session objects
var mapSessions = {};
var mapSessionNamesTokens = {};

var recordingsAPI = new RecordingAPI(app, OV);
var recordings = [];
var rooms = new Map("rooms");

//var socketServer = new SocketServer(__dirname);
EventBus.addEventListener("RECORDING_STARTED", (data)=>{
    console.log("RECORDING_STARTED");
    var sessionName = data.sessionName;
    var recording = data.recording;
    recordings[sessionName] = recording;
});

console.log("App listening on port 5000");
/* CONFIGURATION */


/* REST API */
// Logout
app.post('/api-login/logout', function (req, res) {
    console.log("'" + req.session.loggedUser + "' has logged out");
    req.session.destroy();
    res.status(200).send();
});

// Get token (add new user to session)
app.post('/api-sessions/get-token', function (req, res) {
    // The video-call to connect
    var sessionName = req.body.sessionName;
    var roomName = req.body.roomName;

    // Role associated to this user
    var role = req.body.role;

    // Optional data to be passed to other users when this user connects to the video-call
    // In this case, a JSON with the value we stored in the req.session object on login
    var serverData = JSON.stringify({ serverData: req.session.loggedUser });

    console.log("Getting a token | {sessionName}={" + sessionName + "}");

    // Build tokenOptions object with the serverData and the role
    var tokenOptions = {
        data: serverData,
        role: role
    };

    if (mapSessions[sessionName]) {
        // Session already exists
        console.log('Existing session ' + sessionName);

        // Get the existing Session from the collection
        var mySession = mapSessions[sessionName];

        // Generate a new token asynchronously with the recently created tokenOptions
        mySession.generateToken(tokenOptions)
            .then(token => {

                var recording = recordings[sessionName];

                // Store the new token in the collection of tokens
                mapSessionNamesTokens[sessionName].push(token);
                console.log("sending token ",token);
                // Return the token to the client
                res.status(200).send({
                    0: token,
                    1: recording
                });
            })
            .catch(error => {
                //res.status(500).send(error);
                console.error("Generate token error: ",error);
                createNewSession(res, sessionName, roomName);
            });

    } else {
        // New session
        if(role=="PUBLISHER"){
            console.log('New session ' + sessionName);
            createNewSession(res, sessionName, roomName, tokenOptions);
        }
        else{
            onRoleCannotCreateSessionError(res);
        }
    }
});

app.post('/api-sessions/session-closed', function (req, res) {
    var sessionId = req.body.sessionId;
    console.log("session closed ");
    recordingsAPI.onStopRequest(req, res);

    //res.status(200).send();
});


// Remove user from session
app.post('/api-sessions/remove-user', function (req, res) {
    // Retrieve params from POST body
    var sessionName = req.body.sessionName;
    var token = req.body.token;
    console.log('\nRemoving user | {sessionName, token}={' + sessionName + ', ' + token + '}');

    rooms.remove(sessionName);
    console.log("total rooms:"+rooms.size());

    // If the session exists
    if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
        var tokens = mapSessionNamesTokens[sessionName];
        var index = tokens.indexOf(token);

        // If the token exists
        if (index !== -1) {
            // Token removed
            tokens.splice(index, 1);
            console.log(sessionName + ': ' + tokens.toString());
        } else {
            var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
            console.log(msg);
            res.status(500).send(msg);
        }
        if (tokens.length == 0) {
            // Last user left: session must be removed
            console.log(sessionName + ' empty!');
            delete mapSessions[sessionName];
        }
        res.status(200).send();
    } else {
        var msg = 'Problems in the app server: the SESSION does not exist';
        console.log(msg);
        res.status(500).send(msg);
    }
});

app.post('/api/recording/get/:recordingId', function (req, res) {
    var recordingId = req.params.recordingId;
    var sessionName = req.body.sessionName;
    console.log("getRecord recordingId="+recordingId, "sessionName=",sessionName);

    var url = "/recordings/"+recordingId+"/"+recordingId+".mp4";;
    console.log("url=",url);
    res.status(200).send({data:url});
    console.log("response sent OK");
});

/* REST API */



/* AUXILIARY METHODS */
function createNewSession(res, sessionName, roomName, tokenOptions){
    console.log("creating new session "+sessionName);
    OV.createSession()
        .then(session => {
            // Store the new Session in the collection of Sessions
            mapSessions[sessionName] = session;
            // Store a new empty array in the collection of tokens
            mapSessionNamesTokens[sessionName] = [];

            // Generate a new token asynchronously with the recently created tokenOptions
            session.generateToken(tokenOptions)
                .then(token => {

                    // Store the new token in the collection of tokens
                    mapSessionNamesTokens[sessionName].push(token);
                    console.log("sending token ",token);
                    // Return the Token to the client
                    res.status(200).send({
                        0: token
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        })
        .catch(error => {
            res.status(500).send(error);
            console.error("ERROR: ",error);
        });
}
function login(user, pass) {
    return (users.find(u => (u.user === user) && (u.pass === pass)));
}
function getBasicAuth() {
    return 'Basic ' + (new Buffer('OPENVIDUAPP:' + OPENVIDU_SECRET).toString('base64'));
}
function onRoleCannotCreateSessionError(res){
    console.log("onRoleCannotCreateSessionError");
    res.status(500).send(JSON.stringify({errorCode:7, text:"Subscribers cannot create session"}));
}