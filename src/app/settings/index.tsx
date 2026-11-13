// Settings (Figma: Settings, Update primary email, Delete Account).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NotifyPrompt } from '@/components/NotifyPrompt';
import { BackButton, Button, Dialog, Input, Screen, Sheet, Toggle } from '@/components/ui';
import { planName } from '@/data/plans';
import { visibilityOptions } from '@/data/questionnaire';
import { useApp } from '@/store/app-store';
import { colors, radius, type } from '@/theme/tokens';
import { isEmail } from '@/utils/format';

function Block({ label, children, onEdit, info }: { label: string; children: React.ReactNode; onEdit?: () => void; info?: boolean }) {
  return (
    <View style={{ backgroundColor: colors.grey100, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.borderLight, gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={[type.b3, { color: colors.grey600, flex: 1 }]}>
          {label} {info ? <Feather name="info" size={11} /> : null}
        </Text>
        {onEdit ? <Feather name="edit-2" size={14} color={colors.grey600} onPress={onEdit} accessibilityLabel={`Edit ${label}`} /> : null}
      </View>
      {children}
    </View>
  );
}

export default function Settings() {
  const s = useApp();
  const [emailSheet, setEmailSheet] = useState(false);
  const [email, setEmail] = useState(s.email);
  const [del, setDel] = useState(false);
  const [notify, setNotify] = useState(false);
  const vis = visibilityOptions.find((v) => v.id === s.visibility)!;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <BackButton />
        <Text style={[type.h2, { color: colors.grey900 }]}>Settings</Text>
      </View>
      <View style={{ gap: 12, marginTop: 8 }}>
        <Block label="Account Settings" onEdit={() => (setEmail(s.email), setEmailSheet(true))}>
          <Text testID="settings-email" style={[type.b2, { color: colors.grey900 }]}>{s.email} (Primary)</Text>
        </Block>
        <Block label="Visibility Preferences" info onEdit={() => router.push('/settings/visibility')}>
          <Text style={[type.b2, { color: colors.grey900 }]}>{vis.title}</Text>
        </Block>
        <Block label="Subscription">
          <Text testID="settings-plan" style={[type.b2, { color: colors.grey900 }]}>{planName(s.plan)}</Text>
          <Button testID="manage-sub" small variant="outline" title={s.plan === 'free' ? 'Upgrade' : 'Manage Subscription'} onPress={() => router.push(s.plan === 'free' ? '/paywall' : '/settings/subscription')} style={{ marginTop: 6 }} />
        </Block>
        <Block label="Notifications Preferences">
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[type.b2, { color: colors.grey900, flex: 1 }]}>Notifications</Text>
            <Toggle value={!!s.notificationsOn} onValueChange={(v) => (v ? setNotify(true) : s.setNotifications(false))} label="Notifications" />
          </View>
        </Block>
        <Block label="Danger Zone">
          <Pressable testID="delete-profile" onPress={() => setDel(true)} style={{ alignItems: 'center', paddingVertical: 6 }}>
            <Text style={[type.l1, { color: colors.error }]}>Delete my Profile</Text>
          </Pressable>
        </Block>
        <Pressable
          testID="logout"
          onPress={() => {
            s.signOut();
            router.replace('/welcome');
          }}
          style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }}
        >
          <Feather name="log-out" size={16} color={colors.grey700} />
          <Text style={[type.l2, { color: colors.grey700 }]}>Log out</Text>
        </Pressable>
      </View>

      <Sheet
        visible={emailSheet}
        onClose={() => setEmailSheet(false)}
        title="Edit Primary Email"
        footer={
          <Button
            testID="update-email"
            title="Update Email"
            disabled={!isEmail(email) || email === s.email}
            onPress={() => {
              setEmailSheet(false);
              router.push({ pathname: '/auth/verify', params: { email, mode: 'change-email' } });
            }}
          />
        }
      >
        <View style={{ paddingHorizontal: 20 }}>
          <Input testID="new-email" label="Email Address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" rightIcon="mail" hint="This is the primary email linked to your account. You need to verify your new email if you change it now." />
        </View>
      </Sheet>

      <Dialog
        visible={del}
        onClose={() => setDel(false)}
        title="Permanently delete my account"
        body="This action is permanent and cannot be undone. Deleting your account will remove profile, investor connections and deal history. If you need a break, you can logout from your account instead."
        actions={[
          {
            label: 'Yes, Delete',
            variant: 'danger',
            onPress: () => {
              setDel(false);
              s.deleteAccount();
              router.replace('/welcome');
            },
          },
          { label: 'Cancel', variant: 'outline', onPress: () => setDel(false) },
        ]}
      />
      <NotifyPrompt visible={notify} onResult={(on) => (setNotify(false), on !== null && s.setNotifications(on))} />
    </Screen>
  );
}
