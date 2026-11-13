// A single calculator (Figma: Burn rate Calculator — empty, filled, result).
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View, Platform } from 'react-native';
import { BackButton, Button, Screen } from '@/components/ui';
import { calculators } from '@/data/calculators';
import { colors, type } from '@/theme/tokens';

export default function Calculator() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = calculators.find((x) => x.id === id) ?? calculators[0];
  const [vals, setVals] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof c.compute> | null>(null);
  const ready = c.fields.every((f) => vals[f.key] && !isNaN(Number(vals[f.key])));

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={[type.h2, { color: colors.grey900 }]}>{c.title.includes('Calculator') ? c.title : `${c.title} Calculator`}</Text>
          <Text style={[type.b2, { color: colors.grey700 }]}>{c.blurb}</Text>
        </View>
      </View>
      {result ? (
        <View testID="calc-result" style={{ backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.borderLight, padding: 16, gap: 10, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Feather name="activity" size={14} color={colors.blue} />
            <Text style={[type.l3, { color: colors.blue }]}>Your {c.title}</Text>
          </View>
          <Text style={[type.h1, { color: colors.grey900 }]}>
            {result.value} <Text style={[type.b3, { color: colors.grey600 }]}>{result.unit}</Text>
          </Text>
          <Text style={[type.b2, { color: colors.grey700 }]}>{result.note}</Text>
          <View style={{ flexDirection: 'row', gap: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight }}>
            <Feather name="zap" size={12} color={colors.grey600} style={{ marginTop: 2 }} />
            <Text style={[type.b3, { color: colors.grey600, flex: 1 }]}>{result.tip}</Text>
          </View>
          <Button title="Recalculate" variant="outline" small onPress={() => setResult(null)} />
        </View>
      ) : (
        <View style={{ gap: 18, marginTop: 8 }}>
          {c.fields.map((f) => (
            <View key={f.key} style={{ gap: 4 }}>
              <Text style={[type.l1, { color: colors.grey900 }]}>{f.label}</Text>
              <Text style={[type.b3, { color: colors.grey600 }]}>{f.help}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 52, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white, marginTop: 6 }}>
                {f.prefix ? <Text style={[type.b1, { color: colors.grey900 }]}>{f.prefix}</Text> : null}
                <TextInput
                  testID={`calc-field-${f.key}`}
                  value={vals[f.key] ?? ''}
                  onChangeText={(t) => setVals({ ...vals, [f.key]: t.replace(/[^0-9.]/g, '') })}
                  keyboardType="decimal-pad"
                  style={[type.b1, { flex: 1, color: colors.grey900 }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                />
                {f.suffix ? <Text style={[type.b2, { color: colors.grey600 }]}>{f.suffix}</Text> : null}
              </View>
            </View>
          ))}
          <Button testID="calc-go" title={`Calculate ${c.title}`} disabled={!ready} onPress={() => setResult(c.compute(Object.fromEntries(c.fields.map((f) => [f.key, Number(vals[f.key])]))))} />
          {Object.keys(vals).length ? <Text onPress={() => setVals({})} style={[type.l2, { color: colors.brand, textAlign: 'center' }]}>Reset Values</Text> : null}
        </View>
      )}
    </Screen>
  );
}
