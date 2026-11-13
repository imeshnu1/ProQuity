// Legal Document Templates (Figma: Legal docs, Preview Legal doc).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePremiumGate } from '@/components/gates';
import { PageHeader, Thumb } from '@/components/Page';
import { FilterPills, Screen } from '@/components/ui';
import { legalDocs, legalTags } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function Legal() {
  const [tag, setTag] = useState('All');
  const { guard, element, premium } = usePremiumGate();
  const list = legalDocs.filter((d) => tag === 'All' || d.tag === tag);
  return (
    <Screen>
      <PageHeader title="Legal Document Templates" />
      <Thumb icon="file-text" h={150} />
      <View style={{ marginVertical: 14 }}>
        <FilterPills options={legalTags} value={tag} onChange={setTag} />
      </View>
      <View style={{ gap: 10 }}>
        {list.map((d) => {
          const locked = d.locked && !premium;
          return (
            <Pressable key={d.id} testID={`legal-${d.id}`} onPress={() => {
                const open = () => router.push({ pathname: '/resources/legal-doc', params: { id: d.id } });
                return locked ? guard(open) : open();
              }} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight }}>
              <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: colors.grey100, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="file-text" size={16} color={colors.grey700} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.l2, { color: colors.grey900 }]}>{d.title}</Text>
                <Text style={[type.b3, { color: colors.grey600 }]} numberOfLines={1}>{d.summary}</Text>
                <Text style={[type.b4, { color: colors.grey500 }]}>{d.meta}</Text>
              </View>
              {locked ? <Feather name="lock" size={16} color={colors.grey700} /> : <Feather name="chevron-right" size={16} color={colors.grey700} />}
            </Pressable>
          );
        })}
      </View>
      {element}
    </Screen>
  );
}
