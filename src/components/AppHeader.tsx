// Top bar of the main tabs (hamburger · title · messages) and the side menu (Figma: Home menu).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, IconButton, type IconName } from '@/components/ui';
import { fullName, isPremium, useApp } from '@/store/app-store';
import { colors, type, fonts } from '@/theme/tokens';

export function AppHeader({ title, premiumBadge }: { title: string; premiumBadge?: boolean }) {
  const [open, setOpen] = useState(false);
  const premium = useApp((s) => isPremium(s.plan));
  const unread = useApp((s) => s.conversations.some((c) => c.unread));
  return (
    <>
      <View style={st.bar}>
        <IconButton testID="open-menu" icon="menu" label="Open menu" onPress={() => setOpen(true)} />
        <Text style={[type.h2, { color: colors.grey900, flexShrink: 1 }]} numberOfLines={1} testID="screen-title">
          {title}
        </Text>
        {premiumBadge && premium ? (
          <View testID="premium-badge" accessibilityLabel="Premium member" style={{ backgroundColor: colors.forestOlive, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1, marginLeft: -4 }}>
            <Text style={[type.l4, { color: colors.white }]}>P</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        <Pressable testID="open-messages" accessibilityLabel="Messages" onPress={() => router.push('/messages')} style={st.msgBtn}>
          <Feather name="message-square" size={18} color={colors.brand} />
          {unread ? <View style={st.dot} /> : null}
        </Pressable>
      </View>
      <SideMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const items: { icon: IconName; label: string; to: string }[] = [
  { icon: 'calendar', label: 'Pitch Call', to: '/pitch-calls' },
  { icon: 'file-text', label: 'News', to: '/resources/news' },
  { icon: 'book-open', label: 'Blogs', to: '/resources/articles' },
  { icon: 'folder', label: 'Resources', to: '/resources' },
  { icon: 'settings', label: 'Settings', to: '/settings' },
  { icon: 'bell', label: 'Notifications', to: '/notifications' },
];

function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const s = useApp();
  const [x] = useState(() => new Animated.Value(-320));
  useEffect(() => {
    Animated.timing(x, { toValue: open ? 0 : -320, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [open, x]);
  const go = (to: string) => {
    onClose();
    setTimeout(() => router.push(to as any), 120);
  };
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.overlay }}>
        <Animated.View style={[st.menu, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16, transform: [{ translateX: x }] }]}>
          <IconButton icon="x" label="Close menu" onPress={onClose} style={{ marginLeft: -6 }} size={22} />
          <View style={{ alignItems: 'flex-start', gap: 8, marginTop: 24 }}>
            <Avatar name={fullName(s.profile)} photo={s.profile.photo} size={56} dark={false} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[type.h3, { color: colors.white }]}>{fullName(s.profile)}</Text>
              {isPremium(s.plan) ? (
                <View style={{ backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 5 }}>
                  <Text style={[type.l4, { color: colors.white }]}>P</Text>
                </View>
              ) : null}
            </View>
            <View style={{ backgroundColor: colors.blueLight, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 }}>
              <Text style={[type.l4, { color: colors.blue }]}>{s.profile.headline} • Capital Seeker</Text>
            </View>
            <Text testID="menu-profile" onPress={() => go('/profile')} style={[type.l2, { color: colors.white, textDecorationLine: 'underline', marginTop: 4 }]}>
              View Profile
            </Text>
          </View>
          <View style={{ marginTop: 28, gap: 4 }}>
            {items.map((i) => (
              <Pressable key={i.label} testID={`menu-${i.label}`} onPress={() => go(i.to)} style={({ pressed }) => [st.item, pressed && { opacity: 0.6 }]}>
                <Feather name={i.icon} size={18} color={colors.white} />
                <Text style={[type.b1, { color: colors.white }]}>{i.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flex: 1 }} />
          {!isPremium(s.plan) && !s.premiumBannerDismissed ? (
            <View style={st.promo}>
              <Pressable onPress={s.dismissPremiumBanner} style={{ position: 'absolute', right: 10, top: 10 }} accessibilityLabel="Dismiss">
                <Feather name="x" size={14} color={colors.white} />
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <Feather name="award" size={14} color={colors.white} />
                <Text style={[type.l2, { color: colors.white }]}>Unlock Premium Access</Text>
              </View>
              <Text style={[type.b3, { color: colors.oliveWash, marginVertical: 6 }]}>Get full access to capital providers, pitch calls and advanced Proquity AI insights.</Text>
              <Pressable onPress={() => go('/paywall')} style={{ backgroundColor: colors.brand, borderRadius: 30, paddingVertical: 9, alignItems: 'center' }}>
                <Text style={[type.l3, { color: colors.white }]}>Upgrade to Premium</Text>
              </Pressable>
            </View>
          ) : null}
        </Animated.View>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close menu" />
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10 },
  msgBtn: { width: 38, height: 38, borderRadius: 6, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgDefault },
  dot: { position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.error },
  menu: { width: 300, backgroundColor: colors.brand, paddingHorizontal: 20 },
  item: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 12 },
  promo: { backgroundColor: colors.accent, borderRadius: 10, padding: 14 },
});
