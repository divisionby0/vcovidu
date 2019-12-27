///<reference path="IRequest.ts"/>
var BaseHttpRequest = (function () {
    function BaseHttpRequest(method, url, body, errorMsg, callback, restData) {
        if (callback === void 0) { callback = null; }
        if (restData === void 0) { restData = null; }
        this.method = method;
        this.url = url;
        this.body = body;
        this.errorMsg = errorMsg;
        if (callback) {
            this.callback = callback;
        }
        if (restData) {
            this.restData = restData;
        }
    }
    BaseHttpRequest.prototype.execute = function () {
        var _this = this;
        this.http = new XMLHttpRequest();
        this.http.open(this.method, this.url, true);
        this.http.setRequestHeader('Content-type', 'application/json');
        this.http.addEventListener('readystatechange', function () { return _this.processRequest(); }, false);
        console.log("sending to ", this.url, " body=", this.body, "callback=", this.callback);
        this.http.send(JSON.stringify(this.body));
    };
    BaseHttpRequest.prototype.processRequest = function () {
        if (this.http.readyState == 4) {
            if (this.http.status == 200) {
                try {
                    this.callback(JSON.parse(this.http.responseText), this.restData);
                }
                catch (e) {
                    this.callback();
                }
            }
            else {
                console.warn(this.errorMsg);
                console.warn(this.http.responseText);
            }
        }
    };
    return BaseHttpRequest;
}());
//# sourceMappingURL=BaseHttpRequest.js.map