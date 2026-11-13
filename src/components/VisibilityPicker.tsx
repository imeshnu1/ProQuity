// "Choose your visibility preference" (Figma: Confidentiality & Visibility preference).
import { Pressable, Text, View } from 'react-native';
import { Toggle } from '@/components/ui';
import { visibilityOptions, type VisibilityId } from '@/data/questionnaire';
import { colors, radius, type, fonts } from '@/theme/tokens';

export function VisibilityPicker({ value, onChange }: { value: VisibilityId; onChange: (v: VisibilityId) => void }) {
  return (
    <View style={{ gap: 12 }}>
      {visibilityOptions.map((o) => {
        const on = o.id === value;
        return (
          <Pressable key={o.id} testID={`vis-${o.id}`} onPress={() => onChange(o.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} style={{ padding: 14, borderRadius: radius.card, borderWidth: 1, borderColor: on ? colors.brand : colors.borderMedium, backgroundColor: on ? colors.bgDefault : colors.bg, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[type.h3, { color: colors.grey900, flex: 1, fontFamily: fonts.medium }]}>{o.title}</Text>
              <Toggle value={on} onValueChange={() => onChange(o.id)} label={o.title} />
            </View>
            <Text style={[type.b3, { color: colors.grey900 }]}>{o.tag}</Text>
            <Text style={[type.b2, { color: colors.grey600 }]}>{o.body}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
