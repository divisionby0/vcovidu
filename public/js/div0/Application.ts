///<reference path="application/ApplicationView.ts"/>
///<reference path="application/ApplicationController.ts"/>
class Application{
    constructor($:any, userName:string, userRole:string, sessionToConnect:string){

        var appView:ApplicationView = new ApplicationView($);
        var model:ApplicationModel = new ApplicationModel(appView, userName, userRole, sessionToConnect);
        new ApplicationController(model);

        //model.loginRequest(userName, userRole, sessionToConnect);
    }
}