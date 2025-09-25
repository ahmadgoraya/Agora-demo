import { ProfileImage } from "@/assets/images";
import { Colors, FontFamily, FontSize } from "@/constants/styles";
import { useUser } from "@/contexts/UserContext";
import { hp, wp } from "@/utils";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  RtcConnection,
  RtcSurfaceView,
} from "react-native-agora";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const APP_ID = "7933231f139a4207b1d63d9bb3a7be15";

type CallMode = "audio" | "video";

type Params = {
  from: CallMode;
  channel?: string;
};

const CallScreen: React.FC = () => {
  const { from, channel } = useLocalSearchParams<Params>();
  const { user, logout } = useUser();
  const [callMode, setCallMode] = useState<CallMode>(from);
  const [videoDisabled, setVideoDisabled] = useState<boolean>(from == "audio");
  const [audioDisabled, setAudioDisabled] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(true);
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const eventHandler = useRef<any>(null);
  const engine = useRef<any>(null);
  const { top, bottom } = useSafeAreaInsets();

  // Use dynamic values or fallback to defaults
  const currentChannel = channel || user?.channel || "audio1to1";

  useEffect(() => {
    engine.current?.enableLocalAudio(!audioDisabled);
  }, [audioDisabled]);

  useEffect(() => {
    engine.current?.enableLocalVideo(!videoDisabled);
  }, [videoDisabled]);

  const getPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const setupLocalVideo = () => {
    engine.current?.enableVideo();
    engine.current?.startPreview();
  };

  const rotateCamera = () => engine.current?.switchCamera();

  const handleCallEnd = async () => {
    await engine.current?.unregisterEventHandler(eventHandler.current!);
    await engine.current?.release();
    setJoined(false);
    logout();
    router.replace("/");
  };

  const init = async () => {
    await getPermission();
    const eng = createAgoraRtcEngine();
    eng.initialize({ appId: APP_ID });
    eventHandler.current = {
      onJoinChannelSuccess: () => {
        callMode == "video" && setupLocalVideo();
        setJoined(true);
      },
      // Triggered when a remote user joins the channel
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
        setTimeout(() => {
          setIsCalling(false);
        }, 0);
      },
      // Triggered when a remote user leaves the channel
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
        handleCallEnd();
      },
      onError: (err: any, msg: string) => {
        console.log("on error: ", err, msg);
      },
    };
    eng.registerEventHandler(eventHandler.current);
    engine.current = eng;
  };

  const join = async () => {
    if (joined) {
      return;
    }
    // Join the channel as a broadcaster
    engine.current?.joinChannel(undefined, currentChannel, 0, {
      // Set channel profile to live broadcast
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      // Set user role to broadcaster
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  useEffect(() => {
    (async () => {
      await init();
      join();
    })();
    return () => {
      engine.current?.unregisterEventHandler(eventHandler.current!);
      engine.current?.release();
    };
  }, []);

  return callMode == "video" ? (
    <View style={[stylesVideo.container, { paddingTop: top + wp(5) }]}>
      {!isCalling && remoteUid && (
        <RtcSurfaceView
          canvas={{ uid: remoteUid }}
          style={stylesVideo.cameraPreviewLarge}
        />
      )}
      {!isCalling && (
        <RtcSurfaceView
          canvas={{ uid: 0 }}
          style={[stylesVideo.cameraPreviewSmall, { bottom: bottom + wp(30) }]}
        />
      )}
      <LinearGradient
        colors={[Colors.black, "transparent"]}
        style={stylesVideo.topLinearGradient}
      />
      <LinearGradient
        colors={["transparent", Colors.black]}
        style={stylesVideo.bottomLinearGradient}
      />
      <View style={stylesVideo.header}>
        {!isCalling && (
          <TouchableOpacity onPress={rotateCamera}>
            <FontAwesome6
              name="arrows-rotate"
              color={Colors.white}
              size={wp(5)}
            />
          </TouchableOpacity>
        )}
      </View>
      {isCalling && <Text style={stylesVideo.calling}>Calling...</Text>}
      <View style={[stylesVideo.btmBtnsContainer, { marginBottom: bottom }]}>
        <TouchableOpacity
          style={styles.sideBtn}
          hitSlop={5}
          onPress={() => setAudioDisabled((prev) => !prev)}
        >
          {audioDisabled ? (
            <Feather name="mic-off" color={Colors.white} size={wp(5)} />
          ) : (
            <Feather name="mic" color={Colors.white} size={wp(5)} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={stylesVideo.callBtn} onPress={handleCallEnd}>
          <Feather name="phone" color={Colors.white} size={wp(8)} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sideBtn}
          hitSlop={5}
          onPress={() => setVideoDisabled((prev) => !prev)}
        >
          {videoDisabled ? (
            <Feather name="video-off" color={Colors.white} size={wp(5)} />
          ) : (
            <Feather name="video" color={Colors.white} size={wp(5)} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Image source={ProfileImage} style={styles.profileImage} />
          </View>
        </View>
        {isCalling && <Text style={styles.calling}>Calling...</Text>}
      </View>
      <View style={[styles.btmBtnsContainer, { marginBottom: bottom }]}>
        <TouchableOpacity
          style={styles.sideBtn}
          hitSlop={5}
          onPress={() => setAudioDisabled((prev) => !prev)}
        >
          {audioDisabled ? (
            <Feather name="mic-off" color={Colors.white} size={wp(5)} />
          ) : (
            <Feather name="mic" color={Colors.white} size={wp(5)} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn} onPress={handleCallEnd}>
          <Feather name="phone" color={Colors.white} size={wp(8)} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sideBtn}
          hitSlop={5}
          onPress={() => {
            setCallMode("video");
            setupLocalVideo();
            setVideoDisabled((prev) => !prev);
          }}
        >
          {videoDisabled ? (
            <Feather name="video-off" color={Colors.white} size={wp(5)} />
          ) : (
            <Feather name="video" color={Colors.white} size={wp(5)} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: wp(8),
    paddingTop: hp(15),
    justifyContent: "space-between",
    alignItems: "center",
  },
  outerCircle: {
    height: wp(80),
    width: wp(80),
    borderRadius: wp(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(41, 85, 160, 0.04)",
  },
  innerCircle: {
    height: wp(65),
    width: wp(65),
    borderRadius: wp(33),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(41, 85, 160, 0.06)",
  },
  profileImage: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(25),
  },
  name: {
    fontSize: FontSize.xxxxl,
    fontFamily: FontFamily.InterMedium,
    color: Colors.black,
    textAlign: "center",
    marginTop: wp(5),
  },
  calling: {
    fontSize: FontSize.s,
    fontFamily: FontFamily.InterRegular,
    color: Colors.black,
    textAlign: "center",
    marginTop: wp(5),
  },
  btmBtnsContainer: {
    flexDirection: "row",
    gap: wp(10),
    alignItems: "center",
  },
  sideBtn: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: "rgba(128, 128, 128, 0.58)",
    justifyContent: "center",
    alignItems: "center",
  },
  callBtn: {
    height: wp(20),
    width: wp(20),
    borderRadius: wp(10),
    backgroundColor: "rgba(226, 63, 63, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

const stylesVideo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: wp(8),
    paddingTop: hp(15),
    justifyContent: "space-between",
  },
  outerCircle: {
    height: wp(80),
    width: wp(80),
    borderRadius: wp(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(41, 85, 160, 0.04)",
  },
  innerCircle: {
    height: wp(65),
    width: wp(65),
    borderRadius: wp(33),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(41, 85, 160, 0.06)",
  },
  cameraPreviewLarge: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: hp(100),
    width: wp(100),
  },
  cameraPreviewSmall: {
    position: "absolute",
    right: wp(8),
    height: wp(48),
    width: wp(35),
    borderRadius: wp(5),
    borderWidth: 5,
    borderColor: Colors.white,
    zIndex: 2,
  },
  header: {
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: FontSize.xxxxl,
    fontFamily: FontFamily.InterMedium,
    color: Colors.white,
  },
  calling: {
    fontSize: FontSize.l,
    fontFamily: FontFamily.InterRegular,
    color: Colors.black,
    textAlign: "center",
  },
  btmBtnsContainer: {
    flexDirection: "row",
    gap: wp(10),
    alignItems: "center",
    alignSelf: "center",
    zIndex: 1,
  },
  sideBtn: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: "rgba(128, 128, 128, 0.58)",
    justifyContent: "center",
    alignItems: "center",
  },
  callBtn: {
    height: wp(16),
    width: wp(16),
    borderRadius: wp(8),
    backgroundColor: "rgba(226, 63, 63, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  topLinearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: wp(80),
  },
  bottomLinearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: wp(80),
  },
});
