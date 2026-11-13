// News detail (Figma: Funding news).
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { PageHeader, Thumb } from '@/components/Page';
import { Screen, Tag } from '@/components/ui';
import { newsItems } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function NewsItem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const n = newsItems.find((x) => x.id === id) ?? newsItems[0];
  const related = newsItems.filter((x) => x.id !== n.id).slice(0, 2);
  return (
    <Screen>
      <PageHeader title="News" share={n.title} />
      <Tag label={n.category} tone="blue" />
      <Text style={[type.h3, { color: colors.grey900, marginTop: 8 }]}>{n.title}</Text>
      <Text style={[type.b3, { color: colors.grey600, marginBottom: 12 }]}>
        {n.source} • {n.ago}
      </Text>
      <Thumb icon="trending-up" h={170} />
      <View style={{ gap: 10, marginTop: 14 }}>
        <Text style={[type.b2, { color: colors.grey700 }]}>{n.summary} Analysts expect the trend to continue into next quarter as investors prioritise capital-efficient companies with clear paths to profitability.</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>For founders, this means preparing tighter metrics and a clear use-of-funds narrative before approaching investors.</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={[type.b3, { color: colors.grey600 }]}>Source: {n.source}</Text>
        </View>
        <Text style={[type.h4, { color: colors.grey900, marginTop: 10 }]}>Related Updates</Text>
        {related.map((r) => (
          <Pressable key={r.id} onPress={() => router.setParams({ id: r.id })} style={{ paddingVertical: 10, borderTopWidth: 1, borderColor: colors.borderLight }}>
            <Text style={[type.l3, { color: colors.blue }]}>{r.category}</Text>
            <Text style={[type.l2, { color: colors.grey900 }]}>{r.title}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
