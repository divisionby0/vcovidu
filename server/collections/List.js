"use strict";
/// <reference path="iterators/ListIterator.ts"/>
var ListIterator = require("./iterators/ListIterator");
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
module.exports = List;
//# sourceMappingURL=List.js.map