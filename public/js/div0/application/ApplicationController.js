///<reference path="./AppEvent.ts"/>
///<reference path="ApplicationModel.ts"/>
var ApplicationController = (function () {
    function ApplicationController(model) {
        this.model = model;
        this.createListeners();
    }
    ApplicationController.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(AppEvent.JOIN_COMPLETE, function (token) { return _this.onAppJoinComplete(token); });
        EventBus.addEventListener(AppEvent.LOGOUT_REQUEST, function () { return _this.onLogOutRequest(); });
    };
    ApplicationController.prototype.onAppJoinComplete = function (token) {
        var _this = this;
        console.log("__controller JOIN COMPLETE");
        EventBus.removeEventListener(AppEvent.JOIN_COMPLETE, function (token) { return _this.onAppJoinComplete(token); });
        this.model.joinComplete(token);
    };
    ApplicationController.prototype.onLogOutRequest = function () {
        this.model.logoutRequest();
    };
    return ApplicationController;
}());
//# sourceMappingURL=ApplicationController.js.map