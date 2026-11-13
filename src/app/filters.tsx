// Filters (Figma: Filters, Filters_locked). Free plan can use Firm Type and Funding Stage only.
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePremiumGate } from '@/components/gates';
import { Button, Checkbox, IconButton, SearchBar } from '@/components/ui';
import { filterGroups } from '@/data/sample';
import { filterCount, useFilters } from '@/store/filters';
import { colors, type } from '@/theme/tokens';

const FREE_GROUPS = ['firmType', 'stage'];

export default function Filters() {
  const { kind = 'provider' } = useLocalSearchParams<{ kind: 'provider' | 'advisor' }>();
  const saved = useFilters((s) => s[kind]);
  const setFilters = useFilters((s) => s.set);
  const { guard, element, premium } = usePremiumGate();
  const [draft, setDraft] = useState<Record<string, string[]>>(saved);
  const [group, setGroup] = useState(filterGroups[0].key);
  const [q, setQ] = useState('');
  const g = filterGroups.find((x) => x.key === group)!;
  const opts = g.options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));
  const sel = draft[group] ?? [];
  const toggle = (o: string) => setDraft({ ...draft, [group]: sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        <Text style={[type.h2, { color: colors.grey900 }]}>Filters</Text>
        <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
          <Text style={[type.l4, { color: colors.white }]}>{filterCount(draft)}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <IconButton icon="x" label="Close filters" onPress={() => (router.canGoBack() ? router.back() : router.replace(kind === 'advisor' ? '/advisors' : '/providers'))} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: 1, borderColor: colors.borderLight }}>
        <View style={{ width: 130, backgroundColor: colors.grey100, borderRightWidth: 1, borderColor: colors.borderLight }}>
          {filterGroups.map((x) => {
            const locked = !premium && !FREE_GROUPS.includes(x.key);
            const on = x.key === group;
            const count = (draft[x.key] ?? []).length;
            return (
              <Pressable
                key={x.key}
                testID={`fgroup-${x.key}`}
                onPress={() => (locked ? guard(() => setGroup(x.key)) : (setGroup(x.key), setQ('')))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 16, backgroundColor: on ? colors.white : 'transparent' }}
              >
                <Text style={[type.b2, { color: locked ? colors.grey400 : colors.grey700, flex: 1 }]}>{x.label}</Text>
                {locked ? <Feather name="lock" size={12} color={colors.grey700} /> : count ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand }} /> : null}
              </Pressable>
            );
          })}
        </View>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <View style={{ padding: 10 }}>
            <SearchBar value={q} onChangeText={setQ} placeholder="Search" />
          </View>
          <ScrollView>
            {opts.map((o) => (
              <Pressable key={o} testID={`fopt-${o}`} onPress={() => toggle(o)} accessibilityRole="checkbox" accessibilityState={{ checked: sel.includes(o) }} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.borderLight }}>
                <Text style={[type.b2, { color: colors.grey900, flex: 1 }]}>{o}</Text>
                <Checkbox on={sel.includes(o)} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white }}>
        <Button title="Clear" variant="outline" style={{ flex: 1 }} onPress={() => setDraft({})} />
        <Button
          testID="apply-filters"
          title="Apply"
          style={{ flex: 1 }}
          onPress={() => {
            setFilters(kind, draft);
            if (router.canGoBack()) router.back();
            else router.replace(kind === 'advisor' ? '/advisors' : '/providers');
          }}
        />
      </View>
      {element}
    </SafeAreaView>
  );
}
