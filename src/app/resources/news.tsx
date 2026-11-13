// News (Figma: News).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { PageHeader } from '@/components/Page';
import { Screen } from '@/components/ui';
import { newsItems } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function News() {
  return (
    <Screen>
      <PageHeader title="News" sub="Latest updates from the startup & investment ecosystem." />
      {newsItems.map((n) => (
        <Pressable key={n.id} testID={`news-${n.id}`} onPress={() => router.push({ pathname: '/resources/news-item', params: { id: n.id } })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.borderLight }}>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[type.l3, { color: colors.blue }]}>{n.category}</Text>
              <Text style={[type.b4, { color: colors.grey500 }]}>{n.ago}</Text>
            </View>
            <Text style={[type.l1, { color: colors.grey900 }]}>{n.title}</Text>
            <Text style={[type.b3, { color: colors.grey600 }]}>{n.summary}</Text>
            <Text style={[type.b3, { color: colors.grey700 }]}>{n.source}</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.grey600} />
        </Pressable>
      ))}
    </Screen>
  );
}
