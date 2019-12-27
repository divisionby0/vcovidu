import RecordingAPI = require("./recording/RecordingAPI");
class RESTAPI {
    private app:any;

    constructor(app:any, OV:any) {
        this.app = app;
        new RecordingAPI(app, OV);
        this.createRoutes();
    }

    private createRoutes():void {
        this.app.post('/api-login/login', (req, res)=>this.onLoginRequest(req, res));
    }

    private onLoginRequest(req:any, res:any):void {
        var user = req.body.user;
        console.log("Logging in | {user}={" + user + "}");

        var isCorrect = checkIsDuplicate(user);

        if (isCorrect)
        {
            clients.add(user, new Client(user));
            console.log("'" + user + "' has logged in");
            req.session.loggedUser = user;
            res.status(200).send("LogIn complete");
        }
        else
        {
            console.log("'" + user + "' already exists");
            req.session.destroy();
            res.status(401).send('User with name '+user+" already exists");
        }
    }
}