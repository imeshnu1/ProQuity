// Profile completion gauge (red < 80, orange < 100, green = 100) as in Figma.
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Checkbox, Tag } from '@/components/ui';
import { colors, type } from '@/theme/tokens';

export const scoreColor = (n: number) => (n >= 100 ? colors.success : n >= 80 ? colors.warning : colors.error);
export const scoreLabel = (n: number) => (n >= 100 ? 'Optimized' : n >= 80 ? 'In Progress' : 'In Complete');
const scoreTone = (n: number) => (n >= 100 ? 'green' : n >= 80 ? 'orange' : 'red') as 'green' | 'orange' | 'red';

export function Gauge({ score, size = 70 }: { score: number; size?: number }) {
  const r = size / 2 - 5;
  const cx = size / 2;
  const cy = size / 2;
  const angle = Math.PI * (1 - Math.min(1, score / 100));
  const ex = cx + r * Math.cos(angle);
  const ey = cy - r * Math.sin(angle);
  const bg = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const fg = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  return (
    <View style={{ width: size, height: size / 2 + 14, alignItems: 'center' }}>
      <Svg width={size} height={size / 2 + 4}>
        <Path d={bg} stroke={colors.grey200} strokeWidth={7} fill="none" strokeLinecap="round" />
        <Path d={fg} stroke={scoreColor(score)} strokeWidth={7} fill="none" strokeLinecap="round" />
      </Svg>
      <Text style={[type.l3, { color: scoreColor(score), marginTop: -12 }]}>{score}%</Text>
    </View>
  );
}

export function ScorePill({ score, onInfo }: { score: number; onInfo?: () => void }) {
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <View testID="score-pill" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: score >= 100 ? colors.oliveWash : colors.goldWash }}>
        <Gauge score={score} size={52} />
        <View style={{ gap: 2 }}>
          <Text style={[type.l3, { color: colors.grey900 }]}>Profile Completion Score</Text>
          <Tag label={scoreLabel(score)} tone={scoreTone(score)} />
        </View>
        {onInfo ? <Feather name="info" size={14} color={colors.grey600} onPress={onInfo} /> : null}
      </View>
      <Text style={[type.b4, { color: colors.grey600 }]}>Strong profiles receive up to 3x more views</Text>
    </View>
  );
}

export function ScoreChecklist({ score, items }: { score: number; items: { key: string; done: boolean }[] }) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 14, borderRadius: 12, backgroundColor: score >= 100 ? colors.oliveWash : score >= 80 ? colors.goldWash : colors.errorWash }}>
        <Gauge score={score} size={80} />
        <View style={{ gap: 4 }}>
          <Text style={[type.l2, { color: colors.blue }]}>Profile completion score</Text>
          <Tag label={scoreLabel(score)} tone={scoreTone(score)} />
        </View>
      </View>
      {items.map((it, i) => (
        <View key={it.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <Checkbox on={it.done} />
          </View>
          <Text style={[type.b1, { color: colors.grey700 }]}>{it.key}</Text>
          {i < items.length - 1 ? <View style={{ position: 'absolute', left: 8, top: 36, width: 1, height: 22, backgroundColor: colors.borderMedium }} /> : null}
        </View>
      ))}
    </View>
  );
}
