import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { VisibilityPicker } from '@/components/VisibilityPicker';
import { BackButton, Button, Screen, toast } from '@/components/ui';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function VisibilitySettings() {
  const saved = useApp((s) => s.visibility);
  const set = useApp((s) => s.setVisibility);
  const [v, setV] = useState(saved);
  return (
    <Screen footer={<Button title="Save Changes" disabled={v === saved} onPress={() => (set(v), toast('Changes saved Successfully.'), router.back())} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <Text style={[type.h2, { color: colors.grey900 }]}>Visibility Preferences</Text>
      </View>
      <VisibilityPicker value={v} onChange={setV} />
    </Screen>
  );
}
