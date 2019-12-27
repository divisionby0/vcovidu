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
 * See [[Connection.publishers]]
 *
 * This is a backend representation of a published media stream (see [OpenVidu Browser Stream class](/api/openvidu-browser/classes/stream.html))
 */
var Publisher = /** @class */ (function () {
    /**
     * @hidden
     */
    function Publisher(json) {
        this.streamId = json.streamId;
        this.createdAt = json.createdAt;
        this.hasAudio = json.mediaOptions.hasAudio;
        this.hasVideo = json.mediaOptions.hasVideo;
        this.audioActive = json.mediaOptions.audioActive;
        this.videoActive = json.mediaOptions.videoActive;
        this.frameRate = json.mediaOptions.frameRate;
        this.typeOfVideo = json.mediaOptions.typeOfVideo;
        this.videoDimensions = json.mediaOptions.videoDimensions;
    }
    /**
     * @hidden
     */
    Publisher.prototype.equalTo = function (other) {
        return (this.streamId === other.streamId &&
            this.createdAt === other.createdAt &&
            this.hasAudio === other.hasAudio &&
            this.hasVideo === other.hasVideo &&
            this.audioActive === other.audioActive &&
            this.videoActive === other.videoActive &&
            this.frameRate === other.frameRate &&
            this.typeOfVideo === other.typeOfVideo &&
            this.videoDimensions === other.videoDimensions);
    };
    return Publisher;
}());
exports.Publisher = Publisher;
//# sourceMappingURL=Publisher.js.map