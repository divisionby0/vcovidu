"use strict";
var Map = require("./collections/Map");
var Clients = (function () {
    function Clients() {
        this.ver = "0.0.1";
        this.collection = new Map("clients");
        console.log("Im Clients. ver=" + this.ver + " total=" + this.collection.size());
    }
    Clients.prototype.setSession = function (session, clientName) {
        console.log("setSession clientName=", clientName, " session=", session);
        var currentClient = this.getClientByName(clientName);
        if (currentClient != undefined && currentClient != null) {
            currentClient.setSession(session);
        }
        else {
            console.error("[ClientsCollection.ts] client NOT FOUND by name " + clientName);
        }
    };
    Clients.prototype.add = function (key, client) {
        this.collection.add(key, client);
    };
    Clients.prototype.remove = function (key) {
        if (this.collection.has(key)) {
            this.collection.remove(key);
            return { result: true };
        }
        else {
            return { result: false, error: "No " + key + " at collection" };
        }
    };
    Clients.prototype.get = function (key) {
        return this.collection.get(key);
    };
    Clients.prototype.has = function (userName) {
        return this.collection.has(userName);
    };
    Clients.prototype.getIterator = function () {
        return this.collection.getIterator();
    };
    ;
    Clients.prototype.getClientByName = function (name) {
        var client = null;
        var iterator = this.collection.getIterator();
        while (iterator.hasNext()) {
            var currentClient = iterator.next();
            var isSearchClient = currentClient.isNameEquals(name);
            if (isSearchClient == true) {
                return currentClient;
            }
        }
        return client;
    };
    return Clients;
}());
module.exports = Clients;
//# sourceMappingURL=Clients.js.map