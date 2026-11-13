// Sign up using your email (Figma: SingupWith Email).
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { BackButton, Button, H1, Input, LinkText, Screen, SecureNote, Small } from '@/components/ui';
import { colors, type } from '@/theme/tokens';
import { isEmail } from '@/utils/format';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const ok = isEmail(email);
  return (
    <Screen footer={<SecureNote text="Your data is secured and not shared without any consent." />}>
      <View style={{ gap: 20, paddingTop: 12 }}>
        <BackButton />
        <View style={{ gap: 4 }}>
          <H1 style={type.h2}>Sign up using your email</H1>
          <Small style={{ color: colors.grey600 }}>This helps us personalise investor matches for you.</Small>
        </View>
        <Input
          testID="signup-email"
          label="Email address"
          placeholder="Enter your email address*"
          rightIcon="mail"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched(true)}
          error={touched && email && !ok ? 'Enter a valid email address' : undefined}
          onSubmitEditing={() => ok && router.push({ pathname: '/auth/verify', params: { email, mode: 'signup' } })}
        />
        <Button testID="signup-continue" title="Continue" disabled={!ok} onPress={() => router.push({ pathname: '/auth/verify', params: { email, mode: 'signup' } })} />
        <Text style={[type.b3, { color: colors.grey600 }]}>
          By proceeding, you agree to the <LinkText style={type.b3}>Terms of Use</LinkText> & <LinkText style={type.b3}>Privacy Policy</LinkText>
        </Text>
      </View>
    </Screen>
  );
}
