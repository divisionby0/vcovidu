var ver = "0.1.8";
var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var TokenOptions = require('openvidu-node-client').TokenOptions;
var that = this;
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

// Server configuration
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));
app.use(express.static(__dirname + '/public')); // Set the static files location
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // Parse application/x-www-form-urlencoded
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
// Collection to pair session names with tokens
var mapSessionNamesTokens = {};

var TimeUtil = require('./server/util/TimeUtil');
var SocketServer = require('./server/socketServer/SocketServer');
var List = require('./server/collections/List');
var Map = require('./server/collections/Map');
var EventBus = require('./server/events/EventBus');

var Clients = require('./server/Clients');
var Client = require('./server/Client');

var RecordingAPI = require('./server/api/recording/RecordingAPI');

var clients = new Clients();
var recordingsAPI = new RecordingAPI(app, OV);

// Socket server
var socketServer = new SocketServer(fs, __dirname);

console.log("App listening on port 5000");
/* CONFIGURATION */

EventBus.addEventListener(SocketServer.ON_CLIENT_DISCONNECTED, (socketId) => onClientDisconnected(socketId));
EventBus.addEventListener(SocketServer.ON_CLIENT_CONNECTED, (data) => onClientConnected(data));
//EventBus.addEventListener(SocketServer.ON_CLIENT_AUTH, (data) => onClientAuth(data));

function onClientDisconnected(socketId){
    console.log("server onClientDisconnected socketId="+socketId);
    var disconnectedClient = clients.get(socketId);

    console.log("disconnected client ",disconnectedClient.getName());
    var disconnectedClientSession = disconnectedClient.getSession();
    console.log("disconnectedClientSession = ",disconnectedClientSession);

    if(disconnectedClientSession!=undefined && disconnectedClientSession!=null){
        console.log("destroying session of disconnected client");

        var clientToken = disconnectedClient.getToken();
        var clientSessionName = disconnectedClient.getSessionName();
        removeTokenFromMap(clientSessionName, clientToken);

        disconnectedClientSession.destroy();
    }
    else{
        console.error("[server.js 96] undefined session for disconnected client");
    }
    var result = clients.remove(socketId);
    console.log("remove result:",result);
}

function onClientAuth(data){
    console.log("server onClientAuthComplete data=",data);
    var socketId = data.socketId;
    var socket = data.socket;
    var name = data.name;

    //clients.add(socketId, new Client(name, socket));

    socketServer.onAuthComplete(socketId)
}
function onClientConnected(data){
    var socketId = data.socketId;
    var socket = data.socket;
    var name = data.name;

    console.log("server onClientConnected socketId=",socketId,"name=",name);

    var client = new Client(name, socket);
    clients.add(socketId, client);

    socketServer.onAuthComplete(socketId)
}

console.log(ver);

/* REST API */

// Login
app.post('/api-login/login', function (req, res) {
    var user = req.body.user;
    console.log("Logging in | {user}={" + user + "}");

    var isCorrect = checkIsDuplicate(user);

    if (isCorrect)
    {
        console.log("'" , user , "' has logged in." , "session=",req.session);
        req.session.loggedUser = user;
        clients.setSession(req.session, user);
        res.status(200).send("LogIn complete");
    }
    else
        {
        console.log("'" + user + "' already exists");
        req.session.destroy();
        res.status(401).send('User with name '+user+" already exists");
    }
});

// Logout
app.post('/api-login/logout', function (req, res) {
    var clientName = req.session.loggedUser;

    console.log("'" + clientName + "' has logged out");
    console.log("logout() removing client "+clientName);
    var deleteClientResult = clients.remove(clientName);

    req.session.destroy();
    if(deleteClientResult.result == true){
        res.status(200).send("LogOut complete");
    }
    else{
        res.status(401).send("Error deleting client with name "+clientName);
    }
});

