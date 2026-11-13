import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { VisibilityPicker } from '@/components/VisibilityPicker';
import { BackButton, Button, Dialog, H1, Screen } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors } from '@/theme/tokens';

export default function Visibility() {
  const saved = useApp((s) => s.visibility);
  const setVisibility = useApp((s) => s.setVisibility);
  const [v, setV] = useState(saved);
  const [info, setInfo] = useState(false);
  return (
    <Screen
      footer={
        <Button
          testID="visibility-continue"
          title="Update & Continue"
          onPress={() => {
            setVisibility(v);
            router.push('/onboarding/ai');
          }}
        />
      }
    >
      <View style={{ gap: 16, paddingTop: 12 }}>
        <BackButton />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <H1 style={{ fontSize: 22 }}>Choose your visibility preference</H1>
          <Feather name="info" size={16} onPress={() => setInfo(true)} accessibilityLabel="About visibility" />
        </View>
        <VisibilityPicker value={v} onChange={setV} />
        <Text style={{ fontSize: 12, color: colors.grey500, textAlign: 'center' }}>You can change this anytime in Settings.</Text>
      </View>
      <Dialog visible={info} onClose={() => setInfo(false)} title="Your visibility, your control" body="Visibility decides which capital providers can discover your opportunity and how much of your identity they see before you both show interest." actions={[{ label: 'Got it', onPress: () => setInfo(false) }]} />
    </Screen>
  );
}
