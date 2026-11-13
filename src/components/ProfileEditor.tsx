// "Complete Your Profile" body (Figma: ProquityAI-v3 profile frames + edit bottom sheets).
// Used in onboarding and on the in-app Profile screen.
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { pickDocument, pickImage } from '@/components/media';
import { ScoreChecklist, ScorePill } from '@/components/Score';
import { Avatar, Button, ChipGroup, Input, OptionSheet, Segmented, Sheet, Tag, toast } from '@/components/ui';
import { annualRevenue, currentStages, geographies, readiness } from '@/data/questionnaire';
import { completion, fullName, useApp, type PitchDeck } from '@/store/app-store';
import { colors, radius, type, fonts } from '@/theme/tokens';
import { isUrl } from '@/utils/format';

const raiseSizes = ['Under $500k', '$500k - $2M', '$2M - $5M', '$5M - $10M', '$10M - $25M', '$25M+'];

type SheetKey = null | 'name' | 'company' | 'raise' | 'stage' | 'revenue' | 'deck' | 'geo' | 'ready' | 'score';

function Section({ label, children, onEdit, testID, style }: { label: string; children: React.ReactNode; onEdit: () => void; testID?: string; style?: object }) {
  return (
    <Pressable testID={testID} onPress={onEdit} style={({ pressed }) => [st.section, style, pressed && { opacity: 0.85 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[type.b3, { color: colors.grey600 }]}>{label}</Text>
        <Feather name="edit-2" size={13} color={colors.grey600} />
      </View>
      {children}
    </Pressable>
  );
}

const Val = ({ v, placeholder = 'Add' }: { v?: string; placeholder?: string }) => (
  <Text style={[type.b2, { color: v ? colors.grey900 : colors.grey400, marginTop: 4 }]}>{v || placeholder}</Text>
);

export function ProfileEditor({ showViews }: { showViews?: boolean }) {
  const state = useApp();
  const p = state.profile;
  const update = state.updateProfile;
  const { score, items } = completion(state);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const close = () => setSheet(null);
  const saved = () => {
    toast('Changes saved Successfully.');
    close();
  };

  // local drafts for sheets with a Save button
  const [first, setFirst] = useState(p.firstName);
  const [last, setLast] = useState(p.lastName);
  const [headline, setHeadline] = useState(p.headline);
  const [hq, setHq] = useState(p.hq);
  const [cName, setCName] = useState(p.companyName);
  const [cWeb, setCWeb] = useState(p.companyWebsite);
  const [cLogo, setCLogo] = useState<string | null>(p.companyLogo);
  const [raise, setRaise] = useState(p.raiseSize);
  const [rev, setRev] = useState(p.annualRevenue);
  const [lastSheet, setLastSheet] = useState<SheetKey>(null);
  if (sheet !== lastSheet) {
    setLastSheet(sheet);
    if (sheet === 'name') {
      setFirst(p.firstName);
      setLast(p.lastName);
      setHeadline(p.headline);
      setHq(p.hq === 'Headquarter location' ? '' : p.hq);
    }
    if (sheet === 'company') {
      setCName(p.companyName);
      setCWeb(p.companyWebsite);
      setCLogo(p.companyLogo);
    }
    if (sheet === 'raise') setRaise(p.raiseSize);
    if (sheet === 'revenue') setRev(p.annualRevenue);
  }

  const geoShown = p.geoFocus.slice(0, 2);
  const name = fullName(p);

  return (
    <View style={{ gap: 12 }}>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Pressable accessibilityLabel="Change profile photo" onPress={async () => { const u = await pickImage(); if (u) update({ photo: u }); }}>
          <Avatar name={name} size={100} photo={p.photo} />
        </Pressable>
        <Pressable testID="edit-name" onPress={() => setSheet('name')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={[type.h3, { color: colors.grey900, fontFamily: fonts.medium }]}>{name}</Text>
          <Feather name="edit-2" size={13} color={colors.grey600} />
        </Pressable>
        <Text style={[type.b2, { color: colors.grey600 }]}>Capital Seeker • {p.headline}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="map-pin" size={12} color={colors.grey600} />
          <Text style={[type.b3, { color: colors.grey600 }]}>{p.hq}</Text>
        </View>
        <View style={{ marginTop: 6 }}>
          <ScorePill score={score} onInfo={() => setSheet('score')} />
        </View>
      </View>

      {showViews ? (
        <View style={[st.section, { gap: 10 }]}>
          <Text style={[type.b3, { color: colors.grey600 }]}>See who’s viewed your profile</Text>
          <View style={{ flexDirection: 'row' }}>
            {['SS', 'BC', 'EJ', 'RT'].map((n, i) => (
              <View key={n} style={{ marginLeft: i ? -10 : 0 }}>
                <Avatar name={n} size={36} />
              </View>
            ))}
            <View style={{ marginLeft: -10, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[type.l4, { color: colors.blue }]}>+20</Text>
            </View>
          </View>
          <Button small variant="outline" title="View All" onPress={() => toast('Profile views are a Premium feature')} />
        </View>
      ) : null}

      <Section testID="edit-company" label="Company Details" onEdit={() => setSheet('company')}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 }}>
          {p.companyLogo ? <Image source={{ uri: p.companyLogo }} style={st.logo} /> : <View style={st.logo} />}
          <View>
            <Text style={[type.b2, { color: p.companyName ? colors.grey900 : colors.grey400 }]}>{p.companyName || 'Company Name'}</Text>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Feather name="globe" size={12} color={colors.grey600} />
              <Text style={[type.b3, { color: colors.grey600 }]}>{p.companyWebsite || 'www.example.com'}</Text>
            </View>
          </View>
        </View>
      </Section>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Section label="Capital/Raise Size" onEdit={() => setSheet('raise')} style={{ flex: 1 }}>
          <Feather name="credit-card" size={14} color={colors.grey600} style={{ marginTop: 6 }} />
          <Val v={p.raiseSize} />
        </Section>
        <Section testID="edit-stage" label="Current Stage" onEdit={() => setSheet('stage')} style={{ flex: 1 }}>
          <Feather name="layers" size={14} color={colors.grey600} style={{ marginTop: 6 }} />
          <Val v={p.currentStage} />
        </Section>
      </View>
      <Section label="Annual Revenue" onEdit={() => setSheet('revenue')}>
        <Val v={p.annualRevenue} />
      </Section>
      <Section testID="edit-deck" label="Pitch Deck" onEdit={() => setSheet('deck')}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 4 }}>
          <Feather name={p.pitchDeck?.kind === 'file' ? 'file-text' : 'link'} size={13} color={colors.grey600} />
          <Text style={[type.b2, { color: p.pitchDeck ? colors.grey900 : colors.grey400 }]} numberOfLines={1}>
            {p.pitchDeck ? (p.pitchDeck.kind === 'file' ? p.pitchDeck.name : p.pitchDeck.url) : 'www.example.com/pitchdeck'}
          </Text>
        </View>
      </Section>
      <Section label="Geographic Focus" onEdit={() => setSheet('geo')}>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {geoShown.length ? geoShown.map((g) => <Tag key={g} label={g} tone="outline" />) : <Val v="" />}
          {p.geoFocus.length > 2 ? <Text style={[type.b3, { color: colors.grey600 }]}>+{p.geoFocus.length - 2}</Text> : null}
        </View>
      </Section>
      <Section label="Readiness" onEdit={() => setSheet('ready')}>
        <Val v={p.readiness} />
      </Section>

      {/* ---- Sheets ---- */}
      <Sheet visible={sheet === 'name'} onClose={close} title="Edit Personal Details" footer={<Button title="Save" disabled={!first.trim() || !last.trim()} onPress={() => { update({ firstName: first.trim(), lastName: last.trim(), headline: headline.trim() || 'Founder & Director', hq: hq.trim() || 'Headquarter location' }); saved(); }} />}>
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <Input label="First name" value={first} onChangeText={setFirst} />
          <Input label="Last name" value={last} onChangeText={setLast} />
          <Input label="Title" value={headline} onChangeText={setHeadline} placeholder="e.g. Founder & Director" />
          <Input label="Headquarter location" value={hq} onChangeText={setHq} placeholder="City, Country" />
        </View>
      </Sheet>

      <Sheet visible={sheet === 'company'} onClose={close} title="Edit Organization Details" footer={<Button testID="company-save" title="Save" disabled={!cName.trim() || (!!cWeb && !isUrl(cWeb))} onPress={() => { update({ companyName: cName.trim(), companyWebsite: cWeb.trim(), companyLogo: cLogo }); saved(); }} />}>
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <Pressable onPress={async () => setCLogo((await pickImage()) ?? cLogo)} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <View style={[st.logo, { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.selected }]}>
              {cLogo ? <Image source={{ uri: cLogo }} style={{ width: 72, height: 72, borderRadius: 8 }} /> : <Feather name="image" size={22} color={colors.brand} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.l1, { color: colors.grey900 }]}>Company Logo</Text>
              <Text style={[type.b3, { color: colors.grey600 }]}>Add a face to your brand and improve trust instantly.</Text>
            </View>
          </Pressable>
          <Input testID="company-name" label="Company Name*" placeholder="Organization name" value={cName} onChangeText={setCName} />
          <Input label="Company Website (optional)" placeholder="www.example.com" rightIcon="link" autoCapitalize="none" value={cWeb} onChangeText={setCWeb} error={cWeb && !isUrl(cWeb) ? 'Enter a valid website' : undefined} hint="This information will be visible to potential investors on your company profile." />
        </View>
      </Sheet>

      <Sheet visible={sheet === 'raise'} onClose={close} title="Select option" footer={<Button title="Save Changes" disabled={!raise} onPress={() => { update({ raiseSize: raise }); saved(); }} />}>
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <Text style={[type.b1, { color: colors.grey700 }]}>Capital/Raise Size</Text>
          <ChipGroup options={raiseSizes} value={raise} onChange={setRaise} />
        </View>
      </Sheet>

      <OptionSheet visible={sheet === 'stage'} onClose={() => { close(); }} title="Select option" heading="Current stage" saveLabel="Save Changes" options={currentStages.map((c) => ({ id: c.title, title: c.title, subtitle: c.subtitle }))} value={p.currentStage} onChange={(v) => { update({ currentStage: v }); toast('Changes saved Successfully.'); }} />

      <Sheet visible={sheet === 'revenue'} onClose={close} title="Select option" footer={<Button title="Save Changes" disabled={!rev} onPress={() => { update({ annualRevenue: rev }); saved(); }} />}>
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <Text style={[type.b1, { color: colors.grey700 }]}>Annual Revenue</Text>
          <ChipGroup options={annualRevenue} value={rev} onChange={setRev} />
        </View>
      </Sheet>

      <OptionSheet visible={sheet === 'geo'} onClose={close} title="Geographic Focus" heading="Select option" multi options={geographies} value={p.geoFocus} saveLabel="Save Changes" onChange={(v) => { update({ geoFocus: v }); toast('Changes saved Successfully.'); }} />
      <OptionSheet visible={sheet === 'ready'} onClose={close} title="Readiness" heading="Select option" saveLabel="Save Changes" options={readiness} value={p.readiness} onChange={(v) => { update({ readiness: v }); toast('Changes saved Successfully.'); }} />

      <PitchDeckSheet visible={sheet === 'deck'} onClose={close} value={p.pitchDeck} onSave={(d) => { update({ pitchDeck: d }); saved(); }} />

      <Sheet visible={sheet === 'score'} onClose={close} title="Profile completion">
        <View style={{ paddingHorizontal: 20 }}>
          <ScoreChecklist score={score} items={items} />
        </View>
      </Sheet>
    </View>
  );
}

