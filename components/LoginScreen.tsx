import { Colors, FontFamily, FontSize } from '@/constants/styles';
import { useUser } from '@/contexts/UserContext';
import { hp, wp } from '@/utils';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [channel, setChannel] = useState('audio1to1');
  const [callMode, setCallMode] = useState<'audio' | 'video'>('audio');
  const { login } = useUser();

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (!channel.trim()) {
      Alert.alert('Error', 'Please enter a channel name');
      return;
    }

    login(username.trim(), channel.trim());
    router.push({
      pathname: '/call',
      params: { from: callMode, username: username.trim(), channel: channel.trim() }
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Agora Voice & Video</Text>
        <Text style={styles.subtitle}>Enter your details to start calling</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Channel Name</Text>
          <TextInput
            style={styles.input}
            value={channel}
            onChangeText={setChannel}
            placeholder="Enter channel name"
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.modeContainer}>
          <Text style={styles.label}>Call Mode</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                callMode === 'audio' && styles.modeButtonActive
              ]}
              onPress={() => setCallMode('audio')}
            >
              <Text style={[
                styles.modeButtonText,
                callMode === 'audio' && styles.modeButtonTextActive
              ]}>
                Audio
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                callMode === 'video' && styles.modeButtonActive
              ]}
              onPress={() => setCallMode('video')}
            >
              <Text style={[
                styles.modeButtonText,
                callMode === 'video' && styles.modeButtonTextActive
              ]}>
                Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Start Call</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: wp(8),
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xxxxl,
    fontFamily: FontFamily.InterBold,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: wp(2),
  },
  subtitle: {
    fontSize: FontSize.m,
    fontFamily: FontFamily.InterRegular,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: hp(5),
  },
  inputContainer: {
    marginBottom: hp(3),
  },
  label: {
    fontSize: FontSize.m,
    fontFamily: FontFamily.InterMedium,
    color: Colors.black,
    marginBottom: wp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: wp(3),
    padding: wp(4),
    fontSize: FontSize.m,
    fontFamily: FontFamily.InterRegular,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  modeContainer: {
    marginBottom: hp(4),
  },
  modeButtons: {
    flexDirection: 'row',
    gap: wp(3),
  },
  modeButton: {
    flex: 1,
    padding: wp(4),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeButtonText: {
    fontSize: FontSize.m,
    fontFamily: FontFamily.InterMedium,
    color: Colors.gray,
  },
  modeButtonTextActive: {
    color: Colors.white,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: wp(4),
    borderRadius: wp(3),
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: FontSize.l,
    fontFamily: FontFamily.InterBold,
    color: Colors.white,
  },
});

export default LoginScreen;
