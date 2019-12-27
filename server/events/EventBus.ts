import List = require("../collections/List");
import Map = require("../collections/Map");
import ListIterator = require("../collections/iterators/ListIterator");
class EventBus{
    private static listeners:Map<any> = new Map('listeners');

    // add event listener
    public static addEventListener(type:string, callback:any):void{
        var typeExists:boolean = this.listeners.has(type);

        if(!typeExists){
            this.createType(type);
        }

        var typeListeners:List<any> = this.getTypeListeners(type);
        this.addTypeListener(callback, typeListeners);
    }

    // remove event listener
    public static removeEventListener(type:string, callback:any):void{
        var typeExists:boolean = this.listeners.has(type);
        if(!typeExists){
            return;
        }
        var typeListeners:List<any> = this.getTypeListeners(type);
        this.removeTypeListeners(callback, typeListeners);
    }

    public static dispatchEvent(type:string, eventData:any):void{
        var typeExists:boolean = this.listeners.has(type);
        if(!typeExists){
            return;
        }
        var typeListeners:List<any> = this.getTypeListeners(type);
        this.executeListenersCallback(typeListeners, eventData);
    }
    private static executeListenersCallback(typeListeners:List<any>, eventData:any):void{
        var iterator:ListIterator = typeListeners.getIterator();
        while(iterator.hasNext()){
            var listenerCallback = iterator.next();
            listenerCallback.call(this, eventData);
        }
    }

    private static getTypeListeners(type:string):List<any>{
        return this.listeners.get(type);
    }

    private static createType(type:string):void{
        var typeListeners:List<any> = this.createTypeListeners(type);
        this.listeners.add(type, typeListeners);
    }
    private static addTypeListener(callback:any, typeListeners:List<any>):void{
        typeListeners.add(callback);
    }

    private static createTypeListeners(type:string):List<any>{
        return new List(type);
    }

    private static removeTypeListeners(callback:any, typeListeners:List<any>):void{
        var iterator:ListIterator = typeListeners.getIterator();
        var currentTypeListeners:any[] = new Array();
        var index:number = -1;

        while(iterator.hasNext()){
            index++;
            var typeListener:any = iterator.next();
            if(callback.toString() == typeListener.toString()){
                currentTypeListeners.push(index);
            }
        }
        this.removeCurrentTypeListeners(currentTypeListeners, typeListeners);
        this.updateListeners(typeListeners);
    }

    private static removeCurrentTypeListeners(currentTypeListeners:any[], typeListeners:List<any>):void{
        if(currentTypeListeners.length > 0){
            for(var i:number =0; i<currentTypeListeners.length; i++){
                var listenerToRemoveIndex:number = currentTypeListeners[i];
                typeListeners.remove(listenerToRemoveIndex);
            }
        }
    }

    private static updateListeners(typeListeners:List<any>):void{
        if(typeListeners.size()==0){
            this.removeType(typeListeners);
        }
    }

    private static removeType(typeListeners:List<any>):void{
        var type:string = typeListeners.getId();
        this.listeners.remove(type);
    }
}
export = EventBus;
