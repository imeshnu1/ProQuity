// Manage Subscription (Figma: Manage Subscription).
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PurchasedDialog, StoreSheet } from '@/components/StoreSheet';
import { BackButton, Button, Radio, Screen, LegalFooter } from '@/components/ui';
import { plans } from '@/data/plans';
import { useApp, type Plan } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function Subscription() {
  const plan = useApp((s) => s.plan);
  const setPlan = useApp((s) => s.setPlan);
  const [sel, setSel] = useState<Plan>(plan);
  const [store, setStore] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <Screen
      footer={
        <View style={{ gap: 10 }}>
          <Button testID="update-sub" title="Update Subscription" disabled={sel === plan || sel === 'free'} onPress={() => setStore(true)} />
          <LegalFooter />
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <Text style={[type.h3, { color: colors.grey900 }]}>Manage Subscription</Text>
      </View>
      <View style={{ gap: 14, marginTop: 12 }}>
        {plans.map((p) => {
          const current = p.id === plan;
          const on = p.id === sel;
          return (
            <Pressable key={p.id} testID={`sub-${p.id}`} onPress={() => setSel(p.id)} style={{ borderRadius: 10, padding: 18, backgroundColor: current ? colors.brand : colors.white, borderWidth: 1, borderColor: on ? colors.brand : colors.borderLight, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              {current ? (
                <View style={{ position: 'absolute', top: -10, left: 10, backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 }}>
                  <Text style={[type.l4, { color: colors.white }]}>Current Plan</Text>
                </View>
              ) : null}
              <View style={current ? { borderRadius: 12, backgroundColor: colors.white } : undefined}>
                <Radio on={on} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.l2, { color: current ? colors.white : colors.grey900 }]}>{p.label.replace(' ', '-')} Plan</Text>
                <Text style={[type.l2, { color: current ? colors.white : colors.grey900 }]}>${p.total}</Text>
              </View>
              {p.off ? (
                <View style={{ borderRadius: 12, borderWidth: 1, borderColor: colors.blue, backgroundColor: colors.blueLight, paddingHorizontal: 8, paddingVertical: 1 }}>
                  <Text style={[type.l4, { color: colors.blue }]}>{p.off}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {sel !== 'free' ? (
        <StoreSheet
          plan={sel as Exclude<Plan, 'free'>}
          visible={store}
          onClose={() => setStore(false)}
          onConfirm={() => {
            setStore(false);
            setPlan(sel);
            setTimeout(() => setDone(true), 250);
          }}
        />
      ) : null}
      <PurchasedDialog visible={done} onOk={() => (setDone(false), router.back())} />
    </Screen>
  );
}
