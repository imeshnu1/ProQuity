// Call Bookings (Figma: Pitch Calls — empty, scheduled, history).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePremiumGate } from '@/components/gates';
import { Avatar, BackButton, Button, Card, EmptyState, Screen, Segmented, toast } from '@/components/ui';
import { advisors, providers } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';
import { fmtDate, fmtTime } from '@/utils/format';

const people = [...providers, ...advisors];

export default function PitchCalls() {
  const bookings = useApp((s) => s.bookings);
  const [now] = useState(() => Date.now());
  const scheduled = bookings.filter((b) => new Date(b.date).getTime() >= now - 60 * 60 * 1000);
  const history = bookings.filter((b) => new Date(b.date).getTime() < now - 60 * 60 * 1000);
  const [tab, setTab] = useState('Scheduled');
  const list = tab === 'Scheduled' ? scheduled : history;
  const { guard, element } = usePremiumGate();
  const book = () => guard(() => router.push('/book-call'));

  return (
    <Screen footer={bookings.length ? <Button testID="book-pitch" title="Book a Pitch Call" onPress={book} /> : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <View>
          <Text style={[type.h2, { color: colors.grey900 }]}>Call Bookings</Text>
          <Text style={[type.b3, { color: colors.grey600 }]}>Manage your scheduled calls and meetings.</Text>
        </View>
      </View>
      <Segmented filled tabs={['Scheduled', 'History']} value={tab} onChange={setTab} />
      <View style={{ gap: 12, marginTop: 16 }}>
        {list.length === 0 ? (
          <EmptyState icon="video" title={tab === 'Scheduled' ? 'No Pitch calls yet' : 'No past calls'} body="Investors who show interest in your startup will appear here.">
            {tab === 'Scheduled' ? <Button testID="book-pitch" title="Book a Pitch Call" onPress={book} style={{ alignSelf: 'stretch', marginTop: 10, minWidth: 300 }} /> : null}
          </EmptyState>
        ) : null}
        {list.map((b) => {
          const p = people.find((x) => x.id === b.personId)!;
          const mins = Math.round((new Date(b.date).getTime() - now) / 60000);
          return (
            <Card key={b.id} style={{ backgroundColor: colors.white, gap: 10, padding: 0, overflow: 'hidden' }}>
              <View style={{ padding: 16, gap: 10 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Avatar name={p.name} size={40} />
                  <View>
                    <Text style={[type.l1, { color: colors.grey900 }]}>{p.name}</Text>
                    <Text style={[type.b3, { color: colors.grey600 }]}>{p.firm}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Feather name="calendar" size={14} color={colors.grey600} />
                  <Text style={[type.b2, { color: colors.grey700 }]}>{fmtDate(b.date)}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Feather name="clock" size={14} color={colors.grey600} />
                  <Text style={[type.b2, { color: colors.grey700 }]}>{fmtTime(b.date)} · {b.location}</Text>
                </View>
                <Text style={[type.b3, { color: colors.grey600 }]}>{b.agenda}</Text>
                {tab === 'Scheduled' ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => toast('Invite link copied')} style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Text style={[type.l3, { color: colors.grey900 }]}>Copy invite link</Text>
                      <Feather name="copy" size={13} color={colors.grey900} />
                    </Pressable>
                    <Button small variant="outline" title="Join meeting" onPress={() => toast(`Opening ${b.location}…`)} />
                  </View>
                ) : null}
              </View>
              {tab === 'Scheduled' && mins <= 60 && mins >= -60 ? (
                <View style={{ backgroundColor: colors.goldWash, paddingVertical: 4, alignItems: 'center' }}>
                  <Text style={[type.l4, { color: colors.cognacGold }]}>{mins > 0 ? `Starts in ${mins} mins` : 'In progress'}</Text>
                </View>
              ) : tab === 'History' ? (
                <View style={{ backgroundColor: colors.oliveWash, paddingVertical: 4, alignItems: 'center' }}>
                  <Text style={[type.l4, { color: colors.success }]}>Completed</Text>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
      {element}
    </Screen>
  );
}
