// Book Pitch call (Figma: Agenda, Select Capital Provider, date picker, Booked).
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { PersonRow } from '@/components/cards';
import { Avatar, BackButton, Button, Chip, Input, OptionSheet, Screen, SearchBar, Sheet } from '@/components/ui';
import { advisors, providers } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

const people = [...providers, ...advisors];
const locations = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Phone call'];
const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookCall() {
  const { personId } = useLocalSearchParams<{ personId?: string }>();
  const book = useApp((s) => s.bookCall);
  const [pid, setPid] = useState<string | undefined>(personId);
  const [agenda, setAgenda] = useState('');
  const [desc, setDesc] = useState('');
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [loc, setLoc] = useState('Zoom');
  const [sheet, setSheet] = useState<null | 'person' | 'date' | 'loc'>(null);
  const [q, setQ] = useState('');
  const [done, setDone] = useState(false);
  const p = people.find((x) => x.id === pid);

  const [days] = useState(() => Array.from({ length: 14 }).map((_, i) => new Date(Date.now() + (i + 1) * 86400000)));
  const when = day && time ? new Date(day.getFullYear(), day.getMonth(), day.getDate(), +time.split(':')[0], +time.split(':')[1]) : null;

  if (done && p && when)
    return (
      <Screen footer={<Button testID="review-bookings" title="Review bookings" onPress={() => router.replace('/pitch-calls')} />} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="check" size={46} color={colors.brand} />
          </View>
          <Text style={[type.h3, { color: colors.grey900 }]}>Pitch Call Booked</Text>
          <Text style={[type.b2, { color: colors.grey600, textAlign: 'center', maxWidth: 300 }]}>
            Your Call with {p.name} has been scheduled for {when.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at {time} successfully.
          </Text>
        </View>
      </Screen>
    );

  return (
    <Screen
      footer={
        <Button
          testID="book-now"
          title="Book now"
          disabled={!p || !agenda.trim() || !when}
          onPress={() => {
            book({ personId: p!.id, agenda: agenda.trim(), description: desc.trim(), date: when!.toISOString(), location: loc });
            setDone(true);
          }}
        />
      }
    >
      <View style={{ gap: 16, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BackButton />
          <Text style={[type.h2, { color: colors.grey900 }]}>Book Pitch call</Text>
        </View>
        <Pressable testID="pick-provider" onPress={() => setSheet('person')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight }}>
          {p ? <Avatar name={p.name} size={40} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={[type.l1, { color: p ? colors.grey900 : colors.grey600 }]}>{p ? p.name : 'Select Providers'}</Text>
            {p ? <Text style={[type.b3, { color: colors.grey600 }]}>{p.firm}</Text> : null}
          </View>
          <Feather name="edit-2" size={16} color={colors.brand} />
        </Pressable>
        <Input testID="agenda" label="Agenda of the Call" placeholder="Eg. Fundraising discussion,product…" value={agenda} onChangeText={setAgenda} />
        <Input label="Description" placeholder="Briefly describe what you’d like to discuss during the call…" value={desc} onChangeText={setDesc} multiline counter={280} />
        <View style={{ gap: 6 }}>
          <Text style={[type.b2, { color: colors.grey700 }]}>Date & Time</Text>
          <Pressable testID="pick-date" onPress={() => setSheet('date')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, height: 50, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.borderMedium, backgroundColor: colors.bgDefault }}>
            <Feather name="calendar" size={16} color={colors.brand} />
            <Text style={[type.b2, { flex: 1, color: when ? colors.grey900 : colors.grey600 }]}>{when ? `${when.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}  ${time}` : 'Select Date & Time'}</Text>
            <Feather name="chevron-right" size={16} color={colors.grey700} />
          </Pressable>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={[type.b2, { color: colors.grey700 }]}>Call Location</Text>
          <Pressable onPress={() => setSheet('loc')} style={{ height: 50, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white }}>
            <Text style={[type.b2, { color: colors.grey900 }]}>{loc}</Text>
          </Pressable>
        </View>
      </View>

      <Sheet visible={sheet === 'person'} onClose={() => setSheet(null)} title="Select Capital Provider" maxHeight="90%">
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <SearchBar value={q} onChangeText={setQ} />
        </View>
        {people
          .filter((x) => x.name.toLowerCase().includes(q.toLowerCase()))
          .map((x) => (
            <PersonRow key={x.id} p={x} selected={x.id === pid} onPress={() => (setPid(x.id), setSheet(null))} right={x.id === pid ? <Feather name="check" size={16} color={colors.brand} /> : null} />
          ))}
      </Sheet>

      <Sheet visible={sheet === 'date'} onClose={() => setSheet(null)} title="Select Date & Time" footer={<Button testID="date-done" title="Done" disabled={!day || !time} onPress={() => setSheet(null)} />}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {days.map((d) => {
            const on = day?.toDateString() === d.toDateString();
            return (
              <Pressable key={d.toISOString()} testID={`day-${d.getDate()}`} onPress={() => setDay(d)} style={{ width: 58, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: on ? colors.brand : colors.borderMedium, backgroundColor: on ? colors.brand : colors.white }}>
                <Text style={[type.b4, { color: on ? colors.white : colors.grey600 }]}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                <Text style={[type.h3, { color: on ? colors.white : colors.grey900 }]}>{d.getDate()}</Text>
                <Text style={[type.b4, { color: on ? colors.white : colors.grey600 }]}>{d.toLocaleDateString('en-US', { month: 'short' })}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 20 }}>
          {times.map((t) => (
            <Chip key={t} testID={`time-${t}`} label={t} selected={time === t} onPress={() => setTime(t)} />
          ))}
        </View>
      </Sheet>
      <OptionSheet visible={sheet === 'loc'} onClose={() => setSheet(null)} title="Call Location" options={locations.map((l) => ({ id: l, title: l }))} value={loc} onChange={setLoc} />
    </Screen>
  );
}
