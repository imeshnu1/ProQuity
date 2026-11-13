// Dashboard (Figma: Home — 1st time user, existing user, full access).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { MatchCard } from '@/components/cards';
import { Composer, PromptChips } from '@/components/chat';
import { Gauge } from '@/components/Score';
import { Avatar, Button, Card, SectionHeader, Skeleton, Tag, toast, useFirstLoad } from '@/components/ui';
import { aiPrompts, findPerson, providers } from '@/data/sample';
import { completion, useApp } from '@/store/app-store';
import { colors, radius, type } from '@/theme/tokens';
import { fmtTime } from '@/utils/format';

export default function Home() {
  const s = useApp();
  const { score } = completion(s);
  const loading = useFirstLoad('home');
  const first = s.profile.firstName || 'John';
  const upcoming = s.bookings.filter((b) => b.status === 'scheduled');
  const followUps = s.conversations.filter((c) => c.status === 'Contacted').slice(0, 4);

  const alerts: { key: string; node: React.ReactNode }[] = [];
  if (score < 100)
    alerts.push({
      key: 'score',
      node: (
        <Pressable testID="alert-profile" onPress={() => router.push('/profile')} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.goldWash, borderRadius: radius.lg, padding: 14, width: 330 }}>
          <Gauge score={score} size={72} />
          <View style={{ gap: 4 }}>
            <Text style={[type.l1, { color: colors.grey900 }]}>Complete your profile</Text>
            <Tag label="In Progress" tone="orange" />
          </View>
        </Pressable>
      ),
    });
  if (s.profileStatus === 'in-review')
    alerts.push({
      key: 'review',
      node: (
        <Pressable onPress={() => router.push('/profile-review')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.selected, borderRadius: radius.lg, padding: 14, width: 330 }}>
          <Feather name="clock" size={28} color={colors.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[type.l1, { color: colors.grey900 }]}>Your profile is under review</Text>
            <Text style={[type.b3, { color: colors.grey600 }]}>Usually takes 24–48 hours</Text>
          </View>
        </Pressable>
      ),
    });
  if (s.notificationsOn === false && !s.homeAlertDismissed)
    alerts.push({
      key: 'notif',
      node: (
        <Pressable onPress={() => router.push('/settings')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.selected, borderRadius: radius.lg, padding: 14, width: 330 }}>
          <Feather name="bell-off" size={26} color={colors.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[type.l1, { color: colors.grey900 }]}>Turn on notifications</Text>
            <Text style={[type.b3, { color: colors.grey600 }]}>Don’t miss your daily matches</Text>
          </View>
          <Feather name="x" size={16} color={colors.grey600} onPress={s.dismissHomeAlert} />
        </Pressable>
      ),
    });

  const askAI = (q: string) => router.push({ pathname: '/ai', params: { q } });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title={`Welcome ${first}`} premiumBadge />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {alerts.length ? (
          <View style={{ marginTop: 4 }}>
            <Text style={[type.b2, { color: colors.grey600, marginBottom: 8 }]}>Alerts ({alerts.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {alerts.map((a) => (
                <View key={a.key}>{a.node}</View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <Card style={{ marginTop: 12, paddingHorizontal: 0, backgroundColor: colors.white }}>
          <Text style={[type.b1, { color: colors.grey600, paddingHorizontal: 16, marginBottom: 10 }]}>Daily Matches ({providers.length > 5 ? 5 : providers.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
            {loading
              ? [0, 1].map((i) => (
                  <View key={i} testID="match-skeleton" style={{ width: 290, padding: 16, gap: 10, borderRadius: 10, backgroundColor: colors.grey100 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <Skeleton h={52} w={52} r={26} />
                      <View style={{ flex: 1, gap: 8 }}>
                        <Skeleton h={14} w="70%" />
                        <Skeleton h={10} w="40%" />
                        <Skeleton h={10} w="55%" />
                      </View>
                    </View>
                    <Skeleton h={10} w="80%" />
                    <Skeleton h={10} w="35%" style={{ alignSelf: 'center' }} />
                  </View>
                ))
              : providers.slice(0, 5).map((p) => (
                  <MatchCard key={p.id} p={p} width={290} onPress={() => router.push({ pathname: '/investor/[id]', params: { id: p.id, list: 'daily' } })} />
                ))}
          </ScrollView>
          <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[type.b1, { color: colors.grey600 }]}>Chat with Proquity AI</Text>
              <Text testID="chat-now" onPress={() => router.push('/ai')} style={[type.l3, { color: colors.brand }]}>
                Chat now
              </Text>
            </View>
            <PromptChips prompts={aiPrompts} onPick={askAI} />
            <Composer testID="home-ask" placeholder="What would you like to ask?" onSend={askAI} />
          </View>
        </Card>

        <SectionHeader title="Follow Up" action="View all" onAction={() => router.push('/messages')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {followUps.map((c) => {
            const p = findPerson(c.personId);
            return (
              <Card key={c.id} style={{ width: 300, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white }}>
                <Avatar name={p.name} size={46} />
                <View style={{ flex: 1 }}>
                  <Text style={[type.h4, { color: colors.grey900 }]}>{p.name}</Text>
                  <Text style={[type.b2, { color: colors.grey700 }]}>{p.title}</Text>
                  <Text style={[type.b2, { color: colors.grey700 }]}>{p.firmShort}</Text>
                </View>
                <Button small variant="outline" title="Follow-up" onPress={() => router.push({ pathname: '/chat/[id]', params: { id: c.id } })} />
              </Card>
            );
          })}
        </ScrollView>

        <SectionHeader title="Pitch Call Reminder" action={upcoming.length ? 'View all' : undefined} onAction={() => router.push('/pitch-calls')} />
        {upcoming.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {upcoming.map((b) => {
              const p = findPerson(b.personId);
              return (
                <Card key={b.id} style={{ width: 300, gap: 10, backgroundColor: colors.white }}>
                  <Tag label="UPCOMING" tone="blue" />
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Avatar name={p.name} size={36} />
                    <View>
                      <Text style={[type.l1, { color: colors.grey900 }]}>{p.name}</Text>
                      <Text style={[type.b3, { color: colors.grey600 }]}>
                        {new Date(b.date).toDateString()} at {fmtTime(b.date)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable accessibilityLabel="Copy invite link" onPress={() => toast('Invite link copied')} style={{ width: 40, height: 40, borderRadius: 6, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name="link" size={16} color={colors.brand} />
                    </Pressable>
                    <Button small variant="outline" title="Join Call" style={{ flex: 1 }} onPress={() => toast('Opening Zoom…')} />
                  </View>
                </Card>
              );
            })}
          </ScrollView>
        ) : (
          <Card style={{ alignItems: 'center', gap: 10, backgroundColor: colors.white }}>
            <Text style={[type.b2, { color: colors.grey600 }]}>No pitch calls scheduled yet.</Text>
            <Button small title="Book a Pitch Call" onPress={() => router.push('/book-call')} />
          </Card>
        )}

        <SectionHeader title="Recent Proquity AI Chats" action="View all" onAction={() => router.push('/ai/history')} />
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderLight }}>
          {s.aiHistory.slice(0, 4).map((h, i) => (
            <Pressable key={h} onPress={() => askAI(h)} style={{ padding: 12, borderTopWidth: i ? 1 : 0, borderColor: colors.borderLight }}>
              <Text style={[type.b2, { color: colors.grey900 }]}>{h}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
