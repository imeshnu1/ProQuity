// "Proquity would like to:" LinkedIn authorise screen (Figma: Authorize-linked-screen).
// BACKEND: replace with the real LinkedIn OAuth flow (expo-auth-session).
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { PLogo } from '@/components/Orbit';
import { Button, Screen, toast } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, type, fonts } from '@/theme/tokens';

export default function LinkedInAuth() {
  const { next = 'signup' } = useLocalSearchParams<{ next: string }>();
  const signIn = useApp((s) => s.signIn);
  const [busy, setBusy] = useState(false);
  const allow = () => {
    setBusy(true);
    setTimeout(() => {
      if (next === 'login') {
        signIn('linkedin', 'johndoe@gmail.com', true);
        router.replace('/home');
      } else {
        signIn('linkedin', 'johndoe@gmail.com');
        toast('Details fetched from LinkedIn');
        router.replace('/onboarding/intent');
      }
    }, 600);
  };
  return (
    <Screen style={{ justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: -40, zIndex: 2, flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
        <View style={{ width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="linkedin" size={28} color={colors.linkedin} />
        </View>
        <PLogo size={80} />
      </View>
      <View style={{ backgroundColor: colors.white, borderRadius: 12, padding: 20, paddingTop: 56, gap: 10, borderWidth: 1, borderColor: colors.borderLight }}>
        <Text style={[type.l1, { color: colors.grey900 }]}>
          <Text style={{ fontFamily: fonts.bold }}>Proquity</Text> would like to:
        </Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>• Use your name and profile picture</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>• Use the primary email address associated with your LinkedIn account</Text>
        <Text style={[type.b3, { color: colors.grey600, marginTop: 8 }]}>
          You can stop this sync in your LinkedIn <Text style={{ fontFamily: fonts.bold }}>settings</Text>. Proquity <Text style={{ fontFamily: fonts.bold }}>terms</Text> apply. <Text style={{ fontFamily: fonts.bold }}>Learn more</Text>.
        </Text>
      </View>
      <View style={{ gap: 12, marginTop: 20 }}>
        <Button testID="linkedin-allow" title="Allow" loading={busy} onPress={allow} />
        <Button title="Cancel" variant="outline" onPress={() => router.back()} />
        <Text style={[type.b3, { color: colors.grey600, textAlign: 'center' }]}>
          You will be redirected to{'\n'}
          <Text style={{ fontFamily: fonts.bold }}>Proquity/app</Text>
        </Text>
      </View>
    </Screen>
  );
}
