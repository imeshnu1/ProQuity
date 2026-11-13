// Chat history (Figma: ProquityAI_history).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { BackButton, EmptyState, Screen } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function History() {
  const items = useApp((s) => s.aiHistory);
  const remove = useApp((s) => s.removeAiHistory);
  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <Text style={[type.h3, { color: colors.grey900 }]}>Chat history</Text>
      </View>
      {items.length === 0 ? <EmptyState icon="clock" title="No chats yet" /> : null}
      {items.map((h) => (
        <View key={h} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.borderLight }}>
          <Pressable style={{ flex: 1 }} onPress={() => router.push({ pathname: '/ai', params: { q: h } })}>
            <Text style={[type.b2, { color: colors.grey900 }]}>{h}</Text>
          </Pressable>
          <Feather name="trash-2" size={16} color={colors.grey600} onPress={() => remove(h)} accessibilityLabel={`Delete ${h}`} />
        </View>
      ))}
    </Screen>
  );
}
