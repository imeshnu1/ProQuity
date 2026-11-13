// Resources hub (Figma: Resources).
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { PageHeader, Thumb } from '@/components/Page';
import { Screen, type IconName } from '@/components/ui';
import { type, colors } from '@/theme/tokens';

const items: { t: string; s: string; icon: IconName; to: string }[] = [
  { t: 'Sample Decks', s: 'Real examples of winning PDF’s', icon: 'folder', to: '/resources/decks' },
  { t: 'Legal Documents', s: 'Agreements, NDA’s & Term sheets', icon: 'file-text', to: '/resources/legal' },
  { t: 'Calculators', s: 'Burn rate and Runway tools', icon: 'percent', to: '/resources/calculators' },
  { t: 'Video Library', s: 'Expert Fundraising advice', icon: 'film', to: '/resources/videos' },
  { t: 'Articles & Blogs', s: 'Deep dives on strategy & growth', icon: 'book-open', to: '/resources/articles' },
  { t: 'News', s: 'Market trends and updates', icon: 'trending-up', to: '/resources/news' },
];

export default function Resources() {
  return (
    <Screen>
      <PageHeader title="Resources" sub="Tools, templates and insights to help you prepare and raise capital with confidence." />
      <View style={{ gap: 14 }}>
        {items.map((it, i) => (
          <Pressable key={it.t} testID={`res-${it.t}`} onPress={() => router.push(it.to as any)} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
            <Thumb icon={it.icon} h={120} seed={i}>
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: colors.scrim }}>
                <Text style={[type.h4, { color: colors.white }]}>{it.t}</Text>
                <Text style={[type.b3, { color: colors.roseWash }]}>{it.s}</Text>
              </View>
            </Thumb>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
