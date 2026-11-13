// Messages (Figma: Messages, select chats, move to tag).
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, BackButton, Checkbox, EmptyState, FilterPills, SearchBar, Tag, toast } from '@/components/ui';
import { advisors, chatTags, providers, type ChatStatus } from '@/data/sample';
import { useApp } from '@/store/app-store';
import { colors, type, fonts } from '@/theme/tokens';

const people = [...providers, ...advisors];

export default function Messages() {
  const s = useApp();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [select, setSelect] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [moveOpen, setMoveOpen] = useState(false);

  const custom = s.customTags;
  const pills = ['All', 'Unread', ...chatTags, ...custom.map((t) => t.name)];
  const list = s.conversations.filter((c) => {
    const p = people.find((x) => x.id === c.personId)!;
    if (q && !`${p.name} ${p.firm}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === 'All') return true;
    if (filter === 'Unread') return c.unread;
    if ((chatTags as string[]).includes(filter)) return c.status === filter;
    return custom.find((t) => t.name === filter)?.ids.includes(c.id);
  });

  const move = (status: ChatStatus) => {
    s.setConversationStatus(picked, status);
    toast(`Moved ${picked.length} chat${picked.length > 1 ? 's' : ''} to ${status}`);
    setPicked([]);
    setSelect(false);
    setMoveOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
        <BackButton onPress={() => (select ? (setSelect(false), setPicked([])) : router.back())} />
        <Text style={[type.h1, { color: colors.grey900, flex: 1, fontSize: 22 }]}>{select ? `${picked.length} Selected` : 'Messages'}</Text>
        {select ? (
          <Pressable disabled={!picked.length} onPress={() => setMoveOpen(!moveOpen)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, opacity: picked.length ? 1 : 0.4 }}>
            <Text style={[type.b3, { color: colors.grey600 }]}>Move to</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.borderMedium, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={[type.l3, { color: colors.grey900 }]}>Status</Text>
              <Feather name="chevron-down" size={12} />
            </View>
          </Pressable>
        ) : (
          <Text testID="select-chats" onPress={() => setSelect(true)} style={[type.l3, { color: colors.grey700 }]}>
            Select chats
          </Text>
        )}
      </View>
      {moveOpen ? (
        <View style={{ position: 'absolute', right: 16, top: 100, zIndex: 10, backgroundColor: colors.white, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight, paddingVertical: 4, elevation: 6, shadowColor: colors.espressoNoir, shadowOpacity: 0.12, shadowRadius: 8 }}>
          {chatTags.map((t) => (
            <Pressable key={t} testID={`move-${t}`} onPress={() => move(t)} style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
              <Text style={[type.b2, { color: colors.grey900 }]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}>
        <SearchBar value={q} onChangeText={setQ} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <FilterPills options={pills} value={filter} onChange={setFilter} />
          </View>
          <Pressable testID="new-tag" accessibilityLabel="New tag" onPress={() => router.push('/messages/new-tag')} style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.borderMedium, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="plus" size={16} color={colors.grey700} />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        ListEmptyComponent={<EmptyState icon="message-square" title="No conversations" body="Send a connection request from a capital provider’s profile to start a conversation." />}
        renderItem={({ item: c }) => {
          const p = people.find((x) => x.id === c.personId)!;
          const on = picked.includes(c.id);
          return (
            <Pressable
              testID={`conv-${c.id}`}
              onPress={() => (select ? setPicked(on ? picked.filter((x) => x !== c.id) : [...picked, c.id]) : router.push({ pathname: '/chat/[id]', params: { id: c.id } }))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.borderLight }}
            >
              {select ? <Checkbox on={on} /> : null}
              <Avatar name={p.name} size={46} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.l1, { color: colors.grey900, fontFamily: c.unread ? fonts.bold : fonts.medium }]}>{p.name}</Text>
                <Text style={[type.b2, { color: colors.grey600 }]}>{p.firm}</Text>
                <Tag label={c.status} tone="blue" style={{ marginTop: 2 }} />
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text style={[type.b4, { color: colors.grey500 }]}>{c.time}</Text>
                {c.unread ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand }} /> : null}
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
