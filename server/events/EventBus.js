"use strict";
var List = require("../collections/List");
var Map = require("../collections/Map");
var EventBus = (function () {
    function EventBus() {
    }
    // add event listener
    EventBus.addEventListener = function (type, callback) {
        var typeExists = this.listeners.has(type);
        if (!typeExists) {
            this.createType(type);
        }
        var typeListeners = this.getTypeListeners(type);
        this.addTypeListener(callback, typeListeners);
    };
    // remove event listener
    EventBus.removeEventListener = function (type, callback) {
        var typeExists = this.listeners.has(type);
        if (!typeExists) {
            return;
        }
        var typeListeners = this.getTypeListeners(type);
        this.removeTypeListeners(callback, typeListeners);
    };
    EventBus.dispatchEvent = function (type, eventData) {
        var typeExists = this.listeners.has(type);
        if (!typeExists) {
            return;
        }
        var typeListeners = this.getTypeListeners(type);
        this.executeListenersCallback(typeListeners, eventData);
    };
    EventBus.executeListenersCallback = function (typeListeners, eventData) {
        var iterator = typeListeners.getIterator();
        while (iterator.hasNext()) {
            var listenerCallback = iterator.next();
            listenerCallback.call(this, eventData);
        }
    };
    EventBus.getTypeListeners = function (type) {
        return this.listeners.get(type);
    };
    EventBus.createType = function (type) {
        var typeListeners = this.createTypeListeners(type);
        this.listeners.add(type, typeListeners);
    };
    EventBus.addTypeListener = function (callback, typeListeners) {
        typeListeners.add(callback);
    };
    EventBus.createTypeListeners = function (type) {
        return new List(type);
    };
    EventBus.removeTypeListeners = function (callback, typeListeners) {
        var iterator = typeListeners.getIterator();
        var currentTypeListeners = new Array();
        var index = -1;
        while (iterator.hasNext()) {
            index++;
            var typeListener = iterator.next();
            if (callback.toString() == typeListener.toString()) {
                currentTypeListeners.push(index);
            }
        }
        this.removeCurrentTypeListeners(currentTypeListeners, typeListeners);
        this.updateListeners(typeListeners);
    };
    EventBus.removeCurrentTypeListeners = function (currentTypeListeners, typeListeners) {
        if (currentTypeListeners.length > 0) {
            for (var i = 0; i < currentTypeListeners.length; i++) {
                var listenerToRemoveIndex = currentTypeListeners[i];
                typeListeners.remove(listenerToRemoveIndex);
            }
        }
    };
    EventBus.updateListeners = function (typeListeners) {
        if (typeListeners.size() == 0) {
            this.removeType(typeListeners);
        }
    };
    EventBus.removeType = function (typeListeners) {
        var type = typeListeners.getId();
        this.listeners.remove(type);
    };
    EventBus.listeners = new Map('listeners');
    return EventBus;
}());
module.exports = EventBus;
//# sourceMappingURL=EventBus.js.map