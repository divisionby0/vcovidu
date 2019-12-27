/// <reference path="../List.ts"/>
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
//# sourceMappingURL=ListIterator.js.map