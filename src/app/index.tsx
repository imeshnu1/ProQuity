// Splash screen (Figma: SplashScreen). Decides where to go once saved data has loaded.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useApp } from '@/store/app-store';
import { colors, fonts, type } from '@/theme/tokens';

export default function Splash() {
  const hydrated = useApp((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      const s = useApp.getState();
      if (s.signedIn && s.onboarded) router.replace('/home');
      else if (s.signedIn) router.replace('/onboarding/intent');
      else router.replace('/welcome');
    }, 1400);
    return () => clearTimeout(t);
  }, [hydrated]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.deepBordeaux, alignItems: 'center', justifyContent: 'center' }} testID="splash">
      <StatusBar style="light" />
      <View style={{ alignItems: 'center', gap: 14, marginTop: 20 }}>
        <Image source={require('../../assets/images/splash-orb.png')} style={{ width: 293, height: 234 }} contentFit="contain" />
        <Text style={{ fontFamily: fonts.serifSemibold, fontSize: 38, color: colors.white, letterSpacing: 1, textTransform: 'uppercase' }}>Proquity</Text>
      </View>
      <Text style={[type.l2, { color: colors.white, position: 'absolute', bottom: 60 }]}>version 1.0</Text>
    </View>
  );
}
