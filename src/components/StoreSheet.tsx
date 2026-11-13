// Native purchase confirmation (Figma: "App Store" sheet) and the "You are all set" alert.
// BACKEND: replace with expo-iap / RevenueCat purchase and server-side receipt validation.
import { Feather } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';
import { Button, Dialog, Divider, Sheet } from '@/components/ui';
import { plans } from '@/data/plans';
import { useApp, type Plan } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export function StoreSheet({ plan, visible, onClose, onConfirm }: { plan: Exclude<Plan, 'free'>; visible: boolean; onClose: () => void; onConfirm: () => void }) {
  const email = useApp((s) => s.email);
  const p = plans.find((x) => x.id === plan)!;
  return (
    <Sheet visible={visible} onClose={onClose} title={Platform.OS === 'android' ? 'Google Play' : 'App Store'}>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <View style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 16, gap: 10 }}>
          <View>
            <Text style={[type.l1, { color: colors.grey900 }]}>Proquity Capital</Text>
            <Text style={[type.b4, { color: colors.grey500 }]}>Finance • Offers In-App Purchases</Text>
          </View>
          <Divider />
          <Text style={[type.h4, { color: colors.grey900 }]}>${p.total.toFixed(2)}</Text>
          <Text style={[type.b4, { color: colors.grey500 }]}>Auto-renew, every {p.months === 1 ? 'month' : `${p.months} months`}</Text>
          <Divider />
          <Text style={[type.b3, { color: colors.grey700 }]}>Cancel anytime in Settings at least one day before each renewal date. Plan automatically renews until cancelled.</Text>
          <Divider />
          <Text style={[type.b4, { color: colors.grey500 }]}>Account: {email}</Text>
        </View>
        <Button testID="store-confirm" title="Confirm purchase" icon={<Feather name="lock" size={16} color={colors.grey200} />} onPress={onConfirm} />
        <Text style={[type.b4, { color: colors.grey500, textAlign: 'center' }]}>Preview build — no payment is taken.</Text>
      </View>
    </Sheet>
  );
}

export function PurchasedDialog({ visible, onOk }: { visible: boolean; onOk: () => void }) {
  return <Dialog visible={visible} title="You are all set" body="Your purchase was successful." icon={<View />} actions={[{ label: 'Ok', variant: 'link', onPress: onOk }]} />;
}
