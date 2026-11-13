// Calculators list (Figma: Calculators / Valuation Calculator tabs).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePremiumGate } from '@/components/gates';
import { PageHeader } from '@/components/Page';
import { FilterPills, Screen } from '@/components/ui';
import { calculators } from '@/data/calculators';
import { colors, type } from '@/theme/tokens';

export default function Calculators() {
  const [tab, setTab] = useState<'Calculator' | 'Valuation Calculator'>('Calculator');
  const { guard, element, premium } = usePremiumGate();
  return (
    <Screen>
      <PageHeader title="Calculator" />
      <FilterPills options={['Calculator', 'Valuation Calculator']} value={tab} onChange={(v) => setTab(v as any)} />
      <View style={{ gap: 12, marginTop: 14 }}>
        {calculators
          .filter((c) => c.group === tab)
          .map((c) => {
            const locked = !c.free && !premium;
            const open = () => router.push({ pathname: '/resources/calculator', params: { id: c.id } });
            return (
              <View key={c.id} style={{ backgroundColor: colors.white, borderRadius: 10, borderWidth: 1, borderColor: colors.borderLight, padding: 14, gap: 6 }}>
                <View style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={c.icon as any} size={16} color={colors.blue} />
                </View>
                <Text style={[type.l1, { color: colors.grey900, marginTop: 4 }]}>{c.title}</Text>
                <Text style={[type.b3, { color: colors.grey600 }]}>{c.blurb}</Text>
                <Pressable testID={`calc-${c.id}`} onPress={() => (locked ? guard(open) : open())} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.grey100, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, marginTop: 6 }}>
                  <Text style={[type.l3, { color: colors.grey900 }]}>{c.group === 'Calculator' ? 'Open Tool' : 'Calculate'}</Text>
                  <Feather name={locked ? 'lock' : 'chevron-right'} size={14} color={colors.grey700} />
                </Pressable>
              </View>
            );
          })}
      </View>
      {element}
    </Screen>
  );
}
