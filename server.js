/* CONFIGURATION */
var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var TokenOptions = require('openvidu-node-client').TokenOptions;

var ver = "0.0.8";
console.log(ver);

// Check launch arguments: must receive openvidu-server URL and the secret
if (process.argv.length != 4) {
    console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
    process.exit(-1);
}
// For demo purposes we ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Node imports
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

var rooms = new Map("rooms");

EventBus.addEventListener(Room.ON_PUBLISHER_CONNECTION_LOST, (sessionName)=>{
    console.log("OnPublisher connection lost sessionName="+sessionName);
    if(rooms.has(sessionName)){
        rooms.remove(sessionName);
        console.log("room destroyed");
    }
    else{
        console.log("could not find room by sessionName "+sessionName);
    }
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
app.post('/api-sessions/ping', function (req, res) {
    var sessionName = req.body.sessionName;
    var role = req.body.role;

    if(role=="PUBLISHER"){
        //console.log("on publisher ping sessionName="+sessionName);
        var room = rooms.get(sessionName);

        if(room!=undefined && room !=null){
            room.ping();
        }
        else{
            console.log("room to ping not found");
        }
        res.status(200).send();
    }
});

// Get token (add new user to session)
app.post('/api-sessions/get-token', function (req, res) {
    // The video-call to connect
    var sessionName = req.body.sessionName;
    var roomName = req.body.roomName;

    var role = req.body.role;

    var serverData = JSON.stringify({ serverData: req.session.loggedUser });

    console.log("Getting a token | {sessionName}={" + sessionName + "}");

    // Build tokenOptions object with the serverData and the role
    var tokenOptions = {
        data: serverData,
        role: role
    };

    var roomExists = rooms.has(sessionName);
    var room;
    if(!roomExists){
        if(role == "PUBLISHER"){
            createNewSession(sessionName, roomName, tokenOptions, res);
        }
        else{
            onRoleCannotCreateSessionError(res);
        }
    }
    else{
        room = rooms.get(sessionName);
        if(role=="SUBSCRIBER"){
            room.addParticipant(sessionName, tokenOptions, res);
        }
        else{
            console.log("reEnter by publisher");
        }
    }
});

// Remove user from session
app.post('/api-sessions/remove-user', function (req, res) {
    // Retrieve params from POST body
    var sessionName = req.body.sessionName;
    var token = req.body.token;

    console.log('\nRemoving user | {sessionName, token}={' + sessionName + ', ' + token + '}');

    var room = rooms.get(sessionName);
    if(room!=undefined && room!=null){
        room.removeParticipant(sessionName, token,res);
    }
    else{
        console.log("room not found");
    }
    //rooms.remove(sessionName);
    //console.log("total rooms:"+rooms.size());

    /*
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
    */
});

/* REST API */



/* AUXILIARY METHODS */
function createNewSession(sessionName, roomName, tokenOptions, res){
    console.log("creating new session "+sessionName);
    OV.createSession()
        .then(session => {
            var newRoom = new Room(roomName, sessionName, session, tokenOptions, res);

            try{
                rooms.add(sessionName, newRoom);
                console.log("total rooms:",rooms.size());
            }
            catch(error){
                res.status(500).send(JSON.stringify({errorCode:1, text:error}));
                return;
            }
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