// Complete Your Profile (onboarding). LinkedIn sign-ups land here directly.
import { router } from 'expo-router';
import { View } from 'react-native';
import { ProfileEditor } from '@/components/ProfileEditor';
import { BackButton, Button, H1, ProgressBar, Screen } from '@/components/ui';

export default function OnboardingProfile() {
  return (
    <Screen footer={<Button testID="profile-continue" title="Continue" onPress={() => router.push('/onboarding/visibility')} />}>
      <View style={{ gap: 16, paddingTop: 12 }}>
        <BackButton />
        <ProgressBar value={0.92} />
        <H1 style={{ fontSize: 22 }}>Complete Your Profile</H1>
        <ProfileEditor />
      </View>
    </Screen>
  );
}
