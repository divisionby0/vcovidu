///<reference path="../collections/List.ts"/>
///<reference path="../collections/Map.ts"/>
module EventBus{
    var listeners:Map<any> = new Map('listeners');

    // add event listener
    export function addEventListener(type:string, callback:any):void{
        var typeExists:boolean = listeners.has(type);

        if(!typeExists){
            createType(type);
        }

        var typeListeners:List<any> = getTypeListeners(type);
        addTypeListener(callback, typeListeners);
    }

    // remove event listener
    export function removeEventListener(type:string, callback:any):void{
        var typeExists:boolean = listeners.has(type);
        if(!typeExists){
            return;
        }
        var typeListeners:List<any> = getTypeListeners(type);
        removeTypeListeners(callback, typeListeners);
    }

    export function dispatchEvent(type:string, eventData:any):void{
        var typeExists:boolean = listeners.has(type);
        if(!typeExists){
            return;
        }
        var typeListeners:List<any> = getTypeListeners(type);
        executeListenersCallback(typeListeners, eventData);
    }

    function executeListenersCallback(typeListeners:List<any>, eventData:any):void{
        var iterator:ListIterator = typeListeners.getIterator();
        while(iterator.hasNext()){
            var listenerCallback = iterator.next();
            listenerCallback.call(this, eventData);
        }
    }

    function getTypeListeners(type:string):List<any>{
        return listeners.get(type);
    }

    function createType(type:string):void{
        var typeListeners:List<any> = createTypeListeners(type);
        listeners.add(type, typeListeners);
    }
    function addTypeListener(callback:any, typeListeners:List<any>):void{
        typeListeners.add(callback);
    }

    function createTypeListeners(type:string):List<any>{
        return new List(type);
    }

    function removeTypeListeners(callback:any, typeListeners:List<any>):void{
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
        removeCurrentTypeListeners(currentTypeListeners, typeListeners);
        updateListeners(typeListeners);
    }

    function removeCurrentTypeListeners(currentTypeListeners:any[], typeListeners:List<any>):void{
        if(currentTypeListeners.length > 0){
            for(var i:number =0; i<currentTypeListeners.length; i++){
                var listenerToRemoveIndex:number = currentTypeListeners[i];
                typeListeners.remove(listenerToRemoveIndex);
            }
        }
    }

    function updateListeners(typeListeners:List<any>):void{
        if(typeListeners.size()==0){
            removeType(typeListeners);
        }
    }

    function removeType(typeListeners:List<any>):void{
        var type:string = typeListeners.getId();
        listeners.remove(type);
    }
}
