///<reference path="IRequest.ts"/>
///<reference path="BaseHttpRequest.ts"/>
var HttpPostRequest = (function () {
    function HttpPostRequest(url, body, errorMsg, callback, restData) {
        if (restData === void 0) { restData = null; }
        this.request = new BaseHttpRequest("POST", url, body, errorMsg, callback, restData);
    }
    HttpPostRequest.prototype.execute = function () {
        this.request.execute();
    };
    return HttpPostRequest;
}());
//# sourceMappingURL=HttpPostRequest.js.map