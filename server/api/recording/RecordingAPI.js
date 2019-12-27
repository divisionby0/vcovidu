"use strict";
var RecordingAPI = (function () {
    function RecordingAPI(app, OV) {
        this.app = app;
        this.OV = OV;
        this.createRoutes();
    }
    RecordingAPI.prototype.createRoutes = function () {
        var _this = this;
        this.app.post('/api/recording/start', function (req, res) { return _this.onStartRequest(req, res); });
        this.app.post('/api/recording/stop', function (req, res) { return _this.onStopRequest(req, res); });
        this.app.post('/api/recording/delete', function (req, res) { return _this.onDeleteRequest(req, res); });
        this.app.post('/api/recording/get/:recordingId', function (req, res) { return _this.onGetRequest(req, res); });
        this.app.post('/api/recording/list', function (req, res) { return _this.onListRequest(req, res); });
    };
    RecordingAPI.prototype.onStopRequest = function (req, res) {
        var recordingId = req.body.recording;
        console.log("Stopping recording | {recordingId}=" + recordingId);
        this.OV.stopRecording(recordingId)
            .then(function (recording) { return res.status(200).send(recording); })
            .catch(function (error) { return res.status(400).send(error.message); });
    };
    RecordingAPI.prototype.onStartRequest = function (req, res) {
        var recordingProperties = {
            outputMode: req.body.outputMode,
            hasAudio: req.body.hasAudio,
            hasVideo: req.body.hasVideo,
            resolution: "1024x768"
        };
        var sessionId = req.body.session;
        console.log("Starting recording | {sessionId}=" + sessionId);
        this.OV.startRecording(sessionId, recordingProperties)
            .then(function (recording) { return res.status(200).send(recording); })
            .catch(function (error) { return res.status(400).send(error.message); });
    };
    RecordingAPI.prototype.onDeleteRequest = function (req, res) {
        var recordingId = req.body.recording;
        console.log("Deleting recording | {recordingId}=" + recordingId);
        this.OV.deleteRecording(recordingId)
            .then(function () { return res.status(200).send(); })
            .catch(function (error) { return res.status(400).send(error.message); });
    };
    RecordingAPI.prototype.onGetRequest = function (req, res) {
        var recordingId = req.params.recordingId;
        console.log("Getting recording | {recordingId}=" + recordingId);
        this.OV.getRecording(recordingId)
            .then(function (recording) { return res.status(200).send(recording); })
            .catch(function (error) { return res.status(400).send(error.message); });
    };
    RecordingAPI.prototype.onListRequest = function (req, res) {
        console.log("Listing recordings");
        this.OV.listRecordings()
            .then(function (recordings) { return res.status(200).send(recordings); })
            .catch(function (error) { return res.status(400).send(error.message); });
    };
    return RecordingAPI;
}());
module.exports = RecordingAPI;
//# sourceMappingURL=RecordingAPI.js.map