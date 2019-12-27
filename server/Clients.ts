import Map = require("./collections/Map");
import Client = require("./Client");
import MapIterator = require("./collections/iterators/MapIterator");
class Clients{
    private ver:string = "0.0.1";
    private collection:Map<Client> = new Map<Client>("clients");

    constructor(){
        console.log("Im Clients. ver="+this.ver+" total="+this.collection.size());
    }

    public setSession(session:any, clientName:string):void{
        console.log("setSession clientName=",clientName," session=",session);
        var currentClient:Client = this.getClientByName(clientName);

        if(currentClient!=undefined && currentClient!=null){
            currentClient.setSession(session);
        }
        else{
            console.error("[ClientsCollection.ts] client NOT FOUND by name "+clientName);
        }
    }

    public add(key:string, client:Client):void{
        this.collection.add(key, client);
    }

    public remove(key:string):any{
        if(this.collection.has(key)){
            this.collection.remove(key);
            return {result:true};
        }
        else{
            return {result:false, error:"No "+key+" at collection"};
        }
    }

    public get(key:string):Client{
        return this.collection.get(key);
    }

    public has(userName:string):boolean{
        return this.collection.has(userName);
    }

    public getIterator():MapIterator{
        return this.collection.getIterator()
    };

    private getClientByName(name:string):Client{
        var client:Client = null;

        var iterator:MapIterator = this.collection.getIterator();
        while(iterator.hasNext()){
            var currentClient:Client = iterator.next();
            var isSearchClient:boolean = currentClient.isNameEquals(name);
            if(isSearchClient == true){
                return currentClient;
            }
        }

        return client;
    }
}
export  = Clients;
