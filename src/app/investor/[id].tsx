// Capital provider / advisor profile (Figma: InvestorProfile).
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Text, View } from 'react-native';
import { useProfileGate } from '@/components/gates';
import { Avatar, Button, Card, IconButton, Screen, Tag } from '@/components/ui';
import { advisors, providers } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function Investor() {
  const { id, list = 'provider' } = useLocalSearchParams<{ id: string; list: string }>();
  const all = list === 'advisor' ? advisors : providers;
  const idx = Math.max(0, all.findIndex((p) => p.id === id));
  const p = all[idx];
  const conv = useApp((s) => s.conversations.find((c) => c.personId === p.id));
  const gate = useProfileGate();
  const nav = (d: number) => router.setParams({ id: all[(idx + d + all.length) % all.length].id });

  return (
    <Screen
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            testID="investor-message"
            title="Message"
            variant="dark"
            style={{ flex: 1 }}
            onPress={() => gate.guard(() => (conv ? router.push({ pathname: '/chat/[id]', params: { id: conv.id } }) : router.push({ pathname: '/connect/[id]', params: { id: p.id } })))}
          />
          <Button testID="investor-book" title="Book a Pitch Call" style={{ flex: 1.3 }} onPress={() => gate.guard(() => router.push({ pathname: '/book-call', params: { personId: p.id } }))} />
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}>
        <IconButton icon="x" label="Close" onPress={() => router.back()} />
        <View style={{ flex: 1 }} />
        <Button small variant="outline" title="Prev" onPress={() => nav(-1)} style={{ marginRight: 8 }} />
        <Button small variant="outline" title="Next" testID="investor-next" onPress={() => nav(1)} />
      </View>
      <View style={{ alignItems: 'center', gap: 4, marginTop: 10 }}>
        <View style={{ borderWidth: 3, borderColor: p.match === 'Strong Match' ? colors.success : colors.warning, borderRadius: 60, padding: 2 }}>
          <Avatar name={p.name} size={96} />
        </View>
        <View style={{ marginTop: -14, backgroundColor: p.match === 'Strong Match' ? colors.success : colors.warning, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 }}>
          <Text style={[type.l4, { color: colors.white }]}>{p.match}</Text>
        </View>
        <Text style={[type.h2, { color: colors.grey900, marginTop: 6 }]} testID="investor-name">
          {p.name}
        </Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>
          {p.title} at {p.firmShort}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Feather name="map-pin" size={12} color={colors.grey600} />
          <Text style={[type.b3, { color: colors.grey600 }]}>{p.location}</Text>
          <Feather name="linkedin" size={14} color={colors.linkedin} onPress={() => Linking.openURL('https://www.linkedin.com')} />
        </View>
      </View>
      <View style={{ gap: 12, marginTop: 20 }}>
        <Card>
          <Text style={[type.b3, { color: colors.grey600 }]}>Firm Details</Text>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <View style={{ width: 44, height: 44, borderRadius: 6, backgroundColor: colors.deepBordeaux }} />
            <View>
              <Text style={[type.b2, { color: colors.grey900 }]}>{p.firm}</Text>
              <Text style={[type.b3, { color: colors.grey600 }]} onPress={() => Linking.openURL(p.website)}>
                {p.website}
              </Text>
            </View>
          </View>
        </Card>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card style={{ flex: 1 }}>
            <Feather name="credit-card" size={14} color={colors.grey600} />
            <Text style={[type.b3, { color: colors.grey600, marginTop: 6 }]}>Check Size</Text>
            <Text style={[type.b2, { color: colors.grey900 }]}>{p.checkSize}</Text>
          </Card>
          <Card style={{ flex: 1 }}>
            <Feather name="layers" size={14} color={colors.grey600} />
            <Text style={[type.b3, { color: colors.grey600, marginTop: 6 }]}>Stage Focus</Text>
            <Text style={[type.b2, { color: colors.grey900 }]}>{p.stages.join(', ')}</Text>
          </Card>
        </View>
        <Card>
          <Text style={[type.b3, { color: colors.grey600, marginBottom: 8 }]}>Industries</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {p.sectors.map((s) => (
              <Tag key={s} label={s} tone="outline" />
            ))}
          </View>
        </Card>
        <Card>
          <Text style={[type.b3, { color: colors.grey600, marginBottom: 8 }]}>Geographic Focus</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {p.geos.map((s) => (
              <Tag key={s} label={s} tone="outline" />
            ))}
          </View>
        </Card>
        <Card>
          <Text style={[type.b3, { color: colors.grey600, marginBottom: 6 }]}>About</Text>
          <Text style={[type.b2, { color: colors.grey900 }]}>{p.about}</Text>
        </Card>
      </View>
      {gate.element}
    </Screen>
  );
}
