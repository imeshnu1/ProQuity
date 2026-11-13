// New Tag + Add People (Figma: New Tag, Add People).
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PersonRow } from '@/components/cards';
import { BackButton, Button, Checkbox, Chip, Input, Screen, SearchBar, Sheet, toast } from '@/components/ui';
import { advisors, chatTags, providers } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type } from '@/theme/tokens';

const people = [...providers, ...advisors];

export default function NewTag() {
  const s = useApp();
  const [name, setName] = useState('');
  const [ids, setIds] = useState<string[]>([]);
  const [pick, setPick] = useState(false);
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<string[]>([]);

  const save = () => {
    if ((chatTags as string[]).includes(name.trim())) {
      s.setConversationStatus(ids, name.trim() as any);
    } else s.addTag(name.trim(), ids);
    toast('Tag saved');
    router.back();
  };

  return (
    <Screen footer={<Button testID="tag-save" title="Save" disabled={!name.trim()} onPress={save} />}>
      <View style={{ gap: 16, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BackButton />
          <Text style={[type.h1, { color: colors.grey900, fontSize: 22 }]}>New Tag</Text>
        </View>
        <Input testID="tag-name" label="Tag Name" placeholder="Write tag name you want" value={name} onChangeText={setName} />
        <Text style={[type.b2, { color: colors.grey700 }]}>Common tag suggestions</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {chatTags.map((t) => (
            <Chip key={t} label={t} selected={name === t} onPress={() => setName(t)} />
          ))}
        </View>
        <Text style={[type.b2, { color: colors.grey700 }]}>Include</Text>
        <Pressable testID="add-people" onPress={() => (setDraft(ids), setPick(true))} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: 8, borderWidth: 1, borderColor: colors.borderMedium, paddingHorizontal: 14, backgroundColor: colors.bgDefault }}>
          <Feather name="plus" size={16} color={colors.grey600} />
          <Text style={[type.b1, { color: ids.length ? colors.grey900 : colors.placeholder }]}>{ids.length ? `${ids.length} people added` : 'Add People or Groups'}</Text>
        </Pressable>
      </View>
      <Sheet visible={pick} onClose={() => setPick(false)} title="Add People" maxHeight="90%" footer={<Button title="Add" onPress={() => (setIds(draft), setPick(false))} />}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <SearchBar value={q} onChangeText={setQ} />
        </View>
        {s.conversations
          .map((c) => ({ c, p: people.find((x) => x.id === c.personId)! }))
          .filter(({ p }) => p.name.toLowerCase().includes(q.toLowerCase()))
          .map(({ c, p }) => {
            const on = draft.includes(c.id);
            return <PersonRow key={c.id} p={p} onPress={() => setDraft(on ? draft.filter((x) => x !== c.id) : [...draft, c.id])} right={<Checkbox on={on} />} />;
          })}
      </Sheet>
    </Screen>
  );
}
