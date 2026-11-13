// "Get notified for opportunities" explainer + the system permission prompt (Figma: Enable Notification).
// BACKEND: call expo-notifications requestPermissionsAsync() and register the push token where marked.
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Dialog, Sheet } from '@/components/ui';
import { colors, type } from '@/theme/tokens';

const reasons: { icon: React.ComponentProps<typeof Feather>['name']; t: string }[] = [
  { icon: 'thumbs-up', t: 'New high relevance matches.' },
  { icon: 'message-square', t: 'Direct messages or connection requests.' },
  { icon: 'check-square', t: 'Status changes on existing matches.' },
  { icon: 'calendar', t: 'Event invitations or webinars.' },
];

export function NotifyPrompt({ visible, onResult }: { visible: boolean; onResult: (on: boolean | null) => void }) {
  const [system, setSystem] = useState(false);
  return (
    <>
      <Sheet visible={visible && !system} onClose={() => onResult(null)} showClose={false} maxHeight="92%">
        <View style={{ padding: 24, alignItems: 'center', gap: 10 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="bell" size={30} color={colors.white} />
          </View>
          <Text style={[type.h3, { color: colors.grey900, marginTop: 6 }]}>Get notified for opportunities</Text>
          <Text style={[type.b2, { color: colors.grey600, textAlign: 'center', fontStyle: 'italic' }]}>Get notified when capital providers align with your opportunity or show interest.</Text>
          <View style={{ alignSelf: 'stretch', backgroundColor: colors.bg, borderRadius: 12, padding: 16, gap: 14, marginTop: 10 }}>
            <Text style={[type.l2, { color: colors.grey900 }]}>You’ll only receive notifications for:</Text>
            {reasons.map((r) => (
              <View key={r.t} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Feather name={r.icon} size={16} color={colors.brand} />
                <Text style={[type.b3, { color: colors.grey700 }]}>{r.t}</Text>
              </View>
            ))}
          </View>
          <Text style={[type.b3, { color: colors.grey600, textAlign: 'center', marginVertical: 8 }]}>You can change or enable notifications at any time in settings.</Text>
          <Button testID="notify-enable" title="Enable Notifications" style={{ alignSelf: 'stretch' }} onPress={() => setSystem(true)} />
          <Button title="Not now" variant="ghost" style={{ alignSelf: 'stretch' }} onPress={() => onResult(false)} />
        </View>
      </Sheet>
      <Dialog
        visible={visible && system}
        title="Turn on Notifications"
        body="This help you stay updated on important updates and messages related to your opportunity."
        icon={null}
        actions={[
          { label: 'Allow Notifications', variant: 'link', onPress: () => (setSystem(false), onResult(true)) },
          { label: 'Don’t Allow', variant: 'link', onPress: () => (setSystem(false), onResult(false)) },
        ]}
      />
    </>
  );
}
