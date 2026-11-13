import { Newsreader_500Medium, Newsreader_600SemiBold } from '@expo-google-fonts/newsreader';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastHost } from '@/components/ui';
import { colors, fonts } from '@/theme/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({
    [fonts.regular]: PlusJakartaSans_400Regular,
    [fonts.medium]: PlusJakartaSans_500Medium,
    [fonts.semibold]: PlusJakartaSans_600SemiBold,
    [fonts.bold]: PlusJakartaSans_700Bold,
    [fonts.serif]: Newsreader_500Medium,
    [fonts.serifSemibold]: Newsreader_600SemiBold,
  });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.deepBordeaux }} />;

  // On a wide web browser, show the app inside a phone-width column.
  const isWeb = Platform.OS === 'web';
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: isWeb ? colors.webFrame : colors.bg, alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: isWeb ? 430 : undefined, backgroundColor: colors.bg, overflow: 'hidden' }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />
          <ToastHost />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
