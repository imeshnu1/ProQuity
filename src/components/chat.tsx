// Chat pieces for Proquity AI and messages.
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar } from '@/components/ui';
import { colors, radius, type, fonts } from '@/theme/tokens';

export function AiAvatar() {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serifSemibold, fontSize: 12, color: colors.brand }}>P</Text>
    </View>
  );
}

export function AiBubble({ children, avatar = true }: { children: React.ReactNode; avatar?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start', maxWidth: '88%' }}>
      {avatar ? <AiAvatar /> : <View style={{ width: 24 }} />}
      <View style={st.ai}>{typeof children === 'string' ? <Text style={[type.b2, { color: colors.grey900 }]}>{children}</Text> : children}</View>
    </View>
  );
}

export function UserBubble({ text, name = 'Me' }: { text: string; name?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignSelf: 'flex-end', alignItems: 'flex-end', maxWidth: '85%' }}>
      <View style={st.user}>
        <Text style={[type.b2, { color: colors.grey900 }]}>{text}</Text>
      </View>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name="user" size={14} color={colors.white} />
      </View>
    </View>
  );
}

export function Typing({ label }: { label?: string }) {
  const [a] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(a, { toValue: 1, duration: 900, useNativeDriver: Platform.OS !== 'web' }));
    loop.start();
    return () => loop.stop();
  }, [a]);
  return (
    <AiBubble>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {label ? <Text style={[type.b2, { color: colors.grey900, marginRight: 4 }]}>{label}</Text> : null}
        {[0, 1, 2].map((i) => (
          <Animated.View key={i} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.grey500, opacity: a.interpolate({ inputRange: [0, (i + 1) / 4, 1], outputRange: [0.3, 1, 0.3] }) }} />
        ))}
      </View>
    </AiBubble>
  );
}

export function PromptChips({ prompts, onPick }: { prompts: string[]; onPick: (p: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }} keyboardShouldPersistTaps="handled">
      {prompts.map((p) => (
        <Pressable key={p} onPress={() => onPick(p)} style={({ pressed }) => [st.prompt, pressed && { opacity: 0.7 }]}>
          <Text style={[type.l3, { color: colors.grey900 }]}>{p}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function Composer({ onSend, placeholder = 'Type here', disabled, testID }: { onSend: (t: string) => void; placeholder?: string; disabled?: boolean; testID?: string }) {
  const [t, setT] = useState('');
  const send = () => {
    if (!t.trim()) return;
    onSend(t.trim());
    setT('');
  };
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <TextInput
        testID={testID}
        editable={!disabled}
        value={t}
        onChangeText={setT}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onSubmitEditing={send}
        returnKeyType="send"
        style={[type.b2, st.input, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
      />
      <Pressable accessibilityLabel="Send" testID={testID ? `${testID}-send` : undefined} onPress={send} disabled={!t.trim()} style={[st.send, { backgroundColor: t.trim() ? colors.brand : colors.disabled }]}>
        <Feather name="arrow-right" size={18} color={colors.white} />
      </Pressable>
    </View>
  );
}

export function FileBubble({ name, size, mine = true }: { name: string; size: string; mine?: boolean }) {
  return (
    <View style={[st.file, mine ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
      <Feather name="file-text" size={18} color={colors.brand} />
      <View>
        <Text style={[type.l2, { color: colors.grey900 }]}>{name}</Text>
        <Text style={[type.b4, { color: colors.grey600 }]}>{size}</Text>
      </View>
    </View>
  );
}

export function MessageBubble({ text, mine, time }: { text: string; mine: boolean; time: string }) {
  return (
    <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '85%', gap: 4 }}>
      <View style={[st.msg, mine ? { backgroundColor: colors.selected } : { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight }]}>
        <Text style={[type.b2, { color: colors.grey900 }]}>{text}</Text>
      </View>
      <Text style={[type.b4, { color: colors.grey500, alignSelf: mine ? 'flex-end' : 'flex-start' }]}>{time}</Text>
    </View>
  );
}

export { Avatar };

const st = StyleSheet.create({
  ai: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.borderLight, flexShrink: 1 },
  user: { backgroundColor: colors.selected, borderRadius: radius.lg, padding: 10, flexShrink: 1 },
  prompt: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 30, borderWidth: 1, borderColor: colors.borderMedium, backgroundColor: colors.white },
  input: { flex: 1, height: 44, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white, color: colors.grey900 },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  file: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white, minWidth: 200 },
  msg: { padding: 12, borderRadius: 10 },
});
