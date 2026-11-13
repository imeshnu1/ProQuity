// "How to see messages from other users?" (Figma: Enable notification step before Role Selection).
// BACKEND: call expo-notifications requestPermissionsAsync() where marked.
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackButton, Dialog, H1, Screen } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, fonts, radius, type } from '@/theme/tokens';

export default function NotifyIntro() {
  const setNotifications = useApp((s) => s.setNotifications);
  const [system, setSystem] = useState(false);
  const next = (on: boolean) => {
    setNotifications(on);
    setSystem(false);
    router.replace('/role');
  };
  return (
    <Screen>
      <View style={{ gap: 18, paddingTop: 12, flex: 1 }}>
        <BackButton />
        <H1>How to see messages from other users?</H1>
        <Text style={[type.b1, { color: colors.grey600 }]}>Proquity works like a messaging app, notifications are key to the experience.</Text>
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 30 }}>
          <View style={{ backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden', marginHorizontal: 12 }}>
            <View style={{ padding: 18, gap: 10 }}>
              <Text style={[type.b2, { color: colors.grey600 }]}>“Proquity” would like to send you notifications</Text>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.grey100 }} />
              <View style={{ height: 8, width: '70%', borderRadius: 4, backgroundColor: colors.grey100 }} />
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: colors.borderLight }}>
              <Pressable testID="notify-intro-later" onPress={() => next(false)} style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
                <Text style={[type.l1, { color: colors.grey700 }]}>Not now</Text>
              </Pressable>
              <Pressable testID="notify-intro-allow" onPress={() => setSystem(true)} style={{ flex: 1, alignItems: 'center', paddingVertical: 14, backgroundColor: colors.brand }}>
                <Text style={[type.l1, { color: colors.white, fontFamily: fonts.semibold }]}>Allow</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', paddingRight: 60, marginTop: 14 }}>
            <Feather name="corner-left-up" size={34} color={colors.grey500} style={{ transform: [{ scaleX: -1 }] }} />
          </View>
        </View>
        <Text style={[type.b3, { color: colors.grey500, textAlign: 'center', marginBottom: 12, borderRadius: radius.sm }]}>You can change this anytime in Settings.</Text>
      </View>
      <Dialog
        visible={system}
        title="Turn on Notifications"
        body="This help you stay updated on important updates and messages related to your opportunity."
        icon={null}
        actions={[
          { label: 'Allow Notifications', variant: 'link', onPress: () => next(true) },
          { label: 'Don’t Allow', variant: 'link', onPress: () => next(false) },
        ]}
      />
    </Screen>
  );
}
