// Bottom navigation: Capital Providers · Dashboard · Capital Advisors (Figma: BnavBar).
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/store/app-store';
import { colors, type, fonts } from '@/theme/tokens';

const tabs = [
  { name: 'providers', label: 'Capital Providers', icon: (c: string) => <Feather name="user-check" size={20} color={c} /> },
  { name: 'home', label: 'Dashboard', icon: (c: string) => <MaterialCommunityIcons name="creation" size={22} color={c} /> },
  { name: 'advisors', label: 'Capital Advisors', icon: (c: string) => <Feather name="users" size={20} color={c} /> },
];

export const unstable_settings = { initialRouteName: 'home' };

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { hydrated, signedIn } = useApp();
  if (hydrated && !signedIn) return <Redirect href="/welcome" />;
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={({ state, navigateToTab }) => (
        <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderTopWidth: 1, borderColor: colors.borderLight, paddingBottom: Math.max(insets.bottom, 10), paddingTop: 10 }}>
          {state.routes.map((r, i) => {
            const t = tabs.find((x) => x.name === r.name);
            if (!t) return null;
            const on = state.index === i;
            const c = on ? colors.brand : colors.grey500;
            return (
              <Pressable key={r.key} testID={`tab-${t.name}`} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => navigateToTab(r.key)} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                {t.icon(c)}
                <Text style={[type.b4, { color: c, fontFamily: on ? fonts.semibold : fonts.regular }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="providers" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="advisors" />
    </Tabs>
  );
}
