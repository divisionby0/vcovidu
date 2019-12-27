///<reference path="IRequest.ts"/>
class BaseHttpRequest implements IRequest{
    private method:string;
    private url:string;
    private body:any;
    private errorMsg:string;
    private callback:Function;
    private restData:any;
    private http:any;

    constructor(method:string, url:string, body:any, errorMsg:string, callback:Function = null, restData:any = null){
        this.method = method;
        this.url = url;
        this.body = body;
        this.errorMsg = errorMsg;
        if(callback){
            this.callback = callback;
        }

        if(restData){
            this.restData = restData;
        }
    }
    public execute():void{
        this.http = new XMLHttpRequest();
        this.http.open(this.method, this.url, true);
        this.http.setRequestHeader('Content-type', 'application/json');
        this.http.addEventListener('readystatechange', ()=>this.processRequest(), false);

        console.log("sending to ", this.url, " body=", this.body, "callback=",this.callback);

        this.http.send(JSON.stringify(this.body));
    }

    private processRequest():void{
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
    }
}
