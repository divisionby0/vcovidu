/**
 * See [[SessionProperties.recordingMode]]
 */
export declare enum RecordingMode {
    /**
     * The session is recorded automatically as soon as the first client publishes a stream to the session. It is automatically stopped
     * after last user leaves the session (or until you call [[OpenVidu.stopRecording]]).
     */
    ALWAYS = "ALWAYS",
    /**
     * The session is not recorded automatically. To record the session, you must call [[OpenVidu.startRecording]] method. To stop the recording,
     * you must call [[OpenVidu.stopRecording]].
     */
    MANUAL = "MANUAL"
}
