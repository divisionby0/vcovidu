class RecordingAPI{
    private app:any;
    private OV:any;

    constructor(app:any, OV:any){
        this.app = app;
        this.OV = OV;
        this.createRoutes();
    }

    private createRoutes():void {
        this.app.post('/api/recording/start', (req, res)=>this.onStartRequest(req, res));
        this.app.post('/api/recording/stop', (req, res)=>this.onStopRequest(req, res));
        this.app.post('/api/recording/delete', (req, res)=>this.onDeleteRequest(req, res));
        this.app.post('/api/recording/get/:recordingId', (req, res)=>this.onGetRequest(req, res));
        this.app.post('/api/recording/list', (req, res)=>this.onListRequest(req, res));
    }

    private onStopRequest(req:any, res:any):void{
        var recordingId = req.body.recording;
        console.log("Stopping recording | {recordingId}=" + recordingId);

        this.OV.stopRecording(recordingId)
            .then(recording => res.status(200).send(recording))
            .catch(error => res.status(400).send(error.message));
    }

    private onStartRequest(req:any, res:any):void {
        var recordingProperties = {
            outputMode: req.body.outputMode,
            hasAudio: req.body.hasAudio,
            hasVideo: req.body.hasVideo,
            resolution:"1024x768"
        };
        var sessionId = req.body.session;
        console.log("Starting recording | {sessionId}=" + sessionId);


        this.OV.startRecording(sessionId, recordingProperties)
            .then(recording => res.status(200).send(recording))
            .catch(error => res.status(400).send(error.message));
    }

    private onDeleteRequest(req:any, res:any):void{
        var recordingId = req.body.recording;
        console.log("Deleting recording | {recordingId}=" + recordingId);

        this.OV.deleteRecording(recordingId)
            .then(() => res.status(200).send())
            .catch(error => res.status(400).send(error.message));
    }

    private onGetRequest(req:any, res:any):void{
        var recordingId = req.params.recordingId;
        console.log("Getting recording | {recordingId}=" + recordingId);

        this.OV.getRecording(recordingId)
            .then(recording => res.status(200).send(recording))
            .catch(error => res.status(400).send(error.message));
    }

    private onListRequest(req:any, res:any):void{
        console.log("Listing recordings");

        this.OV.listRecordings()
            .then(recordings => res.status(200).send(recordings))
            .catch(error => res.status(400).send(error.message));
    }
}
export = RecordingAPI;
