///<reference path="./AppEvent.ts"/>
///<reference path="ApplicationModel.ts"/>
class ApplicationController{
    private model:ApplicationModel;

    constructor(model:ApplicationModel){
        this.model = model;
        this.createListeners();
    }

    private createListeners():void {
        EventBus.addEventListener(AppEvent.JOIN_COMPLETE, (token)=>this.onAppJoinComplete(token));
        EventBus.addEventListener(AppEvent.LOGOUT_REQUEST, ()=>this.onLogOutRequest());
    }

    private onAppJoinComplete(token):void {
        console.log("__controller JOIN COMPLETE");
        EventBus.removeEventListener(AppEvent.JOIN_COMPLETE, (token)=>this.onAppJoinComplete(token));
        this.model.joinComplete(token);
    }

    private onLogOutRequest():void {
        this.model.logoutRequest();
    }
}
