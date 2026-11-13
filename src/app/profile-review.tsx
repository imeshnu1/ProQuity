// Your profile is under review (Figma: Profile in-review).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Screen } from '@/components/ui';
import { colors, type } from '@/theme/tokens';

function Step({ label, sub, state }: { label: string; sub: string; state: 'done' | 'active' | 'todo' }) {
  const c = state === 'done' ? colors.success : state === 'active' ? colors.warning : colors.grey400;
  return (
    <View style={{ alignItems: 'center', gap: 6, width: 90 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: c, backgroundColor: state === 'todo' ? colors.white : c, alignItems: 'center', justifyContent: 'center' }}>
        {state !== 'todo' ? <Feather name="check" size={12} color={colors.white} /> : null}
      </View>
      <Text style={[type.l3, { color: state === 'todo' ? colors.grey400 : colors.grey900 }]}>{label}</Text>
      <Text style={[type.b4, { color: c }]}>{sub}</Text>
    </View>
  );
}

export default function Review() {
  return (
    <Screen bg={colors.selected} style={{ justifyContent: 'center' }}>
      <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 24, alignItems: 'center', gap: 12 }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.grey200, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="clock" size={26} color={colors.grey700} />
        </View>
        <Text style={[type.h2, { color: colors.grey900 }]}>Your profile is under review</Text>
        <Text style={[type.b2, { color: colors.grey600, textAlign: 'center' }]}>We’re reviewing your details to keep the seeker network trusted and credible.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 }}>
          <Step label="PROFILE" sub="Completed" state="done" />
          <Step label="REVIEW" sub="In Progress" state="active" />
          <Step label="APPROVED" sub="Pending" state="todo" />
        </View>
        <Text style={[type.b2, { color: colors.grey700, textAlign: 'center' }]}>This usually takes 24-48 hours. You’ll be notified as soon as your profile is approved. No action is required from you now.</Text>
        <Button testID="review-ok" title="Okay, got it" style={{ alignSelf: 'stretch', marginTop: 8 }} onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
        <Button title="Edit Profile" variant="ghost" onPress={() => router.replace('/profile')} />
        <Text style={[type.b3, { color: colors.grey500, fontStyle: 'italic' }]}>Editing will restart the review process</Text>
      </View>
    </Screen>
  );
}
