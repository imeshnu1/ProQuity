// Cards for people (capital providers & advisors), as designed in Figma.
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui';
import type { Person } from '@/data/sample';
import { colors, radius, type } from '@/theme/tokens';

function MatchBar({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10 }}>
      <Text style={[type.b2, { color: colors.grey700 }]}>{label}</Text>
      <View style={{ width: 18, height: 6, borderRadius: 3, backgroundColor: label === 'Strong Match' ? colors.success : colors.warning }} />
    </View>
  );
}

function Hidden({ w, h = 12 }: { w: number; h?: number }) {
  return <View style={{ width: w, height: h, borderRadius: 4, backgroundColor: colors.strongHairline }} />;
}

/** Highlighted "Daily match" card (blue) used on the dashboard and onboarding. */
export function MatchCard({ p, onPress, width = 300, extra }: { p: Person; onPress?: () => void; width?: number; extra?: string }) {
  return (
    <Pressable testID={`match-${p.id}`} onPress={onPress} style={({ pressed }) => [st.match, { width }, pressed && { opacity: 0.9 }]}>
      <View style={{ flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 10 }}>
        <Avatar name={p.name} size={52} />
        <View style={{ flex: 1 }}>
          <Text style={[type.h3, { color: colors.grey700 }]} numberOfLines={1}>
            {p.name}
          </Text>
          <Text style={[type.b2, { color: colors.grey700 }]}>{p.title}</Text>
          <Text style={[type.b2, { color: colors.grey700 }]} numberOfLines={1}>
            {p.firmShort}
          </Text>
        </View>
      </View>
      <View style={st.metaRow}>
        <Feather name="credit-card" size={14} color={colors.grey700} />
        <Text style={[type.b2, { color: colors.grey700 }]}>{p.checkSize}</Text>
        <Text style={st.sep}>•</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>{p.stage}</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>{extra ?? `+${p.sectors.length + 2}`}</Text>
      </View>
      <View style={{ borderTopWidth: 1, borderColor: colors.roseBorder }}>
        <MatchBar label={p.match} />
      </View>
    </Pressable>
  );
}

/** White list card on the Capital Providers / Advisors tabs. Locked = free plan (identity hidden). */
export function PersonCard({ p, locked, onPress }: { p: Person; locked: boolean; onPress: () => void }) {
  return (
    <Pressable testID={`person-${p.id}`} onPress={onPress} style={({ pressed }) => [st.person, pressed && { opacity: 0.92 }]}>
      <View style={{ flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 6 }}>
        <Avatar name={locked ? '' : p.name} size={52} />
        <View style={{ flex: 1, gap: 4, justifyContent: 'center' }}>
          {locked ? (
            <>
              <Hidden w={120} h={14} />
              <Hidden w={40} />
              <Hidden w={150} />
            </>
          ) : (
            <>
              <Text style={[type.h4, { color: colors.grey900 }]}>{p.name}</Text>
              <Text style={[type.b3, { color: colors.grey700 }]}>{p.title}</Text>
              <Text style={[type.b3, { color: colors.grey600 }]}>{p.firm}</Text>
            </>
          )}
        </View>
        {locked ? <Feather name="lock" size={16} color={colors.brand} /> : null}
      </View>
      <View style={st.metaRow}>
        <View style={st.moneyTag}>
          <Feather name="credit-card" size={13} color={colors.grey700} />
          <Text style={[type.b2, { color: colors.grey700 }]}>{p.checkSize.replace(' – ', '-')}</Text>
        </View>
        <Text style={st.sep}>•</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>{p.stages[0]}</Text>
        <Text style={st.sep}>•</Text>
        <Text style={[type.b2, { color: colors.grey700 }]} numberOfLines={1}>
          {p.sectors[0]}
        </Text>
      </View>
      <View style={{ borderTopWidth: 1, borderColor: colors.borderLight }}>{locked ? <View style={{ alignItems: 'center', paddingVertical: 12 }}><Hidden w={70} h={8} /></View> : <MatchBar label={p.match} />}</View>
    </Pressable>
  );
}

/** Compact row: avatar + name + firm (selection lists, chat list). */
export function PersonRow({ p, right, onPress, selected, sub }: { p: Person; right?: React.ReactNode; onPress?: () => void; selected?: boolean; sub?: string }) {
  return (
    <Pressable onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: colors.borderLight }, selected && { backgroundColor: colors.selected }]}>
      <Avatar name={p.name} size={44} />
      <View style={{ flex: 1 }}>
        <Text style={[type.l1, { color: colors.grey900 }]}>{p.name}</Text>
        <Text style={[type.b2, { color: colors.grey600 }]}>{sub ?? p.firm}</Text>
      </View>
      {right}
    </Pressable>
  );
}

const st = StyleSheet.create({
  match: { backgroundColor: colors.selected, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.roseBorder },
  person: { backgroundColor: colors.bgDefault, borderRadius: radius.card, borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 10 },
  sep: { color: colors.grey400, fontSize: 12 },
  moneyTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.grey100, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
});
