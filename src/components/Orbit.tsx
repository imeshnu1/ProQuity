// The "seeker / provider / advisor" orbit illustration from the welcome screen (Figma: onBoarding-1).
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

function Node({ label, top, left, small }: { label: string; top: number; left: number; small?: boolean }) {
  return (
    <View style={[st.ring, { top, left }]}>
      <View style={st.node}>
        <Text style={[st.nodeText, small && { fontSize: 12, lineHeight: 18 }]}>{label}</Text>
      </View>
    </View>
  );
}

export function Orbit({ height = 520 }: { height?: number }) {
  // Positions follow the 430px-wide Figma frame; the container is centred.
  return (
    <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 430, height: 520, transform: [{ scale: Math.min(1, height / 520) }] }}>
        <View style={st.dashCircle} />
        <View style={[st.dashLine, { left: 214, top: 168, height: 57 }]} />
        <View style={[st.dot, { left: 182, top: 196 }]} />
        <View style={[st.dot, { left: 114, top: 402 }]} />
        <View style={[st.dot, { left: 296, top: 400 }]} />
        <View style={st.center}>
          <Image source={require('../../assets/images/ring-180.png')} style={{ width: 180, height: 180, position: 'absolute' }} />
          <Image source={require('../../assets/images/ring-150.png')} style={{ width: 150, height: 150, position: 'absolute' }} />
          <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: colors.hairline, position: 'absolute' }} />
          <View style={st.logo}>
            <Image source={require('../../assets/images/p-logo.svg')} style={{ width: 30, height: 24 }} contentFit="contain" />
          </View>
        </View>
        <Node label={'Capital\nSeeker'} top={68} left={155} />
        <Node label={'Capital\nAdvisor'} top={423} left={36} />
        <Node label={'Capital\nProviders'} top={423} left={290} small />
        <View style={[st.avatarDot, { left: 112, top: 520 }]} />
      </View>
    </View>
  );
}

export function PLogo({ size = 80 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../../assets/images/p-logo.svg')} style={{ width: size * 0.37, height: size * 0.29 }} contentFit="contain" />
    </View>
  );
}

const st = StyleSheet.create({
  dashCircle: { position: 'absolute', left: 30, top: 125, width: 370, height: 370, borderRadius: 185, borderWidth: 1.5, borderColor: colors.strongHairline, borderStyle: 'dashed' },
  dashLine: { position: 'absolute', width: 0, borderLeftWidth: 1.5, borderColor: colors.strongHairline, borderStyle: 'dashed' },
  dot: { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.strongHairline, backgroundColor: colors.bg },
  center: { position: 'absolute', left: 125, top: 220, width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' },
  node: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  nodeText: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.bgDefault, textAlign: 'center' },
  avatarDot: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: colors.hairline, borderWidth: 1, borderColor: colors.grey200, display: 'none' },
});
