// Step 4 — Opportunity Details (Figma: "Opportunity Step 1 of …" screens).
// Questions change with the purpose chosen in step 2 (and LP fund interest in step 3).
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { StepLayout } from '@/components/StepScreen';
import { ChipGroup, InlineSelect, OptionSheet, SelectField } from '@/components/ui';
import { allCountries, countriesByRegion, geographies, industries, opportunityFields, type Field } from '@/data/questionnaire';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function Details() {
  const { purpose, stage, details } = useApp((s) => s.answers);
  const setDetail = useApp((s) => s.setDetail);
  const authMethod = useApp((s) => s.authMethod);
  const [open, setOpen] = useState<string | null>(null);

  const key = purpose === 'secondary' && stage === 'lp' ? 'lp' : purpose ?? 'growth';
  const fields = opportunityFields[key];

  const filled = (f: Field) => {
    const v = details[f.key];
    return Array.isArray(v) ? v.length > 0 : !!v;
  };
  const ready = fields.every((f) => f.optional || filled(f));

  const region = details.geo as string | undefined;
  // Countries in the chosen region come first, then every other country (Figma shows the full list).
  const inRegion = region ? countriesByRegion[region] ?? [] : [];
  const countryList = [...inRegion, ...allCountries.filter((c) => !inRegion.includes(c))];

  return (
    <StepLayout
      progress={0.66}
      title="Opportunity Details"
      note="An estimate helps us improve matching. You can update this anytime."
      canContinue={ready}
      onContinue={() => router.push(authMethod === 'linkedin' ? '/onboarding/profile' : '/onboarding/personal')}
    >
      <Text style={[type.b2, { color: colors.grey600, marginTop: -8 }]}>This helps us personalize your experience</Text>
      <View style={{ gap: 22 }}>
        {fields.map((f) => {
          if (f.kind === 'chips')
            return (
              <View key={f.key} style={{ gap: 10 }} testID={`field-${f.key}`}>
                <Text style={[type.b1, { color: colors.grey900 }]}>{f.label}</Text>
                <ChipGroup options={f.options} value={details[f.key] as string} onChange={(v) => setDetail(f.key, v)} />
              </View>
            );
          if (f.kind === 'select') {
            // Inline dropdown, as in Figma (opens under the field).
            const cur = f.options.find((o) => o.id === details[f.key]);
            return (
              <View key={f.key}>
                <InlineSelect testID={`field-${f.key}`} label={f.label} options={f.options} value={details[f.key] as string} open={open === f.key} onToggle={() => setOpen(open === f.key ? null : f.key)} onChange={(v) => (setDetail(f.key, v), setOpen(null))} display={cur?.title} />
              </View>
            );
          }
          if (f.kind === 'industries') {
            const v = details[f.key];
            const arr = Array.isArray(v) ? v : v ? [v] : [];
            const shown = arr.length === 0 ? undefined : arr.length === 1 ? arr[0] : `${arr[0]} +${arr.length - 1}`;
            return (
              <View key={f.key}>
                <SelectField testID={`field-${f.key}`} label={f.label} placeholder="Select an option" value={shown} onPress={() => setOpen(f.key)} />
                <OptionSheet
                  visible={open === f.key}
                  onClose={() => setOpen(null)}
                  searchable
                  multi={f.multi}
                  options={industries.map((i) => ({ id: i, title: i }))}
                  value={arr}
                  onChange={(nv) => setDetail(f.key, Array.isArray(nv) ? nv : [nv])}
                />
              </View>
            );
          }
          // geography + optional country
          return (
            <View key={f.key} style={{ gap: 10 }}>
              <SelectField testID={`field-${f.key}`} label={f.label} placeholder="Select geography" value={region} onPress={() => setOpen('geo')} />
              <SelectField testID="field-country" placeholder="Select country (optional)" value={details.country as string} onPress={() => setOpen('country')} />
              <OptionSheet
                visible={open === 'geo'}
                onClose={() => setOpen(null)}
                options={geographies}
                value={region}
                onChange={(v) => {
                  setDetail('geo', v);
                  if (details.country && !(countriesByRegion[v] ?? []).includes(details.country as string)) setDetail('country', '');
                }}
              />
              <OptionSheet visible={open === 'country'} maxHeight="94%" onClose={() => setOpen(null)} searchable options={countryList.map((c) => ({ id: c, title: c }))} value={details.country as string} onChange={(v) => setDetail('country', v)} />
            </View>
          );
        })}
      </View>
    </StepLayout>
  );
}
