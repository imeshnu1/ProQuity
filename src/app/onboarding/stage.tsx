// Step 3 — Stage / Strategy / Type (Figma: Stage/ Strategy/ Type)
import { router } from 'expo-router';
import { useState } from 'react';
import { ChoiceList, StepLayout } from '@/components/StepScreen';
import { stageQuestions } from '@/data/questionnaire';
import { useApp } from '@/store/app-store';

export default function Stage() {
  const purpose = useApp((s) => s.answers.purpose) ?? 'growth';
  const saved = useApp((s) => s.answers.stage);
  const setAnswer = useApp((s) => s.setAnswer);
  const [v, setV] = useState<string | null>(saved);
  const q = stageQuestions[purpose];
  return (
    <StepLayout
      progress={0.5}
      title={q.question}
      optional={q.optional}
      note={q.note}
      canContinue={!!v || !!q.optional}
      ctaLabel={!v && q.optional ? 'Skip' : 'Continue'}
      onContinue={() => {
        if (v !== saved) setAnswer({ stage: v, details: {} });
        router.push('/onboarding/details');
      }}
    >
      <ChoiceList prefix="stage" choices={q.choices} value={v} onChange={(id) => setV(v === id && q.optional ? null : id)} />
    </StepLayout>
  );
}
