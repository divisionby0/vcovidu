"use strict";
/*
 * (C) Copyright 2017-2019 OpenVidu (https://openvidu.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * See [[Session.activeConnections]]
 */
var Connection = /** @class */ (function () {
    /**
     * @hidden
     */
    function Connection(connectionId, createdAt, role, token, location, platform, serverData, clientData, publishers, subscribers) {
        /**
         * Array of Publisher objects this particular Connection is publishing to the Session (each Publisher object has one Stream, uniquely
         * identified by its `streamId`). You can call [[Session.forceUnpublish]] passing any of this values as parameter
         */
        this.publishers = [];
        /**
         * Array of streams (their `streamId` properties) this particular Connection is subscribed to. Each one always corresponds to one
         * Publisher of some other Connection: each string of this array must be equal to one [[Publisher.streamId]] of other Connection
         */
        this.subscribers = [];
        this.connectionId = connectionId;
        this.createdAt = createdAt;
        this.role = role;
        this.token = token;
        this.location = location;
        this.platform = platform;
        this.serverData = serverData;
        this.clientData = clientData;
        this.publishers = publishers;
        this.subscribers = subscribers;
    }
    /**
     * @hidden
     */
    Connection.prototype.equalTo = function (other) {
        var equals = (this.connectionId === other.connectionId &&
            this.createdAt === other.createdAt &&
            this.role === other.role &&
            this.token === other.token &&
            this.location === other.location &&
            this.platform === other.platform &&
            this.serverData === other.serverData &&
            this.clientData === other.clientData &&
            this.subscribers.length === other.subscribers.length &&
            this.publishers.length === other.publishers.length);
        if (equals) {
            equals = JSON.stringify(this.subscribers) === JSON.stringify(other.subscribers);
            if (equals) {
                var i = 0;
                while (equals && i < this.publishers.length) {
                    equals = this.publishers[i].equalTo(other.publishers[i]);
                    i++;
                }
                return equals;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map