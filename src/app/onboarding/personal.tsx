// Complete Personal Info (Figma: CompleteProfile) — shown when the user signed up by email.
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { pickImage } from '@/components/media';
import { BackButton, Button, H1, Input, ProgressBar, Screen, SecureNote } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';
import { isUrl } from '@/utils/format';

export default function Personal() {
  const p = useApp((s) => s.profile);
  const update = useApp((s) => s.updateProfile);
  const [first, setFirst] = useState(p.firstName);
  const [last, setLast] = useState(p.lastName);
  const [li, setLi] = useState(p.linkedin);
  const [photo, setPhoto] = useState<string | null>(p.photo);
  const liBad = !!li && !isUrl(li);
  const ok = first.trim() && last.trim() && !liBad;

  return (
    <Screen>
      <View style={{ gap: 16, paddingTop: 12 }}>
        <BackButton />
        <ProgressBar value={0.85} />
        <H1 style={{ fontSize: 22 }}>Complete Personal Info</H1>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Pressable testID="pick-photo" accessibilityLabel="Add profile image" onPress={async () => setPhoto((await pickImage()) ?? photo)} style={{ width: 100, height: 100, borderRadius: 12, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {photo && photo !== 'initials' ? <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} /> : <Feather name="image" size={24} color={colors.brand} />}
          </Pressable>
          {photo ? (
            <Pressable onPress={() => setPhoto(null)} accessibilityLabel="Remove photo" style={{ position: 'absolute', top: -6, right: '36%', backgroundColor: colors.error, borderRadius: 12, padding: 4 }}>
              <Feather name="trash-2" size={12} color={colors.white} />
            </Pressable>
          ) : null}
          <Text style={[type.b2, { color: colors.grey700 }]}>Profile image</Text>
        </View>
        <Input testID="first-name" label="First name" placeholder="Enter your first name*" value={first} onChangeText={setFirst} autoComplete="given-name" />
        <Input testID="last-name" label="Last name" placeholder="Enter your last name*" value={last} onChangeText={setLast} autoComplete="family-name" />
        <Input label="LinkedIn URL" placeholder="Enter your LinkedIn profile URL" value={li} onChangeText={setLi} autoCapitalize="none" keyboardType="url" error={liBad ? 'Enter a valid URL' : undefined} />
        <Button
          testID="personal-continue"
          title="Continue"
          disabled={!ok}
          onPress={() => {
            update({ firstName: first.trim(), lastName: last.trim(), linkedin: li.trim(), photo });
            router.push('/onboarding/profile');
          }}
        />
        <SecureNote />
      </View>
    </Screen>
  );
}
