// Article detail (Figma: Articles and Blogs 2).
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { PageHeader, Thumb } from '@/components/Page';
import { Avatar, Screen, Tag } from '@/components/ui';
import { articles } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function Article() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = articles.find((x) => x.id === id) ?? articles[0];
  const next = articles.filter((x) => x.id !== a.id).slice(0, 2);
  return (
    <Screen>
      <PageHeader title="Articles and Blogs" share={a.title} />
      <Thumb icon="book-open" h={180} />
      <View style={{ gap: 10, marginTop: 14 }}>
        <Tag label={a.tag} tone="blue" />
        <Text style={[type.h2, { color: colors.grey900 }]}>{a.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Avatar name="Proquity" size={28} dark={false} />
          <View>
            <Text style={[type.l3, { color: colors.grey900 }]}>Proquity</Text>
            <Text style={[type.b4, { color: colors.grey600 }]}>Published Jan 9 • {a.mins} min read</Text>
          </View>
        </View>
        <Text style={[type.b2, { color: colors.grey700 }]}>{a.summary} Founders often struggle with the details — this guide walks through what matters, what investors expect, and the mistakes to avoid.</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>In this guide, we’ll explore the practical steps, real examples from recent rounds and a checklist you can use before your next investor conversation.</Text>
        <Text style={[type.h4, { color: colors.grey900 }]}>Key Terms Explained</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>• Liquidation Preference{'\n'}• Anti-Dilution Provisions{'\n'}• Pro-rata rights and more.</Text>
        <Text style={[type.h4, { color: colors.grey900, marginTop: 10 }]}>Read Next</Text>
        {next.map((n) => (
          <Pressable key={n.id} onPress={() => router.setParams({ id: n.id })} style={{ padding: 12, borderRadius: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, gap: 4 }}>
            <Tag label={n.tag} tone="blue" />
            <Text style={[type.l2, { color: colors.grey900 }]}>{n.title}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
