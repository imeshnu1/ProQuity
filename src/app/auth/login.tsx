// Login into your account (Figma: Login-with-email-screen).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { BackButton, Button, H1, Input, Screen, SecureNote } from '@/components/ui';
import { colors, type } from '@/theme/tokens';
import { isEmail } from '@/utils/format';

export default function Login() {
  const [email, setEmail] = useState('');
  const ok = isEmail(email);
  const go = () => router.push({ pathname: '/auth/verify', params: { email, mode: 'login' } });
  return (
    <Screen footer={<SecureNote />}>
      <View style={{ gap: 20, paddingTop: 12 }}>
        <BackButton />
        <View style={{ gap: 4 }}>
          <H1 style={type.h2}>Login into your account</H1>
          <Text style={[type.b3, { color: colors.grey600 }]}>Welcome back! Please proceed with following details</Text>
        </View>
        <Button testID="login-linkedin" title="Continue with LinkedIn" variant="linkedin" icon={<Feather name="linkedin" size={18} color={colors.white} />} onPress={() => router.push({ pathname: '/auth/linkedin', params: { next: 'login' } })} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderMedium }} />
          <Text style={[type.b2, { color: colors.grey600 }]}>or continue with email</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderMedium }} />
        </View>
        <Input testID="login-email" label="Email address" placeholder="Enter your email address*" rightIcon="mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} onSubmitEditing={() => ok && go()} />
        <Button testID="login-continue" title="Continue" disabled={!ok} onPress={go} />
      </View>
    </Screen>
  );
}
