// Welcome (Figma: onBoarding-1) — Get Started or Login.
import { router } from 'expo-router';
import { Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Orbit } from '@/components/Orbit';
import { Button } from '@/components/ui';
import { colors, type } from '@/theme/tokens';

export default function Welcome() {
  const { height } = useWindowDimensions();
  const orbitH = Math.max(300, Math.min(520, height - 380));
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
        <Orbit height={orbitH} />
      </View>
      <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 20, paddingTop: 36, paddingBottom: 36, gap: 24, shadowColor: colors.espressoNoir, shadowOpacity: 0.1, shadowRadius: 5 }}>
        <View style={{ gap: 12 }}>
          <Text style={[type.h1, { color: colors.grey900, textAlign: 'center' }]}>Connecting capital seekers, providers, and advisors easily.</Text>
          <Text style={[type.b1, { color: colors.grey700, textAlign: 'center' }]}>Connect, raise and close private market opportunities – powered by AI driven matching.</Text>
        </View>
        <View style={{ gap: 16 }}>
          <Button testID="get-started" title="Get Started" onPress={() => router.push('/notify-intro')} />
          <Button testID="existing-login" title="Existing User? Login" variant="outline" onPress={() => router.push('/auth/login')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
