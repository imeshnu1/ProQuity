// Small helpers for the content pages (Resources, News, Articles…).
import { Feather } from '@expo/vector-icons';
import { Share, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { BackButton, IconButton, type IconName } from '@/components/ui';
import { colors, type } from '@/theme/tokens';

export function PageHeader({ title, sub, share }: { title: string; sub?: string; share?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 }}>
      <BackButton />
      <View style={{ flex: 1, paddingTop: 6 }}>
        <Text style={[type.h2, { color: colors.grey900 }]}>{title}</Text>
        {sub ? <Text style={[type.b3, { color: colors.grey600 }]}>{sub}</Text> : null}
      </View>
      {share ? <IconButton icon="share-2" label="Share" onPress={() => Share.share({ message: share })} style={{ borderWidth: 1, borderColor: colors.borderLight, borderRadius: 6, width: 40, height: 40 }} /> : null}
    </View>
  );
}

const tints = [colors.roseWash, colors.lightRose, colors.sand, colors.goldWash, colors.oliveWash];
export function Thumb({ icon, h = 160, seed = 0, children, style }: { icon: IconName; h?: number; seed?: number; children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ height: h, borderRadius: 8, backgroundColor: tints[seed % tints.length], alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, style]}>
      <Feather name={icon} size={Math.min(40, h / 3)} color={colors.blue} style={{ opacity: 0.55 }} />
      {children}
    </View>
  );
}

export function Lock() {
  return (
    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name="lock" size={14} color={colors.grey700} />
    </View>
  );
}
