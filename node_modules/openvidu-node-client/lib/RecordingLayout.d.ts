/**
 * See [[SessionProperties.defaultRecordingLayout]] and [[RecordingProperties.recordingLayout]]
 */
export declare enum RecordingLayout {
    /**
     * All the videos are evenly distributed, taking up as much space as possible
     */
    BEST_FIT = "BEST_FIT",
    /**
     * _(not available yet)_
     */
    PICTURE_IN_PICTURE = "PICTURE_IN_PICTURE",
    /**
     * _(not available yet)_
     */
    VERTICAL_PRESENTATION = "VERTICAL_PRESENTATION",
    /**
     * _(not available yet)_
     */
    HORIZONTAL_PRESENTATION = "VERTICAL_PRESENTATION",
    /**
     * Use your own custom recording layout. See [Custom recording layouts](/docs/advanced-features/recording#custom-recording-layouts) to learn more
     */
    CUSTOM = "CUSTOM"
}
