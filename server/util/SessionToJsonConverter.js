"use strict";
var SessionToJsonConverter = (function () {
    function SessionToJsonConverter() {
    }
    SessionToJsonConverter.convert = function (session) {
        var json = {};
        json.sessionId = session.sessionId;
        json.createdAt = session.createdAt;
        json.customSessionId = !!session.properties.customSessionId ? session.properties.customSessionId : "";
        json.recording = session.recording;
        json.mediaMode = session.properties.mediaMode;
        json.recordingMode = session.properties.recordingMode;
        json.defaultRecordingLayout = session.properties.defaultRecordingLayout;
        json.defaultCustomLayout = !!session.properties.defaultCustomLayout ? session.properties.defaultCustomLayout : "";
        var connections = {};
        connections.numberOfElements = session.activeConnections.length;
        var jsonArrayConnections = [];
        session.activeConnections.forEach(function (con) {
            var c = {};
            c.connectionId = con.connectionId;
            c.createdAt = con.createdAt;
            c.role = con.role;
            c.token = con.token;
            c.clientData = con.clientData;
            c.serverData = con.serverData;
            var pubs = [];
            con.publishers.forEach(function (p) {
                var jsonP = {};
                jsonP.streamId = p.streamId;
                jsonP.createdAt = p.createdAt;
                jsonP.hasAudio = p.hasAudio;
                jsonP.hasVideo = p.hasVideo;
                jsonP.audioActive = p.audioActive;
                jsonP.videoActive = p.videoActive;
                jsonP.frameRate = p.frameRate;
                jsonP.typeOfVideo = p.typeOfVideo;
                jsonP.videoDimensions = p.videoDimensions;
                pubs.push(jsonP);
            });
            var subs = [];
            con.subscribers.forEach(function (s) {
                subs.push(s);
            });
            c.publishers = pubs;
            c.subscribers = subs;
            jsonArrayConnections.push(c);
        });
        connections.content = jsonArrayConnections;
        json.connections = connections;
        return json;
    };
    return SessionToJsonConverter;
}());
module.exports = SessionToJsonConverter;
//# sourceMappingURL=SessionToJsonConverter.js.map