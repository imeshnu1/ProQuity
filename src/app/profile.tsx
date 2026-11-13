// My profile (Figma: Profile). Continue submits the completed profile for review.
import { router } from 'expo-router';
import { View } from 'react-native';
import { ProfileEditor } from '@/components/ProfileEditor';
import { BackButton, Button, Screen, toast } from '@/components/ui';
import { completion, useApp } from '@/store/app-store';

export default function Profile() {
  const s = useApp();
  const { score } = completion(s);
  return (
    <Screen
      footer={
        <Button
          testID="profile-done"
          title={score >= 100 && s.profileStatus === 'draft' ? 'Submit for review' : 'Continue'}
          onPress={() => {
            if (score >= 100 && s.profileStatus === 'draft') {
              s.submitForReview();
              router.replace('/profile-review');
            } else {
              if (score < 100) toast('Saved. Complete all sections to submit for review.');
              router.back();
            }
          }}
        />
      }
    >
      <View style={{ paddingTop: 12, gap: 12 }}>
        <BackButton />
        <ProfileEditor showViews />
      </View>
    </Screen>
  );
}
