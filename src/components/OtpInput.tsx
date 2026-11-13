import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';
import { colors, type } from '@/theme/tokens';

export function OtpInput({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const ref = useRef<TextInputInstance>(null);
  const [focus, setFocus] = useState(false);
  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel="Verification code">
      <View style={st.row}>
        {Array.from({ length }).map((_, i) => {
          const active = focus && i === Math.min(value.length, length - 1);
          return (
            <View key={i} style={[st.box, active && { borderColor: colors.brand }]}>
              <Text style={[type.h3, { color: colors.grey900 }]}>{value[i] ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        testID="otp-input"
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[StyleSheet.absoluteFill, { opacity: 0.01, color: 'transparent' }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
      />
    </Pressable>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  box: { width: 48, height: 52, borderRadius: 8, borderWidth: 1, borderColor: colors.borderMedium, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
