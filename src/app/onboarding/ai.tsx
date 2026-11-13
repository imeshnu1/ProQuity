// Proquity AI hand-off at the end of onboarding (Figma: "Redirecting to Proquity AI", ProquityAI-v3).
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, type ScrollViewInstance } from 'react-native';
import { MatchCard } from '@/components/cards';
import { AiBubble, Composer, Typing, UserBubble } from '@/components/chat';
import { NotifyPrompt } from '@/components/NotifyPrompt';
import { ScoreChecklist } from '@/components/Score';
import { BackButton, Button, Sheet, Tag } from '@/components/ui';
import { geographies, purposes } from '@/data/questionnaire';
import { providers } from '@/data/sample';
import { completion, useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'intro' | 'matches' | 'ask' | 'enabled' | 'declined' | 'setup';

export default function OnboardingAI() {
  const state = useApp();
  const { score, items } = completion(state);
  const [showScore, setShowScore] = useState(score < 100);
  const [step, setStep] = useState<Step>('intro');
  // Notifications may already be on from the step before Role Selection.
  const [alreadyOn] = useState(() => useApp.getState().notificationsOn === true);
  const [typing, setTyping] = useState(true);
  const [notify, setNotify] = useState(false);
  const [userMsgs, setUserMsgs] = useState<string[]>([]);
  const scroll = useRef<ScrollViewInstance>(null);
  const d = state.answers.details;

  const tags = [
    state.answers.intent === 'liquidity' ? 'Seek liquidity' : 'Raise capital',
    [...purposes.raise.choices, ...purposes.liquidity.choices].find((c) => c.id === state.answers.purpose)?.title ?? '',
    (d.raiseSize || d.targetSize || d.stakeValue || d.projectValue) as string,
    d.capitalType as string,
    ...(Array.isArray(d.industries) ? d.industries : d.industries ? [d.industries as string] : []),
    d.geo as string,
    d.country as string,
  ].filter(Boolean);

  const finish = (on: boolean) => {
    state.setNotifications(on);
    setStep(on ? 'enabled' : 'declined');
    setTimeout(() => setStep('setup'), 1200);
    setTimeout(() => {
      state.finishOnboarding();
      router.replace({ pathname: '/paywall', params: { from: 'onboarding' } });
    }, 2800);
  };

  useEffect(() => {
    if (showScore) return;
    const t1 = setTimeout(() => (setTyping(false), setStep('matches')), 1600);
    const t2 = setTimeout(() => (alreadyOn ? finish(true) : setStep('ask')), 2600);
    return () => (clearTimeout(t1), clearTimeout(t2));
  }, [showScore]);

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 80);
  }, [step, userMsgs]);

  const showAsk = !alreadyOn && ['ask', 'enabled', 'declined', 'setup'].includes(step);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 8 }}>
        <BackButton />
        <Text style={[type.h2, { color: colors.grey900, flex: 1 }]}>Proquity AI</Text>
        <Pressable onPress={() => finish(false)}>
          <Text style={[type.l3, { color: colors.grey600 }]}>Skip for now</Text>
        </Pressable>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 20, gap: 12 }}>
        <AiBubble>Hi, I am your AI assistant</AiBubble>
        <AiBubble avatar={false}>Sit back and relax! While I find the investor profiles that aligns with your opportunity details.</AiBubble>
        <AiBubble avatar={false}>
          <Text style={[type.l3, { color: colors.grey900, marginBottom: 8 }]}>Your Opportunity details</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {tags.map((t) => (
              <Tag key={t} label={geographies.find((g) => g.id === t)?.title ?? t} tone="outline" />
            ))}
          </View>
        </AiBubble>
        {typing ? <Typing label="Finding your matches" /> : null}
        {step !== 'intro' ? (
          <>
            <View style={{ paddingLeft: 32 }}>
              <MatchCard p={providers[0]} width={300} />
            </View>
            <AiBubble>I’ve identified 84 investors strongly aligned with your opportunity.</AiBubble>
          </>
        ) : null}
        {showAsk ? (
          <AiBubble avatar={false}>
            <Text style={[type.b2, { color: colors.grey900 }]}>In order to send you the daily matches, we need you to enable the notifications.</Text>
            {step === 'ask' ? (
              <View style={{ gap: 6, marginTop: 12 }}>
                <Button testID="ai-enable" small title="Enable notifications" onPress={() => setNotify(true)} />
                <Button testID="ai-notnow" small variant="ghost" title="Not Now" onPress={() => (setUserMsgs((m) => [...m, 'Not now']), finish(false))} />
              </View>
            ) : null}
          </AiBubble>
        ) : null}
        {userMsgs.map((m, i) => (
          <UserBubble key={i} text={m} />
        ))}
        {step === 'enabled' || (step === 'setup' && state.notificationsOn) ? <AiBubble>Thanks for enabling notifications!</AiBubble> : null}
        {step === 'declined' || (step === 'setup' && !state.notificationsOn) ? (
          <AiBubble>
            {'Thanks for making your choice!\nYou will be missing the potential matches that are relevant for your opportunity by choosing to disable notifications.\nTo enable: Goto settings > Notifications > Proquity > Allow notifications'}
          </AiBubble>
        ) : null}
        {step === 'setup' ? <Typing label="Setting up your Dashboard" /> : null}
      </ScrollView>
      <View style={{ padding: 16, paddingBottom: 24 }}>
        <Composer disabled placeholder="Type here" onSend={() => {}} />
      </View>

      <NotifyPrompt
        visible={notify}
        onResult={(on) => {
          setNotify(false);
          if (on === null) return;
          setUserMsgs((m) => [...m, on ? 'Enable notifications' : 'Not now']);
          finish(on);
        }}
      />

      <Sheet visible={showScore} onClose={() => setShowScore(false)}>
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <ScoreChecklist score={score} items={items} />
          <Button title="Complete Profile" onPress={() => (setShowScore(false), router.back())} />
          <Button testID="score-later" title="I’ll do it later" variant="ghost" onPress={() => setShowScore(false)} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}
