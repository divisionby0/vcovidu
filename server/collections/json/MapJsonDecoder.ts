/// <reference path="../Map.ts"/>
class MapJsonDecoder{
    private rootMap:Map<any>;
    private dataString:string;


    constructor(dataString:string) {
        this.rootMap = new Map<any>('rootMap');
        this.dataString = dataString;
    }

    public decode():Map<any>{
        this.parseStringToMap(this.dataString, this.rootMap);
        return this.rootMap;
    }

    private parseStringToMap(dataString:string, parentMap:Map<any>):void{
        var dataJson:any = '';
        try{
            dataJson = JSON.parse(dataString);
        }
        catch(error){
            console.log('MapJsonDecoder. Not valid json.');
            //throw new Error('Not valid json.');
        }
        this.parseObjectToMap(dataJson, parentMap);
    }

    private parseObjectToMap(dataObject:any, parentMap:Map<any>):Map<any>{

        var id:string = dataObject["id"];
        var type:string = dataObject["type"];

        if(type=="Map"){
            for(var key in dataObject){
                var value:any = dataObject[key];
                var valueId:string = value["id"];
                var valueType:string = value["type"];

                if(key!="id" && key!="type" && valueType=="Map"){
                    var subMap:Map<any> = new Map<any>(valueId);
                    parentMap.add(key, this.parseObjectToMap(value, subMap));
                }
                else{
                    if(key === "id"){
                        parentMap.setId(value);
                    }
                    else if(key != "type"){
                        parentMap.add(key, value);
                    }
                }
            }
        }
        return parentMap;

    }
}
