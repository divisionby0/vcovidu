/**
 * See [[SessionProperties.mediaMode]]
 */
export declare enum MediaMode {
    /**
     * _(not available yet)_ The session will attempt to transmit streams directly between clients
     */
    RELAYED = "RELAYED",
    /**
     * The session will transmit streams using OpenVidu Media Server
     */
    ROUTED = "ROUTED"
}
