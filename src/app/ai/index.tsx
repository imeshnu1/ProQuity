// Proquity AI chat (Figma: ProquityAI, Proquity AI Chat).
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AiBubble, Composer, PromptChips, Typing, UserBubble } from '@/components/chat';
import { BackButton, IconButton } from '@/components/ui';
import { aiPrompts, providers } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';
import { aiReply } from '@/utils/ai';

type Msg = { from: 'me' | 'ai'; text: string };

export default function AI() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const s = useApp();
  const [msgs, setMsgs] = useState<Msg[]>(() => (q ? [{ from: 'me', text: q }] : []));
  const [thinking, setThinking] = useState(!!q);
  const ref = useRef<ScrollViewInstance>(null);

  const ask = (text: string) => {
    setMsgs((m) => [...m, { from: 'me', text }]);
    setThinking(true);
    s.addAiHistory(text.length > 40 ? text.slice(0, 40) + '…' : text);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: 'ai', text: aiReply(text, s, providers) }]);
      setThinking(false);
    }, 900);
  };

  // Answer the question passed in from the dashboard, once.
  useEffect(() => {
    if (!q) return;
    const st = useApp.getState();
    st.addAiHistory(q);
    const t = setTimeout(() => {
      setMsgs((m) => [...m, { from: 'ai', text: aiReply(q, st, providers) }]);
      setThinking(false);
    }, 900);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 60);
  }, [msgs.length, thinking]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
        <BackButton />
        <Text style={[type.h2, { color: colors.grey900, flex: 1 }]}>Proquity AI</Text>
        <IconButton testID="ai-history" icon="clock" label="Chat history" onPress={() => router.push('/ai/history')} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={ref} contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}>
          {msgs.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 60 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="zap" size={26} color={colors.brand} />
              </View>
              <Text style={[type.h3, { color: colors.grey900 }]}>How can I help with your raise?</Text>
              <Text style={[type.b2, { color: colors.grey600, textAlign: 'center' }]}>Draft outreach, analyse investor fit or get advice tailored to your opportunity.</Text>
            </View>
          ) : null}
          {msgs.map((m, i) => (m.from === 'me' ? <UserBubble key={i} text={m.text} /> : <AiBubble key={i}>{m.text}</AiBubble>))}
          {thinking ? <Typing /> : null}
        </ScrollView>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
          <PromptChips prompts={aiPrompts} onPick={ask} />
          <Composer testID="ai-input" placeholder="What would you like to ask?" onSend={ask} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
