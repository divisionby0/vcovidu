/// <reference path="../Map.ts"/>
class MapIterator{
    private collection:Map<any>;

    private counter:number = -1;
    private keys:string[];

    constructor(_collection:Map<any>){
        this.collection = _collection;
        this.keys = this.collection.getKeys();
    }

    hasNext():boolean{
        var nextIndex:number = this.counter+1;
        if(nextIndex < this.keys.length){
            return true;
        }
        else{
            return false;
        }
    }

    next():any{
        this.counter+=1;
        var key:string = this.keys[this.counter];
        return this.collection.get(key);
    }
    size():number{
        return this.keys.length;
    }
}
