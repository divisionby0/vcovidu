"use strict";
var Room = (function () {
    function Room(name, sessionName) {
        this.name = name;
        this.sessionName = sessionName;
        console.log("new Room name=" + this.name + "  sessionName=" + this.sessionName);
    }
    return Room;
}());
module.exports = Room;
//# sourceMappingURL=Room.js.map