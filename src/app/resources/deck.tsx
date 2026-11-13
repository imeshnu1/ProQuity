// Pitch Deck Preview (Figma: Sample Pitch Deck preview).
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { PageHeader, Thumb } from '@/components/Page';
import { Button, Screen, Tag, toast } from '@/components/ui';
import { pitchDecks } from '@/data/sample';
import { colors, type, fonts } from '@/theme/tokens';

export default function Deck() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = pitchDecks.find((x) => x.id === id) ?? pitchDecks[0];
  return (
    <Screen
      footer={
        <View style={{ gap: 10 }}>
          <Button title="View Full Deck" onPress={() => toast('Opening deck…')} />
          <Button title="Download PDF" variant="outline" onPress={() => toast('Downloaded')} />
        </View>
      }
    >
      <PageHeader title="Pitch Deck Preview" share={`${d.company} ${d.round} pitch deck`} />
      <Thumb icon="monitor" h={190} />
      <View style={{ gap: 8, marginTop: 14 }}>
        <Tag label="Sample Pitch Deck" tone="blue" />
        <Text style={[type.h3, { color: colors.grey900 }]}>
          {d.company} - {d.round}
        </Text>
        <Text style={[type.b1, { color: colors.grey700 }]}>{d.tagline}</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>
          {d.company} raised its {d.round} with a deck focused on a clear vision, rapid expansion and a loyal customer base. Study how it frames the problem, traction and the ask.
        </Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>
          <Text style={{ fontFamily: fonts.bold }}>Vision:</Text> {d.vision}
        </Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>
          <Text style={{ fontFamily: fonts.bold }}>Users:</Text> {d.users}
        </Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>
          <Text style={{ fontFamily: fonts.bold }}>Funding:</Text> {d.funding}
        </Text>
      </View>
    </Screen>
  );
}
