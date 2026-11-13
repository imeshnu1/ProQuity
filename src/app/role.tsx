// Role Selection (Figma: RoleSelection).
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { BackButton, Button, Dialog, H1, OptionCard, Screen } from '@/components/ui';
import { roles } from '@/data/questionnaire';
import { useApp } from '@/store/app-store';

export default function RoleScreen() {
  const [role, setRole] = useState<string | null>(useApp.getState().role);
  const [soon, setSoon] = useState(false);
  const setStoreRole = useApp((s) => s.setRole);

  const next = () => {
    if (role !== 'seeker') return setSoon(true);
    setStoreRole('seeker');
    router.push('/intro');
  };

  return (
    <Screen footer={<Button testID="role-continue" title="Continue" disabled={!role} onPress={next} />}>
      <View style={{ gap: 20, paddingTop: 12 }}>
        <BackButton />
        <H1>Which role best describes you?</H1>
        <View style={{ gap: 10 }}>
          {roles.map((r) => (
            <OptionCard key={r.id} testID={`role-${r.id}`} title={r.title} subtitle={r.subtitle} tags={r.tags} selected={role === r.id} onPress={() => setRole(r.id)} />
          ))}
        </View>
      </View>
      <Dialog
        visible={soon}
        title="Coming soon"
        body="The Capital Provider and Capital Advisor experiences are being finalised. You can explore Proquity as a Capital Seeker today and switch roles later."
        onClose={() => setSoon(false)}
        actions={[
          {
            label: 'Continue as Capital Seeker',
            onPress: () => {
              setSoon(false);
              setRole('seeker');
            },
          },
        ]}
      />
    </Screen>
  );
}
