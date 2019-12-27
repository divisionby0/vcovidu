import { MediaMode } from './MediaMode';
import { Recording } from './Recording';
import { RecordingLayout } from './RecordingLayout';
import { RecordingMode } from './RecordingMode';
/**
 * See [[OpenVidu.createSession]]
 */
export interface SessionProperties {
    /**
     * How the media streams will be sent and received by your clients: routed through OpenVidu Media Server
     * (`MediaMode.ROUTED`) or attempting direct p2p connections (`MediaMode.RELAYED`, _not available yet_)
     */
    mediaMode?: MediaMode;
    /**
     * Whether the Session will be automatically recorded (`RecordingMode.ALWAYS`) or not (`RecordingMode.MANUAL`)
     */
    recordingMode?: RecordingMode;
    /**
     * Default value used to initialize property [[RecordingProperties.outputMode]] of every recording of this session.
     *
     * You can easily override this value later by setting [[RecordingProperties.outputMode]] to any other value
     */
    defaultOutputMode?: Recording.OutputMode;
    /**
     * Default value used to initialize property [[RecordingProperties.recordingLayout]] of every recording of this session.
     *
     * You can easily override this value later by setting [[RecordingProperties.recordingLayout]] to any other value
     */
    defaultRecordingLayout?: RecordingLayout;
    /**
     * Default value used to initialize property [[RecordingProperties.customLayout]] of every recording of this session.
     * This property can only be defined if [[SessionProperties.defaultRecordingLayout]] is set to [[RecordingLayout.CUSTOM]].
     *
     * You can easily override this value later by setting [[RecordingProperties.customLayout]] to any other value
     */
    defaultCustomLayout?: string;
    /**
     * Fix the sessionId that will be assigned to the session with this parameter. You can take advantage of this property
     * to facilitate the mapping between OpenVidu Server 'session' entities and your own 'session' entities.
     * If this parameter is undefined or an empty string, OpenVidu Server will generate a random sessionId for you.
     */
    customSessionId?: string;
}
