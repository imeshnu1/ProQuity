// Role-based intro carousel (Figma: onBoarding-1/2/3 under "Content will be updated based on Role selection").
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MatchCard } from '@/components/cards';
import { Button, LinkText, Screen } from '@/components/ui';
import { providers } from '@/data/sample';
import { colors, radius, type, fonts } from '@/theme/tokens';

function PhoneMock({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={st.mock}>
      <View style={st.mockBar}>
        <Feather name="menu" size={14} color={colors.white} />
      </View>
      {title ? <Text style={[type.h3, { textAlign: 'center', color: colors.grey700, paddingVertical: 10, fontFamily: fonts.medium }]}>{title}</Text> : null}
      {children}
    </View>
  );
}

const cats = [
  { icon: 'folder', t: 'Sample Decks', s: 'Real examples of winning PDF’s' },
  { icon: 'file-text', t: 'Legal Docs', s: 'Agreements, NDA’s & Term sheets' },
  { icon: 'percent', t: 'Calculators', s: 'Burn rate and Runway' },
  { icon: 'film', t: 'Video Library', s: 'Expert Fundraising advice' },
] as const;

const getSlides = () => [
  {
    title: 'Connect with capital providers that matches your opportunity',
    body: 'Search and find Capital providers that matches your opportunity.',
    art: (
      <PhoneMock>
        <View style={{ padding: 10 }}>
          <MatchCard p={providers[0]} width={268} />
        </View>
      </PhoneMock>
    ),
  },
  {
    title: 'Proquity AI finds you best matches',
    body: 'Our AI analyses your opportunity details and profile to help you find best match on daily basis',
    art: (
      <PhoneMock title="Daily matches (10)">
        <View style={{ paddingHorizontal: 10, gap: 8 }}>
          <MatchCard p={providers[0]} width={268} />
        </View>
      </PhoneMock>
    ),
  },
  {
    title: 'Resources to get you ready for your journey',
    body: 'Templates, calculators, sample decks and expert videos to help you prepare and raise with confidence.',
    art: (
      <PhoneMock title="Browse Categories">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 10 }}>
          {cats.map((c) => (
            <View key={c.t} style={st.cat}>
              <Feather name={c.icon} size={16} color={colors.brand} />
              <Text style={[type.l3, { color: colors.grey900, marginTop: 18 }]}>{c.t}</Text>
              <Text style={[type.b4, { color: colors.grey600 }]} numberOfLines={2}>
                {c.s}
              </Text>
            </View>
          ))}
        </View>
      </PhoneMock>
    ),
  },
];

export default function Intro() {
  const slides = getSlides();
  const { width: ww } = useWindowDimensions();
  const width = Math.min(ww, 430);
  const [page, setPage] = useState(0);
  const ref = useRef<ScrollViewInstance>(null);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setPage(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <Screen scroll={false} padded={false}>
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 8 }}>
        <Pressable testID="intro-skip" onPress={() => router.push('/auth/signup')} hitSlop={10}>
          <Text style={[type.l2, { color: colors.grey700 }]}>Skip for now</Text>
        </Pressable>
      </View>
      <ScrollView ref={ref} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll} onScroll={onScroll} scrollEventThrottle={32} style={{ flex: 1 }}>
        {slides.map((s, i) => (
          <View key={i} style={{ width, paddingHorizontal: 20, justifyContent: 'center', gap: 24 }}>
            <View style={{ alignItems: 'center' }}>{s.art}</View>
            <View style={{ gap: 10 }}>
              <Text style={[type.h1_1, { color: colors.grey900, textAlign: 'center' }]}>{s.title}</Text>
              <Text style={[type.b2, { color: colors.grey600, textAlign: 'center' }]}>{s.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginVertical: 16 }}>
        {slides.map((_, i) => (
          <Pressable key={i} accessibilityLabel={`Slide ${i + 1}`} onPress={() => ref.current?.scrollTo({ x: i * width, animated: true })} style={{ width: i === page ? 22 : 6, height: 6, borderRadius: 3, backgroundColor: i === page ? colors.brand : colors.blueLight }} />
        ))}
      </View>
      <View style={{ paddingHorizontal: 20, gap: 12, paddingBottom: 20 }}>
        <Button testID="intro-email" title="Continue with Email" variant="outline" onPress={() => router.push('/auth/signup')} />
        <Button testID="intro-linkedin" title="Continue with LinkedIn" variant="linkedin" icon={<Feather name="linkedin" size={18} color={colors.white} />} onPress={() => router.push({ pathname: '/auth/linkedin', params: { next: 'signup' } })} />
        <Text style={[type.b3, { color: colors.grey600, textAlign: 'center' }]}>
          By proceeding, you agree to the <LinkText style={type.b3}>Terms of Use</LinkText> & <LinkText style={type.b3}>Privacy Policy</LinkText>.
        </Text>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  mock: { width: 290, height: 260, borderRadius: radius.card, backgroundColor: colors.white, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderLight },
  mockBar: { height: 34, backgroundColor: colors.brand, justifyContent: 'center', paddingHorizontal: 12 },
  cat: { width: 129, height: 92, borderRadius: 8, backgroundColor: colors.selected, padding: 10 },
});
