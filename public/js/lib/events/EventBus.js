///<reference path="../collections/List.ts"/>
///<reference path="../collections/Map.ts"/>
var EventBus;
(function (EventBus) {
    var listeners = new Map('listeners');
    // add event listener
    function addEventListener(type, callback) {
        var typeExists = listeners.has(type);
        if (!typeExists) {
            createType(type);
        }
        var typeListeners = getTypeListeners(type);
        addTypeListener(callback, typeListeners);
    }
    EventBus.addEventListener = addEventListener;
    // remove event listener
    function removeEventListener(type, callback) {
        var typeExists = listeners.has(type);
        if (!typeExists) {
            return;
        }
        var typeListeners = getTypeListeners(type);
        removeTypeListeners(callback, typeListeners);
    }
    EventBus.removeEventListener = removeEventListener;
    function dispatchEvent(type, eventData) {
        var typeExists = listeners.has(type);
        if (!typeExists) {
            return;
        }
        var typeListeners = getTypeListeners(type);
        executeListenersCallback(typeListeners, eventData);
    }
    EventBus.dispatchEvent = dispatchEvent;
    function executeListenersCallback(typeListeners, eventData) {
        var iterator = typeListeners.getIterator();
        while (iterator.hasNext()) {
            var listenerCallback = iterator.next();
            listenerCallback.call(this, eventData);
        }
    }
    function getTypeListeners(type) {
        return listeners.get(type);
    }
    function createType(type) {
        var typeListeners = createTypeListeners(type);
        listeners.add(type, typeListeners);
    }
    function addTypeListener(callback, typeListeners) {
        typeListeners.add(callback);
    }
    function createTypeListeners(type) {
        return new List(type);
    }
    function removeTypeListeners(callback, typeListeners) {
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
        removeCurrentTypeListeners(currentTypeListeners, typeListeners);
        updateListeners(typeListeners);
    }
    function removeCurrentTypeListeners(currentTypeListeners, typeListeners) {
        if (currentTypeListeners.length > 0) {
            for (var i = 0; i < currentTypeListeners.length; i++) {
                var listenerToRemoveIndex = currentTypeListeners[i];
                typeListeners.remove(listenerToRemoveIndex);
            }
        }
    }
    function updateListeners(typeListeners) {
        if (typeListeners.size() == 0) {
            removeType(typeListeners);
        }
    }
    function removeType(typeListeners) {
        var type = typeListeners.getId();
        listeners.remove(type);
    }
})(EventBus || (EventBus = {}));
//# sourceMappingURL=EventBus.js.map