// Conversation with a capital provider (Figma: chat).
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Composer, FileBubble, MessageBubble } from '@/components/chat';
import { Avatar, BackButton, Tag } from '@/components/ui';
import { advisors, providers } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conv = useApp((s) => s.conversations.find((c) => c.id === id));
  const send = useApp((s) => s.sendMessage);
  const markRead = useApp((s) => s.markRead);
  const ref = useRef<ScrollViewInstance>(null);
  const unread = !!conv?.unread;
  useEffect(() => {
    if (unread && id) markRead(id);
  }, [unread, id, markRead]);
  useEffect(() => {
    setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 60);
  }, [conv?.messages.length]);
  if (!conv) return null;
  const p = [...providers, ...advisors].find((x) => x.id === conv.personId)!;
  const waiting = !conv.messages.some((m) => m.from === 'them');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.borderLight }}>
        <BackButton />
        <Avatar name={p.name} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={[type.h3, { color: colors.grey900 }]} onPress={() => router.push({ pathname: '/investor/[id]', params: { id: p.id, list: p.kind } })}>
            {p.name}
          </Text>
          <Text style={[type.b4, { color: colors.grey600 }]}>{p.firm}</Text>
        </View>
        <Tag label={conv.status} tone="blue" />
      </View>
      <ScrollView ref={ref} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {conv.messages.map((m) => (
          <View key={m.id} style={{ gap: 12 }}>
            {m.day ? <Text style={[type.b3, { color: colors.grey600, textAlign: 'center' }]}>{m.day}</Text> : null}
            {m.file ? <FileBubble name={m.file.name} size={m.file.size} mine={m.from === 'me'} /> : <MessageBubble text={m.text ?? ''} mine={m.from === 'me'} time={m.time} />}
          </View>
        ))}
        {waiting ? (
          <View style={{ alignSelf: 'center', flexDirection: 'row', gap: 6, alignItems: 'center', borderWidth: 1, borderColor: colors.borderMedium, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 8 }}>
            <Feather name="clock" size={12} color={colors.grey600} />
            <Text style={[type.b4, { color: colors.grey600 }]}>Waiting for providers to respond</Text>
          </View>
        ) : null}
      </ScrollView>
      <View style={{ padding: 16, paddingBottom: 20 }}>
        <Composer testID="chat-input" placeholder="Type Here" onSend={(t) => send(conv.id, t)} />
      </View>
    </SafeAreaView>
  );
}
