// Sample Pitch Decks (Figma: Sample Pitch Deck list).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePremiumGate } from '@/components/gates';
import { PageHeader, Thumb } from '@/components/Page';
import { Screen, SearchBar } from '@/components/ui';
import { pitchDecks } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

export default function Decks() {
  const [q, setQ] = useState('');
  const { guard, element, premium } = usePremiumGate();
  const list = pitchDecks.filter((d) => `${d.company} ${d.tagline}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen>
      <PageHeader title="Sample Pitch Decks" />
      <Thumb icon="monitor" h={150} />
      <View style={{ marginVertical: 14 }}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search here" />
      </View>
      <View style={{ gap: 10 }}>
        {list.map((d) => {
          const locked = d.locked && !premium;
          const open = () => router.push({ pathname: '/resources/deck', params: { id: d.id } });
          return (
            <Pressable key={d.id} testID={`deck-${d.id}`} onPress={() => (locked ? guard(open) : open())} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight }}>
              <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="folder" size={16} color={colors.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.l2, { color: colors.grey900 }]}>
                  {d.company} - {d.round}
                </Text>
                <Text style={[type.b3, { color: colors.grey600 }]}>{d.tagline}</Text>
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
