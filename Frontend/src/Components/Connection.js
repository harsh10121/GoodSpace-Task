import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { avatarAppConfig } from "./config";
const cogSvcRegion = avatarAppConfig.cogSvcRegion
const cogSvcSubKey = avatarAppConfig.cogSvcSubKey
const voiceName = avatarAppConfig.voiceName
const avatarCharacter = avatarAppConfig.avatarCharacter
const avatarStyle = avatarAppConfig.avatarStyle
const avatarBackgroundColor = "#000000";

export const createWebRTCConnection = (iceServerUrl, iceServerUsername, iceServerCredential) => {

    var peerConnection = new RTCPeerConnection({
        iceServers: [{
            urls: [ iceServerUrl ],
            username: iceServerUsername,
            credential: iceServerCredential
        }]
    })
    return peerConnection;
}

export const createAvatarSynthesizer = () => {

    const speechSynthesisConfig = SpeechSDK.SpeechConfig.fromSubscription(cogSvcSubKey, cogSvcRegion)

    speechSynthesisConfig.speechSynthesisVoiceName = voiceName;

    const videoFormat = new SpeechSDK.AvatarVideoFormat()

    let videoCropTopLeftX =  700
    let videoCropBottomRightX = 1250
    videoFormat.setCropRange(new SpeechSDK.Coordinate(videoCropTopLeftX, 40), new SpeechSDK.Coordinate(videoCropBottomRightX, 1080));


    const talkingAvatarCharacter = avatarCharacter
    const talkingAvatarStyle = avatarStyle

    const avatarConfig = new SpeechSDK.AvatarConfig(talkingAvatarCharacter, talkingAvatarStyle, videoFormat)
    avatarConfig.backgroundColor = "black";
    let avatarSynthesizer = new SpeechSDK.AvatarSynthesizer(speechSynthesisConfig, avatarConfig)

    avatarSynthesizer.avatarEventReceived = function (s, e) {
        var offsetMessage = ", offset from session start: " + e.offset / 10000 + "ms."
        if (e.offset === 0) {
            offsetMessage = ""
        }
        console.log("Event received: " + e.description + offsetMessage)
    }

    return avatarSynthesizer;

}