// Get token (add new user to session)
app.post('/api-sessions/get-token', function (req, res) {
    console.log("getToken()");
    if (!isLogged(req.session)) {
        req.session.destroy();
        res.status(401).send('User not logged');
    }
    else {
        // The video-call to connect
        var sessionName = req.body.sessionName;
        var role = req.body.role;

        console.log("sessionName="+sessionName);
        console.log("role="+role);
        //console.log("userName="+userName);

        // Optional data to be passed to other users when this user connects to the video-call
        // In this case, a JSON with the value we stored in the req.session object on login
        var serverData = JSON.stringify({ serverData: req.session.loggedUser });

        // TODO найти в коллекции клиентов нужного по req.session.loggedUser и добавить в него token
        var userName = req.session.loggedUser;
        var client = clients.getClientByName(userName);
        client.setSessionName(sessionName);
        console.log("serverData=",serverData);

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

                    //TODO временно. Может client быть и null
                    client.setToken(token);

                    // Store the new token in the collection of tokens
                    mapSessionNamesTokens[sessionName].push(token);

                    // Return the token to the client
                    res.status(200).send({
                        0: token
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // New session
            console.log('New session ' + sessionName);

            OV.createSession()
                .then(session => {
                    // Store the new Session in the collection of Sessions
                    mapSessions[sessionName] = session;
                    // Store a new empty array in the collection of tokens
                    mapSessionNamesTokens[sessionName] = [];

                    // Generate a new token asynchronously with the recently created tokenOptions
                    session.generateToken(tokenOptions)
                        .then(token => {

                            //TODO временно. Может client быть и null
                            client.setToken(token);

                            // Store the new token in the collection of tokens
                            mapSessionNamesTokens[sessionName].push(token);

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
                    console.error(error);
                });
        }
    }
});

// Remove user from session
app.post('/api-sessions/remove-user', function (req, res) {
    if (!isLogged(req.session)) {
        req.session.destroy();
        res.status(401).send('User not logged');
    } else {

        var sessionName = req.body.sessionName;
        var token = req.body.token;
        console.log('Removing user | {sessionName, token}={' + sessionName + ', ' + token + '}');

        // TODO дубликат кода но с отсылкой ответов клиенту
        if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
            var tokens = mapSessionNamesTokens[sessionName];
            var index = tokens.indexOf(token);

            var tokenExists = index !== -1;

            // If the token exists
            if (tokenExists) {
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
    }
});

// Fetch session info
app.post('/api/fetch-info', function (req, res) {
    // Retrieve params from POST body
    var sessionName = req.body.sessionName;
    console.log("Fetching session info | {sessionName}=" + sessionName);

    // If the session exists
    if (mapSessions[sessionName]) {
        mapSessions[sessionName].fetch()
            .then(changed => {
                console.log("Any change: " + changed);
                var sessionJSON = SessionToJsonConverter.convert(mapSessions[sessionName]);
                res.status(200).send(sessionJSON);
            })
            .catch(error => res.status(400).send(error.message));
    } else {
        var msg = 'Problems in the app server: the SESSION does not exist';
        console.log(msg);
        res.status(500).send(msg);
    }
});

// Fetch all session info
app.get('/api/fetch-all', function (req, res) {
    console.log("Fetching all session info");
    OV.fetch()
        .then(changed => {
            var sessions = [];
            OV.activeSessions.forEach(s => {
                var sessionJSON = SessionToJsonConverter.convert(s);
                //sessions.push(sessionToJson(s));
                sessions.push(sessionJSON);
            });
            console.log("Any change: " + changed);
            res.status(200).send(sessions);
        })
        .catch(error => res.status(400).send(error.message));
});
/* REST API */


function removeTokenFromMap(sessionName, token){
    if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
        var tokens = mapSessionNamesTokens[sessionName];
        var index = tokens.indexOf(token);

        var tokenExists = index !== -1;

        if (tokenExists) {
            tokens.splice(index, 1);
        }
        if (tokens.length == 0) {
            // Last user left: session must be removed
            console.log(sessionName + ' empty!');
            delete mapSessions[sessionName];
        }
    }
}

function checkIsDuplicate(userName){
    return !clients.has(userName);
}

function login(user, pass) {
    //console.log("login() users:",users);
    //return (users.find(u => (u.user === user) && (u.pass === pass)));
}

function isLogged(session) {
    return (session.loggedUser != null);
}

function getBasicAuth() {
    return 'Basic ' + (new Buffer('OPENVIDUAPP:' + OPENVIDU_SECRET).toString('base64'));
}

/* AUXILIARY METHODS */
