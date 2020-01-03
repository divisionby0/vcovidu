"use strict";
var EventBus = require("../events/EventBus");
var Room = (function () {
    function Room(name, sessionName, session, tokenOptions, ownerResponse) {
        var _this = this;
        this.maxPingDifference = 3;
        this.mapSessions = new Array();
        this.mapSessionNamesTokens = new Array();
        this.name = name;
        this.sessionName = sessionName;
        this.session = session;
        this.ownerResponse = ownerResponse;
        console.log("new Room name=" + this.name + "  sessionName=" + this.sessionName);
        //console.log("session:",session);
        this.mapSessions[this.sessionName] = session;
        this.mapSessionNamesTokens[this.sessionName] = [];
        // Generate a new token asynchronously with the recently created tokenOptions
        session.generateToken(tokenOptions)
            .then(function (token) {
            _this.publisherToken = token;
            // Store the new token in the collection of tokens
            _this.mapSessionNamesTokens[_this.sessionName].push(token);
            console.log("sending token ", token + "  ");
            // Return the Token to the client
            _this.ownerResponse.status(200).send({
                0: token
            });
        })
            .catch(function (error) {
            console.error(error);
        });
        this.createPingTimer();
    }
    Room.prototype.removeParticipant = function (sessionName, token, res) {
        // If the session exists
        var isPublisher = token == this.publisherToken;
        if (isPublisher) {
            this.onPublisherConnectionLost();
        }
        else {
            if (this.mapSessions[sessionName] && this.mapSessionNamesTokens[sessionName]) {
                var tokens = this.mapSessionNamesTokens[sessionName];
                var index = tokens.indexOf(token);
                // If the token exists
                if (index !== -1) {
                    // Token removed
                    tokens.splice(index, 1);
                    console.log(sessionName + ': ' + tokens.toString());
                }
                else {
                    var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                    console.log(msg);
                    res.status(500).send(msg);
                }
                if (tokens.length == 0) {
                    // Last user left: session must be removed
                    console.log(sessionName + ' empty!');
                    delete this.mapSessions[sessionName];
                }
                res.status(200).send();
            }
            else {
                var msg = 'Problems in the app server: the SESSION does not exist';
                console.log(msg);
                res.status(500).send(msg);
            }
        }
    };
    Room.prototype.addParticipant = function (sessionName, tokenOptions, res) {
        var _this = this;
        console.log("addParticipant ");
        var roomSession = this.mapSessions[sessionName];
        if (roomSession != undefined && roomSession != null) {
            roomSession.generateToken(tokenOptions)
                .then(function (token) {
                // Store the new token in the collection of tokens
                _this.mapSessionNamesTokens[sessionName].push(token);
                console.log("sending token ", token);
                // Return the token to the client
                res.status(200).send({
                    0: token
                });
                console.log("participant added");
                //console.log("publisher session: ",this.mapSessions[sessionName]);
            })
                .catch(function (error) {
            });
        }
        else {
        }
    };
    Room.prototype.createPingTimer = function () {
        var _this = this;
        this.pingInterval = setInterval(function () { return _this.onIntervalTick(); }, 1000);
    };
    Room.prototype.ping = function () {
        this.lastPingDate = new Date();
    };
    Room.prototype.onIntervalTick = function () {
        var nowDate = new Date();
        var difference = (nowDate - this.lastPingDate) / 2000;
        if (difference > this.maxPingDifference) {
            clearInterval(this.pingInterval);
            this.onPublisherConnectionLost();
        }
        else {
        }
    };
    Room.prototype.destroy = function () {
        this.mapSessions = null;
        this.mapSessionNamesTokens = null;
    };
    Room.prototype.onPublisherConnectionLost = function () {
        console.log("publisher connection lost");
        this.destroy();
        EventBus.dispatchEvent(Room.ON_PUBLISHER_CONNECTION_LOST, this.sessionName);
        /*
        console.log("publisher connection lost");
        this.destroy();
        EventBus.dispatchEvent(Room.ON_PUBLISHER_CONNECTION_LOST, this.sessionName);
        */
        /*
        this.session.signal({
            data: 'PublisherConnectionLost',  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'room'+this.sessionName+'_channel'             // The type of message (optional)
        })
            .then(() => {
                //console.log('Message successfully sent');
            })
            .catch(error => {
                console.error(error);
            });
            */
        // If the session exists
        /*
        if (this.mapSessions[this.sessionName] && this.mapSessionNamesTokens[this.sessionName]) {
            var tokens = this.mapSessionNamesTokens[this.sessionName];
            var index = tokens.indexOf(this.publisherToken);

            // If the token exists
            if (index !== -1) {
                // Token removed
                tokens.splice(index, 1);
                console.log(this.sessionName + ': ' + tokens.toString());
            } else {
                var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                console.log(msg);
            }
            if (tokens.length == 0) {
                // Last user left: session must be removed
                console.log(this.sessionName + ' empty!');
                delete this.mapSessions[this.sessionName];
            }
        } else {
            var msg = 'Problems in the app server: the SESSION does not exist';
            console.log(msg);
        }
        */
    };
    Room.ON_PUBLISHER_CONNECTION_LOST = "ON_PUBLISHER_CONNECTION_LOST";
    return Room;
}());
module.exports = Room;
//# sourceMappingURL=Room.js.map