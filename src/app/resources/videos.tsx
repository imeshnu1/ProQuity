// Video Library (Figma: Video Library).
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePremiumGate } from '@/components/gates';
import { Lock, PageHeader, Thumb } from '@/components/Page';
import { FilterPills, Screen, toast } from '@/components/ui';
import { videos } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function Videos() {
  const [tag, setTag] = useState('All');
  const { guard, element, premium } = usePremiumGate();
  const list = videos.filter((v) => tag === 'All' || v.tag === tag);
  return (
    <Screen>
      <PageHeader title="Video Library" />
      <FilterPills options={['All', 'Pitching', 'Fundraising']} value={tag} onChange={setTag} />
      <View style={{ gap: 14, marginTop: 14 }}>
        {list.map((v, i) => (
          <Pressable key={v.id} testID={`video-${v.id}`} onPress={() => guard(() => toast(`Playing “${v.title}”`))} style={{ backgroundColor: colors.white, borderRadius: 10, borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden' }}>
            <Thumb icon="play-circle" h={170} seed={i} style={{ borderRadius: 0 }}>
              <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>{!premium ? <Lock /> : null}</View>
              <View style={{ position: 'absolute', right: 8, bottom: 8, backgroundColor: colors.scrim, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={[type.l4, { color: colors.white }]}>{v.len}</Text>
              </View>
            </Thumb>
            <View style={{ padding: 12, gap: 4 }}>
              <Text style={[type.l2, { color: colors.grey900 }]}>{v.title}</Text>
              <Text style={[type.b3, { color: colors.grey600 }]} numberOfLines={1}>{v.summary}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="youtube" size={12} color={colors.error} />
                <Text style={[type.b4, { color: colors.grey600 }]}>Youtube</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
      {element}
    </Screen>
  );
}
