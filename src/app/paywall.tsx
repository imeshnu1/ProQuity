// Unlock full Access (Figma: Upgrade screen / Subscribe + Paywall).
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PurchasedDialog, StoreSheet } from '@/components/StoreSheet';
import { BackButton, Button, Screen, LegalFooter } from '@/components/ui';
import { benefits, plans } from '@/data/plans';
import { useApp, type Plan } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

export default function Paywall() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const setPlan = useApp((s) => s.setPlan);
  const [sel, setSel] = useState<Exclude<Plan, 'free'>>('3m');
  const [store, setStore] = useState(false);
  const [done, setDone] = useState(false);
  const leave = () => (from === 'onboarding' || !router.canGoBack() ? router.replace('/home') : router.back());

  return (
    <Screen
      bg={colors.lightRose}
      footer={
        <View style={{ gap: 10 }}>
          <Button testID="subscribe" title="Subscribe now" onPress={() => setStore(true)} />
          <Button testID="paywall-skip" title="Skip for now" variant="ghost" onPress={leave} />
          <LegalFooter />
        </View>
      }
    >
      <View style={{ gap: 16, paddingTop: 12 }}>
        <BackButton onPress={leave} />
        <View>
          <Text style={[type.h1, { color: colors.grey900, fontSize: 26, lineHeight: 32 }]}>Unlock full Access{'\n'}CRM, AI, and Investor access</Text>
          <Text style={[type.b2, { color: colors.grey700, marginTop: 6 }]}>Continue with full access when you’re ready. You can explore Proquity for free. Upgrade only when you want to actively connect with investors.</Text>
        </View>
        <Text style={[type.l3, { color: colors.grey600, letterSpacing: 0.5 }]}>WHAT YOU UNLOCK WITH FULL ACCESS</Text>
        <View style={{ gap: 14 }}>
          {benefits.map((b) => (
            <View key={b.t} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="check" size={13} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.l2, { color: colors.grey900 }]}>{b.t}</Text>
                <Text style={[type.b3, { color: colors.grey600 }]}>{b.s}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {plans.map((p) => {
            const on = p.id === sel;
            return (
              <Pressable key={p.id} testID={`plan-${p.id}`} onPress={() => setSel(p.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} style={{ flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: on ? colors.brand : colors.borderMedium, backgroundColor: on ? colors.brand : colors.white, gap: 2 }}>
                <Text style={[type.b3, { color: on ? colors.white : colors.grey700 }]}>{p.label}</Text>
                <Text style={[type.h3, { color: on ? colors.white : colors.grey900 }]}>${p.perMonth.toFixed(2).replace('.00', '')}</Text>
                <Text style={[type.b4, { color: on ? colors.roseWash : colors.grey600 }]}>per month</Text>
                {p.off ? (
                  <View style={{ marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: on ? colors.roseWash : colors.blueLight }}>
                    <Text style={[type.l4, { color: colors.brand }]}>{p.off}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
      <StoreSheet
        plan={sel}
        visible={store}
        onClose={() => setStore(false)}
        onConfirm={() => {
          setStore(false);
          setPlan(sel);
          setTimeout(() => setDone(true), 250);
        }}
      />
      <PurchasedDialog
        visible={done}
        onOk={() => {
          setDone(false);
          leave();
        }}
      />
    </Screen>
  );
}
