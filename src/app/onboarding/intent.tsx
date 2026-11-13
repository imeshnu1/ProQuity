// Step 1 — What are you looking to do? (Figma: Intent)
import { router } from 'expo-router';
import { useState } from 'react';
import { ChoiceList, StepLayout } from '@/components/StepScreen';
import { intents } from '@/data/questionnaire';
import { useApp } from '@/store/app-store';

export default function Intent() {
  const saved = useApp((s) => s.answers.intent);
  const setAnswer = useApp((s) => s.setAnswer);
  const [v, setV] = useState<string | null>(saved);
  return (
    <StepLayout
      progress={0.12}
      title="What are you looking to do?"
      note="This helps us tailor the next steps."
      canContinue={!!v}
      back={router.canGoBack()}
      onContinue={() => {
        if (v !== saved) setAnswer({ intent: v as any, purpose: null, stage: null, details: {} });
        router.push('/onboarding/purpose');
      }}
    >
      <ChoiceList prefix="intent" choices={intents} value={v} onChange={setV} />
    </StepLayout>
  );
}