export function PitchDeckSheet({ visible, onClose, value, onSave }: { visible: boolean; onClose: () => void; value: PitchDeck; onSave: (d: PitchDeck) => void }) {
  const [tab, setTab] = useState('Upload Doc');
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [prog] = useState(() => new Animated.Value(0));
  const [wasVisible, setWasVisible] = useState(false);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setFile(value?.kind === 'file' ? { name: value.name, size: value.size } : null);
      setUrl(value?.kind === 'url' ? value.url : '');
      setTab(value?.kind === 'url' ? 'Upload URL' : 'Upload Doc');
    }
  }

  const choose = async () => {
    const f = await pickDocument();
    if (!f) return;
    setFile(f);
    setUploading(true);
    prog.setValue(0);
    Animated.timing(prog, { toValue: 1, duration: 1200, useNativeDriver: false }).start(() => setUploading(false));
  };
  const canSave = tab === 'Upload Doc' ? !!file && !uploading : isUrl(url);

  return (
    <Sheet visible={visible} onClose={onClose} title="Pitch Deck" footer={<Button testID="deck-save" title="Save Changes" disabled={!canSave} onPress={() => onSave(tab === 'Upload Doc' ? { kind: 'file', ...file! } : { kind: 'url', url: url.trim() })} />}>
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <Text style={[type.b2, { color: colors.grey600, marginTop: -6 }]}>A strong pitch deck increases your response rate and improves investor conversions.</Text>
        <Segmented tabs={['Upload Doc', 'Upload URL']} value={tab} onChange={setTab} />
        {tab === 'Upload Doc' ? (
          file ? (
            <View style={st.fileRow}>
              <View style={st.pdf}>
                <Text style={[type.l4, { color: colors.grey700 }]}>PDF</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[type.l2, { color: colors.grey900 }]} numberOfLines={1}>{file.name}</Text>
                <Text style={[type.b4, { color: colors.grey600 }]}>{file.size}</Text>
                {uploading ? (
                  <View style={{ height: 4, backgroundColor: colors.grey200, borderRadius: 2 }}>
                    <Animated.View style={{ height: 4, borderRadius: 2, backgroundColor: colors.brand, width: prog.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
                  </View>
                ) : null}
              </View>
              <Feather name={uploading ? 'x' : 'trash-2'} size={18} color={colors.grey700} onPress={() => setFile(null)} accessibilityLabel="Remove file" />
            </View>
          ) : (
            <Pressable testID="deck-upload" onPress={choose} style={st.drop}>
              <Feather name="upload-cloud" size={26} color={colors.brand} />
              <Text style={[type.b3, { color: colors.grey600 }]}>(PDF, PPT, DOC, DOCX supported)</Text>
            </Pressable>
          )
        ) : (
          <Input testID="deck-url" label="Pitch Deck URL" placeholder="https://domain.com/pitchdeck.pdf" value={url} onChangeText={setUrl} autoCapitalize="none" keyboardType="url" rightIcon="link" error={url && !isUrl(url) ? 'Enter a valid URL' : undefined} />
        )}
      </View>
    </Sheet>
  );
}

const st = StyleSheet.create({
  section: { backgroundColor: colors.grey100, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.borderLight },
  logo: { width: 44, height: 44, borderRadius: 6, backgroundColor: colors.grey300 },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight },
  pdf: { width: 44, height: 44, borderRadius: 6, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  drop: { height: 120, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.brand, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
