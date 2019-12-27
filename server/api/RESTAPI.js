"use strict";
var RecordingAPI = require("./recording/RecordingAPI");
var RESTAPI = (function () {
    function RESTAPI(app, OV) {
        this.app = app;
        new RecordingAPI(app, OV);
        this.createRoutes();
    }
    RESTAPI.prototype.createRoutes = function () {
        var _this = this;
        this.app.post('/api-login/login', function (req, res) { return _this.onLoginRequest(req, res); });
    };
    RESTAPI.prototype.onLoginRequest = function (req, res) {
        var user = req.body.user;
        console.log("Logging in | {user}={" + user + "}");
        var isCorrect = checkIsDuplicate(user);
        if (isCorrect) {
            clients.add(user, new Client(user));
            console.log("'" + user + "' has logged in");
            req.session.loggedUser = user;
            res.status(200).send("LogIn complete");
        }
        else {
            console.log("'" + user + "' already exists");
            req.session.destroy();
            res.status(401).send('User with name ' + user + " already exists");
        }
    };
    return RESTAPI;
}());
//# sourceMappingURL=RESTAPI.js.map