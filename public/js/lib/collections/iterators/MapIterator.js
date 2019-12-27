/// <reference path="../Map.ts"/>
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
//# sourceMappingURL=MapIterator.js.map