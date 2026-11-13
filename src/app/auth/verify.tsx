// Verify Your Email (Figma: Login-with-email-screen, OTP states).
// mode = signup | login | change-email
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { OtpInput } from '@/components/OtpInput';
import { BackButton, Button, H1, Screen, SecureNote, toast } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, type, fonts } from '@/theme/tokens';
import { maskEmail } from '@/utils/format';

export default function Verify() {
  const { email = '', mode = 'signup' } = useLocalSearchParams<{ email: string; mode: string }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(30);
  const signIn = useApp((s) => s.signIn);
  const setEmail = useApp((s) => s.setEmail);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  // BACKEND: send the code to the server for verification. Any 6 digits work in this build.
  const verify = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (mode === 'change-email') {
        setEmail(email);
        toast('Email updated successfully!');
        router.back();
        return;
      }
      toast('Email verified successfully!');
      if (mode === 'login') {
        signIn('email', email, true);
        router.replace('/home');
      } else {
        signIn('email', email);
        router.replace('/onboarding/intent');
      }
    }, 500);
  };

  return (
    <Screen footer={<SecureNote text="Your email is never shared. Used only for verification" />}>
      <View style={{ gap: 20, paddingTop: 12 }}>
        <BackButton />
        <View style={{ gap: 4 }}>
          <H1 style={type.h2}>Verify Your Email</H1>
          <Text style={[type.b3, { color: colors.grey600 }]}>We’ve sent a 6-digit code to {maskEmail(email)}.</Text>
        </View>
        <OtpInput value={code} onChange={setCode} />
        <Button testID="verify" title="Verify" disabled={code.length < 6} loading={busy} onPress={verify} />
        <Text style={[type.b2, { color: colors.grey600, textAlign: 'center' }]}>
          Didn’t receive the code?{' '}
          {left > 0 ? (
            <Text style={{ color: colors.grey500 }}>Resend in {left}s</Text>
          ) : (
            <Text
              accessibilityRole="button"
              style={{ color: colors.brand, fontFamily: fonts.bold }}
              onPress={() => {
                setLeft(30);
                toast('A new code has been sent');
              }}
            >
              Resend Code
            </Text>
          )}
        </Text>
        <Text style={[type.b4, { color: colors.grey500, textAlign: 'center' }]}>Preview build: any 6-digit code works.</Text>
      </View>
    </Screen>
  );
}
