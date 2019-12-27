var ListIterator = (function () {
    function ListIterator(_collection) {
        this.counter = -1;
        this.collection = _collection;
    }
    ListIterator.prototype.hasNext = function () {
        var nextIndex = this.counter + 1;
        if (nextIndex < this.collection.size()) {
            return true;
        }
        else {
            return false;
        }
    };
    ListIterator.prototype.next = function () {
        this.counter += 1;
        return this.collection.get(this.counter);
    };
    return ListIterator;
}());
var MapIterator = (function () {
    function MapIterator(_collection) {
        this.counter = -1;
        this.collection = _collection;
        this.keys = this.collection.getKeys();
    }
    MapIterator.prototype.hasNext = function () {
        var nextIndex = this.counter + 1;
        if (nextIndex < this.keys.length) {
            return true;
        }
        else {
            return false;
        }
    };
    MapIterator.prototype.next = function () {
        this.counter += 1;
        var key = this.keys[this.counter];
        return this.collection.get(key);
    };
    MapIterator.prototype.size = function () {
        return this.keys.length;
    };
    return MapIterator;
}());
var List = (function () {
    function List(id) {
        if (id) {
            this.id = id;
        }
        this.items = [];
    }
    List.prototype.size = function () {
        return this.items.length;
    };
    List.prototype.add = function (value) {
        this.items.push(value);
    };
    List.prototype.get = function (index) {
        return this.items[index];
    };
    List.prototype.remove = function (index) {
        this.items.splice(index, 1);
    };
    List.prototype.clear = function () {
        this.items = [];
    };
    List.prototype.getIterator = function () {
        return new ListIterator(this);
    };
    List.prototype.setId = function (id) {
        this.id = id;
    };
    List.prototype.getId = function () {
        return this.id;
    };
    return List;
}());
var Map = (function () {
    function Map(id) {
        this.keys = new Array();
        if (id) {
            this.id = id;
        }
        this.items = {};
    }
    Map.prototype.removeKey = function (key) {
        var index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
    };
    Map.prototype.add = function (key, value) {
        var keyExists = this.has(key);
        if (!keyExists) {
            this.items[key] = value;
            this.keys.push(key);
        }
        else {
            throw new Error(key + ' already exists');
        }
    };
    Map.prototype.remove = function (key) {
        delete this.items[key];
        // remove key
        this.removeKey(key);
    };
    Map.prototype.update = function (key, newValue) {
        var value = this.get(key);
        if (value != undefined && value != null) {
            this.items[key] = newValue;
        }
        else {
            console.error('Map error. No such element by key ' + key);
        }
    };
    Map.prototype.clear = function () {
        this.keys = new Array();
        this.items = {};
    };
    Map.prototype.has = function (key) {
        return key in this.items;
    };
    Map.prototype.get = function (key) {
        return this.items[key];
    };
    Map.prototype.getKeys = function () {
        return this.keys;
    };
    Map.prototype.size = function () {
        return this.keys.length;
    };
    Map.prototype.getIterator = function () {
        return new MapIterator(this);
    };
    Map.prototype.setId = function (id) {
        this.id = id;
    };
    Map.prototype.getId = function () {
        return this.id;
    };
    Map.prototype.getEncoder = function () {
        return new MapJsonEncoder(this);
    };
    return Map;
}());
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
            throw new Error('Not valid json.');
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
    

