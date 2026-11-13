// Capital Providers / Capital Advisors tab (Figma: Capital Providers, Capital Advisors).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { PersonCard } from '@/components/cards';
import { usePremiumGate } from '@/components/gates';
import { EmptyState, SearchBar, Skeleton, useFirstLoad } from '@/components/ui';
import { advisors, providers } from '@/data/sample';
import { applyFilters, filterCount, useFilters } from '@/store/filters';
import { colors, type } from '@/theme/tokens';

export function PeopleList({ kind }: { kind: 'provider' | 'advisor' }) {
  const [q, setQ] = useState('');
  const f = useFilters((s) => s[kind]);
  const { guard, element, premium } = usePremiumGate();
  const all = kind === 'provider' ? providers : advisors;
  const list = applyFilters(all, f, q);
  const n = filterCount(f);
  const loading = useFirstLoad(`people-${kind}`);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title={kind === 'provider' ? 'Capital Providers' : 'Capital Advisors'} />
      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <SearchBar
          value={q}
          onChangeText={setQ}
          placeholder="Search by company or person name"
          right={
            <Pressable testID="open-filters" accessibilityLabel="Filters" onPress={() => router.push({ pathname: '/filters', params: { kind } })} hitSlop={8}>
              <Feather name="sliders" size={18} color={colors.grey700} />
              {n ? (
                <View style={{ position: 'absolute', top: -8, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[type.l4, { color: colors.white, fontSize: 10 }]}>{n}</Text>
                </View>
              ) : null}
            </Pressable>
          }
        />
        {!premium ? (
          <Pressable onPress={() => guard(() => {})} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 10 }}>
            <Feather name="lock" size={12} color={colors.grey600} />
            <Text style={[type.b3, { color: colors.grey600 }]}>Names and firms are hidden on the free plan. <Text style={{ color: colors.brand, textDecorationLine: 'underline' }}>Upgrade</Text></Text>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        data={loading ? [] : list}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => <PersonCard p={item} locked={!premium} onPress={() => guard(() => router.push({ pathname: '/investor/[id]', params: { id: item.id, list: kind } }))} />}
        ListEmptyComponent={loading ? (
          <View style={{ gap: 12 }} testID="list-skeleton">
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ padding: 16, gap: 10, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Skeleton h={52} w={52} r={26} />
                  <View style={{ flex: 1, gap: 8 }}>
                    <Skeleton h={14} w="60%" />
                    <Skeleton h={10} w="30%" />
                  </View>
                </View>
                <Skeleton h={10} w="75%" />
              </View>
            ))}
          </View>
        ) : <EmptyState icon="search" title="No matches found" body="Try removing a filter or searching a different name." />}
      />
      {element}
    </SafeAreaView>
  );
}
