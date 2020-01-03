import EventBus = require("../events/EventBus");
class Room{
    public static ON_PUBLISHER_CONNECTION_LOST:string = "ON_PUBLISHER_CONNECTION_LOST";
    private name:string;
    private sessionName:string;
    private session:any;
    private pingInterval:number;
    private lastPingDate:any;
    private maxPingDifference:number = 3;
    private mapSessions:any[] = new Array();
    private mapSessionNamesTokens:any[] = new Array();
    private ownerResponse:any;
    private publisherToken:any;

    constructor(name:string, sessionName:string, session:any, tokenOptions:any, ownerResponse:any){
        this.name = name;
        this.sessionName = sessionName;
        this.session = session;
        this.ownerResponse = ownerResponse;

        console.log("new Room name="+this.name+"  sessionName="+this.sessionName);
        //console.log("session:",session);

        this.mapSessions[this.sessionName] = session;
        this.mapSessionNamesTokens[this.sessionName] = [];

        // Generate a new token asynchronously with the recently created tokenOptions
        session.generateToken(tokenOptions)
            .then(token => {
                this.publisherToken = token;
                // Store the new token in the collection of tokens
                this.mapSessionNamesTokens[this.sessionName].push(token);
                console.log("sending token ",token+"  ");
                // Return the Token to the client
                this.ownerResponse.status(200).send({
                    0: token
                });
            })
            .catch(error => {
                console.error(error);
            });

        this.createPingTimer();
    }

    public removeParticipant(sessionName:string, token:any, res:any):void{
        // If the session exists
        var isPublisher:boolean = token == this.publisherToken;

        if(isPublisher){
            this.onPublisherConnectionLost();
        }
        else{
            if (this.mapSessions[sessionName] && this.mapSessionNamesTokens[sessionName]) {
                var tokens = this.mapSessionNamesTokens[sessionName];
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
                    delete this.mapSessions[sessionName];
                }
                res.status(200).send();
            } else {
                var msg = 'Problems in the app server: the SESSION does not exist';
                console.log(msg);
                res.status(500).send(msg);
            }
        }
    }

    public addParticipant(sessionName:string, tokenOptions:any, res:any):void{
        console.log("addParticipant ");
        var roomSession = this.mapSessions[sessionName];
        if(roomSession!=undefined && roomSession!=null){
            roomSession.generateToken(tokenOptions)
                .then(token => {
                    // Store the new token in the collection of tokens
                    this.mapSessionNamesTokens[sessionName].push(token);
                    console.log("sending token ",token);
                    // Return the token to the client
                    res.status(200).send({
                        0: token
                    });
                    console.log("participant added");
                    //console.log("publisher session: ",this.mapSessions[sessionName]);
                })
                .catch(error => {

                });
        }
        else{

        }
    }

    private createPingTimer():void {
        this.pingInterval = setInterval(()=>this.onIntervalTick(), 1000);
    }

    public ping():void{
        this.lastPingDate = new Date();
    }

    private onIntervalTick():void{
        var nowDate:any = new Date();

        var difference = (nowDate - this.lastPingDate) / 2000;

        if(difference > this.maxPingDifference){
            clearInterval(this.pingInterval);
            this.onPublisherConnectionLost();
            //EventBus.dispatchEvent(Room.ON_PUBLISHER_CONNECTION_LOST, this.sessionName);
        }
        else{
            //console.log("diff="+difference);
        }
    }

    private destroy():void{
        this.mapSessions = null;
        this.mapSessionNamesTokens = null;
    }

    private onPublisherConnectionLost():void {

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
    }
}
export = Room;