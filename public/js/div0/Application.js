///<reference path="application/ApplicationView.ts"/>
///<reference path="application/ApplicationController.ts"/>
var Application = (function () {
    function Application($, userName, userRole, sessionToConnect) {
        var appView = new ApplicationView($);
        var model = new ApplicationModel(appView, userName, userRole, sessionToConnect);
        new ApplicationController(model);
        //model.loginRequest(userName, userRole, sessionToConnect);
    }
    return Application;
}());
//# sourceMappingURL=Application.js.map