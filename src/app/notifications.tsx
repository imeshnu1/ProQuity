// Notifications (Figma: Notification).
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { BackButton, Screen } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function Notifications() {
  const items = useApp((s) => s.notifications);
  const days = Array.from(new Set(items.map((i) => i.day)));
  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <Text style={[type.h2, { color: colors.grey900 }]}>Notifications</Text>
      </View>
      {days.map((d) => (
        <View key={d} style={{ marginTop: 8 }}>
          <Text style={[type.l2, { color: colors.grey700, marginBottom: 6 }]}>{d}</Text>
          {items
            .filter((i) => i.day === d)
            .map((i) => (
              <View key={i.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 10 }}>
                <Feather name="bell" size={16} color={colors.brand} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[type.l2, { color: colors.grey900 }]}>{i.title}</Text>
                  <Text style={[type.b3, { color: colors.grey600 }]} numberOfLines={2}>
                    {i.body}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      ))}
    </Screen>
  );
}
