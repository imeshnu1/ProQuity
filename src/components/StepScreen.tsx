// Layout shared by the onboarding question screens: back, progress bar, title, Continue + note.
import { Text, View } from 'react-native';
import { BackButton, Button, H1, OptionCard, ProgressBar, Screen } from '@/components/ui';
import type { Choice } from '@/data/questionnaire';
import { colors, type } from '@/theme/tokens';

export function StepLayout({
  progress,
  title,
  optional,
  note,
  canContinue,
  onContinue,
  children,
  back = true,
  ctaLabel = 'Continue',
}: {
  progress: number;
  title: string;
  optional?: boolean;
  note?: string;
  canContinue: boolean;
  onContinue: () => void;
  children: React.ReactNode;
  back?: boolean;
  ctaLabel?: string;
}) {
  return (
    <Screen
      footer={
        <View style={{ gap: 8 }}>
          <Button testID="step-continue" title={ctaLabel} disabled={!canContinue} onPress={onContinue} />
          {note ? <Text style={[type.b3, { color: colors.grey600, textAlign: 'center', fontStyle: 'italic' }]}>{note}</Text> : null}
        </View>
      }
    >
      <View style={{ gap: 16, paddingTop: 12 }}>
        {back ? <BackButton /> : <View style={{ height: 8 }} />}
        <ProgressBar value={progress} />
        <H1 style={{ fontSize: 22, lineHeight: 28 }}>
          {title}
          {optional ? <Text style={[type.b3, { color: colors.grey500 }]}> (optional)</Text> : null}
        </H1>
        {children}
      </View>
    </Screen>
  );
}

export function ChoiceList({ choices, value, onChange, prefix }: { choices: Choice[]; value: string | null; onChange: (id: string) => void; prefix: string }) {
  return (
    <View style={{ gap: 10 }}>
      {choices.map((c) => (
        <OptionCard key={c.id} testID={`${prefix}-${c.id}`} title={c.title} subtitle={c.subtitle} tags={c.tags} selected={value === c.id} onPress={() => onChange(c.id)} />
      ))}
    </View>
  );
}
