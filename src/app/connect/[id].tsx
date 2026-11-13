// Send Connection Request (Figma: Send Connection Request, Write with AI, limit states).
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePremiumGate } from '@/components/gates';
import { pickDocument } from '@/components/media';
import { Avatar, BackButton, Button, Chip, Input, Screen, Sheet, Toggle, toast } from '@/components/ui';
import { advisors, providers } from '@/data/sample';
import { FREE_DAILY_REQUESTS, isPremium, PREMIUM_DAILY_REQUESTS, useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';
import { draftEmail } from '@/utils/ai';

const tones = ['Professional', 'Friendly', 'Confident', 'Concise'];

export default function Connect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = [...providers, ...advisors].find((x) => x.id === id) ?? providers[0];
  const s = useApp();
  const premium = isPremium(s.plan);
  const limit = premium ? PREMIUM_DAILY_REQUESTS : FREE_DAILY_REQUESTS;
  const reached = s.requestsToday >= limit;
  const { guard, element } = usePremiumGate();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [summary, setSummary] = useState(true);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [ai, setAi] = useState(false);
  const [tone, setTone] = useState('Professional');
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const toEmail = `${p.name.split(' ')[0].toLowerCase()}@${p.website.replace(/^https?:\/\/(www\.)?/, '')}`;

  const generate = () => {
    setBusy(true);
    setTimeout(() => {
      const d = draftEmail(tone, prompt, p, s);
      setSubject(d.subject);
      setBody(d.body);
      setBusy(false);
      setAi(false);
    }, 700);
  };

  const send = () => {
    setPreview(false);
    const cid = s.sendConnectionRequest(p.id, subject.trim(), body.trim(), file, summary);
    toast('Connection request sent');
    router.replace({ pathname: '/chat/[id]', params: { id: cid } });
  };

  return (
    <Screen
      footer={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <MaterialCommunityIcons name="leaf" size={16} color={colors.success} />
          {reached ? (
            <Text style={[type.l3, { color: colors.success, flex: 1 }]}>Daily Limit Reached</Text>
          ) : premium ? (
            <Text style={[type.l3, { color: colors.success, flex: 1 }]}>Premium - {s.requestsToday + 1} of {limit} requests</Text>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Text style={[type.l3, { color: colors.success }]}>Free Plan</Text>
              <Pressable onPress={() => guard(() => {})} style={{ backgroundColor: colors.oliveWash, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 }}>
                <Text style={[type.l4, { color: colors.success }]}>Upgrade</Text>
              </Pressable>
            </View>
          )}
          {reached ? (
            <Button small title={premium ? 'Come back tomorrow' : 'Upgrade'} disabled={premium} onPress={() => guard(() => {})} />
          ) : (
            <Button testID="connect-send" small variant="dark" title="Send" disabled={!subject.trim() || !body.trim()} onPress={() => setPreview(true)} style={{ paddingHorizontal: 28 }} />
          )}
        </View>
      }
    >
      <View style={{ gap: 14, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BackButton />
          <Text style={[type.h2, { color: colors.grey900 }]}>Send Connection Request</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name={p.name} size={40} />
          <View>
            <Text style={[type.l2, { color: colors.grey900 }]}>Connect With {p.name}</Text>
            <Text style={[type.b3, { color: colors.grey600 }]}>{p.firmShort} Firm</Text>
          </View>
        </View>
        <Input testID="connect-subject" label="Subject" placeholder="Write your Subject here" value={subject} onChangeText={setSubject} counter={200} />
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[type.b2, { color: colors.grey700 }]}>Compose message</Text>
            <Text testID="generate-ai" onPress={() => setAi(true)} style={[type.l3, { color: colors.blue }]}>
              ✦ Generate with AI
            </Text>
          </View>
          <Input testID="connect-body" placeholder="Write your message here…" value={body} onChangeText={setBody} multiline counter={2000} style={{ minHeight: 180 }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={[type.b2, { color: colors.grey700 }]}>Add Profile Summary</Text>
          <Toggle value={summary} onValueChange={setSummary} label="Add Profile Summary" />
        </View>
        {file ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white }}>
            <Text style={[type.l4, { color: colors.grey700, borderWidth: 1, borderColor: colors.borderLight, padding: 8, borderRadius: 4 }]}>PDF</Text>
            <View style={{ flex: 1 }}>
              <Text style={[type.l2, { color: colors.grey900 }]}>{file.name}</Text>
              <Text style={[type.b4, { color: colors.grey600 }]}>{file.size}</Text>
            </View>
            <Feather name="trash-2" size={16} color={colors.grey700} onPress={() => setFile(null)} />
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable onPress={() => setAi(true)} style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white }}>
            <Text style={[type.l4, { color: colors.blue }]}>✦ Write with AI</Text>
          </Pressable>
          {!file ? (
            <Pressable onPress={async () => setFile(await pickDocument())} style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.white }}>
              <Feather name="upload" size={11} color={colors.grey700} />
              <Text style={[type.l4, { color: colors.grey700 }]}>Upload attachment</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Sheet visible={preview} onClose={() => setPreview(false)} title="New Message" maxHeight="96%" footer={<Button testID="preview-send" title="Send" variant="dark" icon={<Feather name="arrow-up" size={18} color={colors.white} />} onPress={send} />}>
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {[['To:', toEmail], ['From:', s.email], ['Subject:', subject]].map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.borderLight }}>
              <Text style={[type.b2, { color: colors.grey500 }]}>{k}</Text>
              <Text style={[type.b2, { color: colors.grey900, flex: 1 }]}>{v}</Text>
            </View>
          ))}
          <Text style={[type.b2, { color: colors.grey900 }]}>{body}</Text>
          {summary ? (
            <View testID="profile-summary" style={{ borderWidth: 1, borderColor: colors.borderLight, borderRadius: 8, overflow: 'hidden' }}>
              <Text style={[type.l3, { color: colors.grey900, padding: 10, backgroundColor: colors.grey100 }]}>Profile Summary</Text>
              {[
                ['Name', `${s.profile.firstName} ${s.profile.lastName}`.trim() || 'John Doe'],
                ['Company Name', s.profile.companyName || '—'],
                ['Capital Raise', (s.answers.details.raiseSize as string) || s.profile.raiseSize || '—'],
                ['Current Stage', s.profile.currentStage || '—'],
                ['Annual Revenue', s.profile.annualRevenue || '—'],
                ['Industry Focus', ([] as string[]).concat((s.answers.details.industries as string[]) ?? []).join(', ') || '—'],
                ['Geographic Focus', (s.answers.details.geo as string) || '—'],
              ].map(([k, v]) => (
                <View key={k} style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 6, borderTopWidth: 1, borderColor: colors.borderLight }}>
                  <Text style={[type.b3, { color: colors.grey500, width: 120 }]}>{k}</Text>
                  <Text style={[type.b3, { color: colors.grey900, flex: 1 }]}>{v}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {file ? <Text style={[type.l3, { color: colors.grey700 }]}>Attachment: {file.name}</Text> : null}
          {s.profile.pitchDeck ? <Text style={[type.l3, { color: colors.grey700 }]}>Pitch deck attached</Text> : null}
        </View>
      </Sheet>
      <Sheet visible={ai} onClose={() => setAi(false)} title="✦ Write with AI" footer={<View style={{ gap: 6 }}><Button testID="ai-generate" title="Generate Email" loading={busy} onPress={generate} /><Text style={[type.b4, { color: colors.grey500, textAlign: 'center' }]}>AI will draft a message you can edit before sending.</Text></View>}>
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <Text style={[type.b2, { color: colors.grey700 }]}>Tone</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tones.map((t) => (
              <Chip key={t} label={t} selected={tone === t} onPress={() => setTone(t)} />
            ))}
          </View>
          <Input label="Prompt" placeholder="Write your Prompt here… (optional)" value={prompt} onChangeText={setPrompt} multiline counter={280} />
        </View>
      </Sheet>
      {element}
    </Screen>
  );
}
