/// <reference path="../Map.ts"/>
var MapJsonDecoder = (function () {
    function MapJsonDecoder(dataString) {
        this.rootMap = new Map('rootMap');
        this.dataString = dataString;
    }
    MapJsonDecoder.prototype.decode = function () {
        this.parseStringToMap(this.dataString, this.rootMap);
        return this.rootMap;
    };
    MapJsonDecoder.prototype.parseStringToMap = function (dataString, parentMap) {
        var dataJson = '';
        try {
            dataJson = JSON.parse(dataString);
        }
        catch (error) {
            console.log('MapJsonDecoder. Not valid json.');
        }
        this.parseObjectToMap(dataJson, parentMap);
    };
    MapJsonDecoder.prototype.parseObjectToMap = function (dataObject, parentMap) {
        var id = dataObject["id"];
        var type = dataObject["type"];
        if (type == "Map") {
            for (var key in dataObject) {
                var value = dataObject[key];
                var valueId = value["id"];
                var valueType = value["type"];
                if (key != "id" && key != "type" && valueType == "Map") {
                    var subMap = new Map(valueId);
                    parentMap.add(key, this.parseObjectToMap(value, subMap));
                }
                else {
                    if (key === "id") {
                        parentMap.setId(value);
                    }
                    else if (key != "type") {
                        parentMap.add(key, value);
                    }
                }
            }
        }
        return parentMap;
    };
    return MapJsonDecoder;
}());
//# sourceMappingURL=MapJsonDecoder.js.map