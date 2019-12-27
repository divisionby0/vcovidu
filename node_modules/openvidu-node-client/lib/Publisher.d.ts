/**
 * See [[Connection.publishers]]
 *
 * This is a backend representation of a published media stream (see [OpenVidu Browser Stream class](/api/openvidu-browser/classes/stream.html))
 */
export declare class Publisher {
    /**
     * Unique identifier of the [Stream](/api/openvidu-browser/classes/stream.html) associated to this Publisher.
     * Each Publisher is paired with only one Stream, so you can identify each Publisher by its
     * [`Stream.streamId`](/api/openvidu-browser/classes/stream.html#streamid)
     */
    streamId: string;
    /**
     * Timestamp when this Publisher started publishing, in UTC milliseconds (ms since Jan 1, 1970, 00:00:00 UTC)
     */
    createdAt: number;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    hasAudio: boolean;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    hasVideo: boolean;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    audioActive: boolean;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    videoActive: boolean;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    frameRate: number;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    typeOfVideo: string;
    /**
     * See properties of [Stream](/api/openvidu-browser/classes/stream.html) object in OpenVidu Browser library to find out more
     */
    videoDimensions: string;
    /**
     * @hidden
     */
    constructor(json: any);
    /**
     * @hidden
     */
    equalTo(other: Publisher): boolean;
}
