///<reference path="IRequest.ts"/>
///<reference path="BaseHttpRequest.ts"/>
class HttpPostRequest implements IRequest{

    private request:BaseHttpRequest;

    constructor(url:string, body:any, errorMsg:string, callback:Function, restData:any=null){
        this.request = new BaseHttpRequest("POST", url, body, errorMsg, callback, restData);
    }
    public execute():void{
        this.request.execute();
    }
}
