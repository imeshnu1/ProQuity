// Step 2 — Purpose (Figma: Purpose)
import { router } from 'expo-router';
import { useState } from 'react';
import { ChoiceList, StepLayout } from '@/components/StepScreen';
import { purposes } from '@/data/questionnaire';
import { useApp } from '@/store/app-store';

export default function Purpose() {
  const intent = useApp((s) => s.answers.intent) ?? 'raise';
  const saved = useApp((s) => s.answers.purpose);
  const setAnswer = useApp((s) => s.setAnswer);
  const [v, setV] = useState<string | null>(saved);
  const q = purposes[intent];
  return (
    <StepLayout
      progress={0.3}
      title={q.question}
      note="This helps us tailor the next steps."
      canContinue={!!v}
      onContinue={() => {
        if (v !== saved) setAnswer({ purpose: v as any, stage: null, details: {} });
        router.push('/onboarding/stage');
      }}
    >
      <ChoiceList prefix="purpose" choices={q.choices} value={v} onChange={setV} />
    </StepLayout>
  );
}
