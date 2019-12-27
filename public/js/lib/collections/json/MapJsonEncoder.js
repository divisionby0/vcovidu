/// <reference path="../Map.ts"/>
var MapJsonEncoder = (function () {
    function MapJsonEncoder(collection) {
        this.collection = collection;
    }
    MapJsonEncoder.prototype.encode = function () {
        var parsedObject = this.parseToObject(this.collection);
        var parsedJson = JSON.stringify(parsedObject);
        return parsedJson;
    };
    MapJsonEncoder.prototype.parseToObject = function (collection) {
        var parsedObject = {};
        parsedObject['id'] = collection.getId();
        parsedObject['type'] = "Map";
        var keys = collection.getKeys();
        for (var index in keys) {
            var currentKey = keys[index];
            var currentValue = collection.get(currentKey);
            var isMap = currentValue instanceof Map;
            if (isMap) {
                parsedObject[currentKey] = this.parseToObject(currentValue);
            }
            else {
                parsedObject[currentKey] = currentValue;
            }
        }
        return parsedObject;
    };
    return MapJsonEncoder;
}());
//# sourceMappingURL=MapJsonEncoder.js.map