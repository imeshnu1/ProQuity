// Legal template preview (Figma: Preview Legal doc).
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { PageHeader } from '@/components/Page';
import { Button, Screen, Tag, toast } from '@/components/ui';
import { legalDocs } from '@/data/sample';
import { colors, type } from '@/theme/tokens';

const Bullets = ({ items }: { items: string[] }) => (
  <View style={{ gap: 4 }}>
    {items.map((i) => (
      <Text key={i} style={[type.b2, { color: colors.grey700 }]}>
        • {i}
      </Text>
    ))}
  </View>
);

export default function LegalDoc() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = legalDocs.find((x) => x.id === id) ?? legalDocs[0];
  return (
    <Screen footer={<Button testID="download-template" title="Download Template" variant="outline" onPress={() => toast(`${d.title} downloaded`)} />}>
      <PageHeader title={d.title} share={`${d.title} — Proquity legal templates`} />
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Tag label={d.tag} tone="green" />
        <Tag label="Legal" tone="green" />
        <Tag label="Early-Stage" tone="green" />
      </View>
      <View style={{ gap: 14, marginTop: 16 }}>
        <Text style={[type.h4, { color: colors.grey900 }]}>About this Document</Text>
        <Text style={[type.b2, { color: colors.grey700 }]}>{d.summary} It ensures that confidential information shared during negotiations remains protected.</Text>
        <Text style={[type.h4, { color: colors.grey900 }]}>When to use this</Text>
        <Bullets items={['Investor Pitch Meetings', 'Confidential Business Discussions', 'Early Partnerships']} />
        <Text style={[type.h4, { color: colors.grey900 }]}>Key Sections Included</Text>
        <Bullets items={['Definitions & Confidential Information', 'Obligations of Parties', 'Terms & Termination', 'Governing Law']} />
        <Text style={[type.b4, { color: colors.grey500 }]}>{d.meta}. Templates are a starting point — have a lawyer review before signing.</Text>
      </View>
    </Screen>
  );
}
