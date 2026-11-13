// Articles and Blogs (Figma: Articles and Blogs).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PageHeader, Thumb } from '@/components/Page';
import { FilterPills, Screen, Tag } from '@/components/ui';
import { articles, articleTags } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function Articles() {
  const [tag, setTag] = useState('All');
  const list = articles.filter((a) => tag === 'All' || a.tag === tag);
  return (
    <Screen>
      <PageHeader title="Articles and Blogs" />
      <FilterPills options={articleTags} value={tag} onChange={setTag} />
      <View style={{ gap: 12, marginTop: 14 }}>
        {list.length === 0 ? <Text style={[type.b2, { color: colors.grey600 }]}>No articles in this category yet.</Text> : null}
        {list.map((a, i) => (
          <Pressable key={a.id} testID={`article-${a.id}`} onPress={() => router.push({ pathname: '/resources/article', params: { id: a.id } })} style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.white, borderRadius: 10, borderWidth: 1, borderColor: colors.borderLight, padding: 10 }}>
            <Thumb icon="book-open" h={90} seed={i} style={{ width: 90 }} />
            <View style={{ flex: 1, gap: 4 }}>
              <Tag label={a.tag} tone="blue" />
              <Text style={[type.l2, { color: colors.grey900 }]} numberOfLines={1}>{a.title}</Text>
              <Text style={[type.b4, { color: colors.grey600 }]} numberOfLines={1}>{a.summary}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[type.b4, { color: colors.grey700 }]}>Proquity</Text>
                <Text style={[type.b4, { color: colors.grey600 }]}>
                  <Feather name="clock" size={10} /> {a.mins} min read
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
