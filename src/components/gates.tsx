// Gates for premium-only and complete-profile-only actions.
// Figma: "Subscribe to unlock investor access" sheet, "Complete your profile to continue" sheet.
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScoreChecklist } from '@/components/Score';
import { PurchasedDialog, StoreSheet } from '@/components/StoreSheet';
import { Button, Sheet } from '@/components/ui';
import { benefits, plans } from '@/data/plans';
import { completion, isPremium, useApp, type Plan } from '@/store/app-store';
import { colors, type, fonts } from '@/theme/tokens';

export function UnlockSheet({ visible, onClose, onUnlocked }: { visible: boolean; onClose: () => void; onUnlocked?: () => void }) {
  const setPlan = useApp((s) => s.setPlan);
  const [sel, setSel] = useState<Exclude<Plan, 'free'>>('3m');
  const [store, setStore] = useState(false);
  const [done, setDone] = useState(false);
  const list = [
    benefits[0],
    benefits[1],
    { t: 'AI-matched recommendations', s: 'Get new matches as they become active.' },
    benefits[2],
  ];
  return (
    <>
      <Sheet visible={visible && !store} onClose={onClose} showClose={false} maxHeight="94%">
        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 14 }}>
          <Text onPress={onClose} style={[type.l2, { color: colors.grey600, alignSelf: 'flex-end' }]}>
            Skip for now
          </Text>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.grey200, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="lock" size={20} color={colors.brand} />
            </View>
            <Text style={[type.h2, { color: colors.grey900, textAlign: 'center', fontFamily: fonts.medium }]}>Subscribe to unlock investor access</Text>
          </View>
          {list.map((b) => (
            <View key={b.t} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="check" size={12} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.l2, { color: colors.grey900 }]}>{b.t}</Text>
                <Text style={[type.b3, { color: colors.grey600 }]}>{b.s}</Text>
              </View>
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {plans.map((p) => {
              const on = p.id === sel;
              return (
                <Pressable key={p.id} onPress={() => setSel(p.id)} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: on ? colors.brand : colors.borderMedium, backgroundColor: on ? colors.brand : colors.white }}>
                  <Text style={[type.b4, { color: on ? colors.white : colors.grey700 }]}>{p.label}</Text>
                  <Text style={[type.h4, { color: on ? colors.white : colors.grey900 }]}>${p.perMonth}</Text>
                  <Text style={[type.b4, { color: on ? colors.roseWash : colors.grey600 }]}>per month</Text>
                  {p.off ? <Text style={[type.l4, { color: on ? colors.white : colors.blue }]}>{p.off}</Text> : null}
                </Pressable>
              );
            })}
          </View>
          <Button testID="unlock-subscribe" title="Subscribe Now" onPress={() => setStore(true)} />
          <Text style={[type.b4, { color: colors.grey600, textAlign: 'center' }]}>By subscribing, you agree to our Terms of Service and Privacy Policy. Your payment will be charged to your account.</Text>
        </View>
      </Sheet>
      <StoreSheet
        plan={sel}
        visible={visible && store}
        onClose={() => setStore(false)}
        onConfirm={() => {
          setStore(false);
          setPlan(sel);
          onClose();
          setTimeout(() => setDone(true), 250);
        }}
      />
      <PurchasedDialog
        visible={done}
        onOk={() => {
          setDone(false);
          onUnlocked?.();
        }}
      />
    </>
  );
}

export function usePremiumGate() {
  const plan = useApp((s) => s.plan);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<null | (() => void)>(null);
  const guard = (fn: () => void) => {
    if (isPremium(plan)) return fn();
    setPending(() => fn);
    setOpen(true);
  };
  const element = <UnlockSheet visible={open} onClose={() => setOpen(false)} onUnlocked={() => pending?.()} />;
  return { guard, element, premium: isPremium(plan) };
}

export function useProfileGate() {
  const state = useApp();
  const { score, items } = completion(state);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<null | (() => void)>(null);
  const guard = (fn: () => void) => {
    if (score >= 100) return fn();
    setPending(() => fn);
    setOpen(true);
  };
  const element = (
    <Sheet visible={open} onClose={() => setOpen(false)} showClose={false}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 14 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Feather name="info" size={28} color={colors.grey600} />
          <Text style={[type.h2, { color: colors.grey900, textAlign: 'center', fontFamily: fonts.medium }]}>Complete your profile to continue</Text>
          <Text style={[type.b2, { color: colors.grey600, textAlign: 'center' }]}>This will only take about 2 minutes to complete you profile and you will be able to access the hidden features.</Text>
        </View>
        <ScoreChecklist score={score} items={items} />
        <Button testID="gate-complete" title="Complete Profile" onPress={() => (setOpen(false), router.push('/profile'))} />
        <Button testID="gate-later" title="I’ll do it later" variant="ghost" onPress={() => (setOpen(false), pending?.())} />
      </View>
    </Sheet>
  );
  return { guard, element, score };
}
