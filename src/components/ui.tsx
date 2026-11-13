// Shared building blocks that match the Figma components (proquityButton, roleSelection,
// chips, inputs, bottom sheets, toasts…). Screens are assembled from these.
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, shadow, type } from '@/theme/tokens';

export type IconName = React.ComponentProps<typeof Feather>['name'];

// ---------- Text ----------
type TP = { style?: StyleProp<TextStyle>; children?: React.ReactNode; numberOfLines?: number; onPress?: () => void; testID?: string };
const mkText = (base: TextStyle) =>
  function T({ style, ...rest }: TP) {
    return <Text {...rest} style={[base, style]} />;
  };
export const H1 = mkText({ ...type.h1, color: colors.grey900 });
export const H2 = mkText({ ...type.h2, color: colors.grey700 });
export const H3 = mkText({ ...type.h3, color: colors.grey900 });
export const H4 = mkText({ ...type.h4, color: colors.grey900 });
export const Body = mkText({ ...type.b1, color: colors.grey700 });
export const Small = mkText({ ...type.b2, color: colors.grey700 });
export const Caption = mkText({ ...type.b3, color: colors.grey500 });
export const Label = mkText({ ...type.l2, color: colors.grey700 });

// ---------- Screen ----------
export function Screen({
  children,
  scroll = true,
  footer,
  style,
  padded = true,
  bg = colors.bg,
  edges = ['top'],
}: {
  children: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  bg?: string;
  edges?: ('top' | 'bottom')[];
}) {
  const insets = useSafeAreaInsets();
  const inner = [padded && { paddingHorizontal: 20 }, style];
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView contentContainerStyle={[{ flexGrow: 1, paddingBottom: 24 }, inner]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, inner]}>{children}</View>
        )}
        {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), backgroundColor: bg }}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------- Buttons ----------
export function BackButton({ onPress, icon = 'arrow-left' }: { onPress?: () => void; icon?: IconName }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={icon === 'x' ? 'Close' : 'Back'}
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      style={({ pressed }) => [s.back, pressed && { opacity: 0.6 }]}
      hitSlop={8}
    >
      <Feather name={icon} size={22} color={colors.brand} />
    </Pressable>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
  small,
  testID,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'linkedin' | 'danger' | 'light' | 'dark';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  testID?: string;
}) {
  const v = {
    primary: { bg: colors.brand, fg: colors.onBrand, border: colors.brand },
    outline: { bg: 'transparent', fg: colors.brand, border: colors.brand },
    ghost: { bg: 'transparent', fg: colors.brand, border: 'transparent' },
    linkedin: { bg: colors.linkedin, fg: colors.white, border: colors.linkedin },
    danger: { bg: colors.error, fg: colors.white, border: colors.error },
    light: { bg: colors.white, fg: colors.brand, border: colors.white },
    dark: { bg: colors.deepBordeaux, fg: colors.onBrand, border: colors.deepBordeaux },
  }[variant];
  const off = disabled && variant === 'primary';
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        small && { paddingVertical: 8, paddingHorizontal: 14 },
        { backgroundColor: off ? colors.disabled : v.bg, borderColor: off ? colors.disabled : v.border },
        disabled && variant !== 'primary' && { opacity: 0.5 },
        pressed && !disabled && (variant === 'primary' ? { backgroundColor: colors.brandPressed, borderColor: colors.brandPressed } : { opacity: 0.85 }),
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : icon}
      <Text style={[small ? type.l2 : type.button, { color: off ? colors.white : v.fg }]}>{title}</Text>
    </Pressable>
  );
}

export function LinkText({ children, onPress, style, href }: { children: React.ReactNode; onPress?: () => void; style?: StyleProp<TextStyle>; href?: string }) {
  // Defaults to the matching page on proquity.io (e.g. "Terms of Use" → /terms-of-use).
  const url = href ?? `https://proquity.io/${String(children).toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <Text accessibilityRole="link" onPress={onPress ?? (() => Linking.openURL(url))} style={[type.l2, { color: colors.brand, textDecorationLine: 'underline' }, style]}>
      {children}
    </Text>
  );
}

export function IconButton({ icon, onPress, badge, label, size = 22, style, testID }: { icon: IconName; onPress?: () => void; badge?: boolean; label: string; size?: number; style?: StyleProp<ViewStyle>; testID?: string }) {
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={8} style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.6 }, style]}>
      <Feather name={icon} size={size} color={colors.brand} />
      {badge ? <View style={s.badge} /> : null}
    </Pressable>
  );
}

// ---------- Selection ----------
export function Radio({ on }: { on: boolean }) {
  return (
    <View style={[s.radio, on && { borderColor: colors.brand }]}>
      {on ? <View style={s.radioDot} /> : null}
    </View>
  );
}

export function Checkbox({ on }: { on: boolean }) {
  return (
    <View style={[s.check, on && { backgroundColor: colors.brand, borderColor: colors.brand }]}>
      {on ? <Feather name="check" size={13} color={colors.white} /> : null}
    </View>
  );
}

export function Tag({ label, tone = 'tint', style }: { label: string; tone?: 'tint' | 'outline' | 'green' | 'orange' | 'red' | 'blue'; style?: StyleProp<ViewStyle> }) {
  const t = {
    tint: { bg: colors.chipTint, fg: colors.grey700, b: colors.borderStroke },
    outline: { bg: 'transparent', fg: colors.grey700, b: colors.borderMedium },
    green: { bg: colors.oliveWash, fg: colors.success, b: 'transparent' },
    orange: { bg: colors.goldWash, fg: colors.cognacGold, b: 'transparent' },
    red: { bg: colors.errorWash, fg: colors.error, b: 'transparent' },
    blue: { bg: colors.blueLight, fg: colors.blue, b: 'transparent' },
  }[tone];
  return (
    <View style={[s.tag, { backgroundColor: t.bg, borderColor: t.b }, style]}>
      <Text style={[type.l4, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export function OptionCard({
  title,
  subtitle,
  tags,
  selected,
  onPress,
  showRadio = true,
  testID,
}: {
  title: string;
  subtitle?: string;
  tags?: string[];
  selected: boolean;
  onPress: () => void;
  showRadio?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [s.option, selected && s.optionOn, pressed && { opacity: 0.9 }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={[type.h2, { color: colors.grey700, flex: 1, fontFamily: fonts.medium }]}>{title}</Text>
        {showRadio ? <Radio on={selected} /> : null}
      </View>
      {subtitle ? <Text style={[type.b2, { color: colors.grey700, marginTop: 4 }]}>{subtitle}</Text> : null}
      {selected && tags?.length ? (
        <>
          <View style={{ height: 1, backgroundColor: colors.borderStroke, marginTop: 12 }} />
          <View style={s.tagWrap}>
            {tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </View>
        </>
      ) : null}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, testID }: { label: string; selected: boolean; onPress: () => void; testID?: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [s.chip, selected && s.chipOn, pressed && { opacity: 0.85 }]}
    >
      <Text style={[type.l2, { color: colors.brand }]}>{label}</Text>
    </Pressable>
  );
}

export function ChipGroup({ options, value, onChange, multi }: { options: string[]; value: string | string[] | undefined; onChange: (v: any) => void; multi?: boolean }) {
  const sel = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <View style={s.chipWrap}>
      {options.map((o) => (
        <Chip
          key={o}
          label={o}
          selected={sel.includes(o)}
          onPress={() => {
            if (multi) onChange(sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]);
            else onChange(sel.includes(o) ? '' : o);
          }}
        />
      ))}
    </View>
  );
}

// ---------- Inputs ----------
export function Input({
  label,
  icon,
  error,
  hint,
  style,
  multiline,
  counter,
  rightIcon,
  ...props
}: TextInputProps & { label?: string; icon?: IconName; rightIcon?: IconName; error?: string; hint?: string; counter?: number }) {
  const [focus, setFocus] = useState(false);
  const len = typeof props.value === 'string' ? props.value.length : 0;
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={[type.b2, { color: colors.grey700 }]}>{label}</Text> : null}
      <View style={[s.input, multiline && { minHeight: 120, alignItems: 'flex-start', paddingVertical: 12 }, focus && { borderColor: colors.brand }, !!error && { borderColor: colors.error }]}>
        {icon ? <Feather name={icon} size={18} color={colors.grey500} /> : null}
        <TextInput
          placeholderTextColor={colors.placeholder}
          onFocus={(e) => {
            setFocus(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            props.onBlur?.(e);
          }}
          multiline={multiline}
          maxLength={counter}
          style={[type.b1, { flex: 1, color: colors.grey900, paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }, multiline && { textAlignVertical: 'top', minHeight: 96 }, style]}
          {...props}
        />
        {rightIcon ? <Feather name={rightIcon} size={18} color={colors.grey500} /> : null}
      </View>
      {error ? <Text style={[type.b3, { color: colors.error }]}>{error}</Text> : null}
      {hint && !error ? (
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Feather name="info" size={13} color={colors.grey500} style={{ marginTop: 3 }} />
          <Text style={[type.b3, { color: colors.grey500, flex: 1 }]}>{hint}</Text>
        </View>
      ) : null}
      {counter ? <Text style={[type.b4, { color: colors.grey500, alignSelf: 'flex-end' }]}>{`${len}/${counter}`}</Text> : null}
    </View>
  );
}

export function SelectField({ label, value, placeholder, onPress, testID }: { label?: string; value?: string; placeholder: string; onPress: () => void; testID?: string }) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={[type.b2, { color: colors.grey700 }]}>{label}</Text> : null}
      <Pressable testID={testID} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.input, pressed && { opacity: 0.85 }]}>
        <Text numberOfLines={1} style={[type.b1, { flex: 1, color: value ? colors.grey900 : colors.placeholder }]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color={colors.grey600} />
      </Pressable>
    </View>
  );
}

// Dropdown that opens under the field (Figma: "What type of capital are you raising?").
export function InlineSelect({
  label,
  options,
  value,
  display,
  open,
  onToggle,
  onChange,
  testID,
}: {
  label?: string;
  options: { id: string; title: string; subtitle?: string }[];
  value?: string;
  display?: string;
  open: boolean;
  onToggle: () => void;
  onChange: (id: string) => void;
  testID?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={[type.b2, { color: colors.grey700 }]}>{label}</Text> : null}
      <Pressable testID={testID} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onToggle} style={[s.input, open && { borderColor: colors.brand }]}>
        <Text numberOfLines={1} style={[type.b1, { flex: 1, color: display ? colors.grey900 : colors.placeholder }]}>
          {display || 'Select an option'}
        </Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.grey600} />
      </Pressable>
      {open ? (
        <View style={{ borderWidth: 1, borderColor: colors.brand, borderRadius: radius.lg, backgroundColor: colors.white, overflow: 'hidden' }}>
          {options.map((o, i) => {
            const on = o.id === value;
            return (
              <Pressable key={o.id} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => onChange(o.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderTopWidth: i ? 1 : 0, borderColor: colors.borderLight, backgroundColor: on ? colors.selected : colors.white }}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.b1, { color: colors.grey900 }]}>{o.title}</Text>
                  {o.subtitle ? <Text style={[type.b3, { color: colors.grey600 }]}>{o.subtitle}</Text> : null}
                </View>
                <Radio on={on} />
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder = 'Search by name', right }: { value: string; onChangeText: (t: string) => void; placeholder?: string; right?: React.ReactNode }) {
  return (
    <View style={s.search}>
      <Feather name="search" size={16} color={colors.grey500} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={[type.b2, { flex: 1, color: colors.grey900, paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }]}
      />
      {right}
    </View>
  );
}

export function Toggle({ value, onValueChange, label }: { value: boolean; onValueChange: (v: boolean) => void; label?: string }) {
  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: colors.success, false: colors.grey300 }}
      thumbColor={colors.white}
      {...(Platform.OS === 'web' ? ({ activeThumbColor: colors.white } as any) : null)}
    />
  );
}

// ---------- Layout bits ----------
export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={s.progress} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}>
      <View style={[s.progressFill, { width: `${Math.max(4, Math.min(100, value * 100))}%` }]} />
    </View>
  );
}

export function Card({ children, style, onPress, testID }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; testID?: string }) {
  if (onPress)
    return (
      <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [s.card, style, pressed && { opacity: 0.9 }]}>
        {children}
      </Pressable>
    );
  return <View style={[s.card, style]}>{children}</View>;
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: colors.borderLight }, style]} />;
}

export function SecureNote({ text = 'Your data is encrypted and not shared without any consent.' }: { text?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 30 }}>
      <Feather name="lock" size={13} color={colors.grey600} style={{ marginTop: 2 }} />
      <Text style={[type.b3, { color: colors.grey600, textAlign: 'center' }]}>{text}</Text>
    </View>
  );
}

export function Avatar({ name, size = 48, dark = true, photo }: { name: string; size?: number; dark?: boolean; photo?: string | null }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const isUri = photo && photo !== 'initials';
  if (isUri) {
    return <ExpoImage source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? colors.brand : colors.blueLight, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.semibold, color: dark ? colors.white : colors.brand, fontSize: size * 0.34 }}>{initials}</Text>
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 }}>
      <Text style={[type.b1, { color: colors.grey600 }]}>{title}</Text>
      {action ? (
        <Text onPress={onAction} accessibilityRole="button" style={[type.l3, { color: colors.brand }]}>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

export function Segmented({ tabs, value, onChange, filled }: { tabs: string[]; value: string; onChange: (t: string) => void; filled?: boolean }) {
  return (
    <View style={[{ flexDirection: 'row' }, filled && { backgroundColor: colors.grey200, borderRadius: 30, padding: 4 }]}>
      {tabs.map((t) => {
        const on = t === value;
        return (
          <Pressable
            key={t}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(t)}
            style={[
              { flex: 1, alignItems: 'center', paddingVertical: 10 },
              filled ? on && { backgroundColor: colors.brand, borderRadius: 26 } : { borderBottomWidth: on ? 2 : 0, borderColor: colors.brand },
            ]}
          >
            <Text style={[type.l2, { color: filled ? (on ? colors.white : colors.grey500) : on ? colors.brand : colors.grey500 }]}>{t}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function FilterPills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable key={o} onPress={() => onChange(o)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[s.pill, on && { backgroundColor: colors.brand, borderColor: colors.brand }]}>
            <Text style={[type.l3, { color: on ? colors.white : colors.grey700 }]}>{o}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function EmptyState({ icon, title, body, children }: { icon: IconName; title: string; body?: string; children?: React.ReactNode }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.grey200, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={icon} size={36} color={colors.brand} />
      </View>
      <Text style={[type.b1, { color: colors.grey900 }]}>{title}</Text>
      {body ? <Text style={[type.b3, { color: colors.grey600, textAlign: 'center', maxWidth: 280 }]}>{body}</Text> : null}
      {children}
    </View>
  );
}

// ---------- Overlays ----------
export function Sheet({
  visible,
  onClose,
  title,
  children,
  footer,
  maxHeight = '85%',
  showClose = true,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: `${number}%` | number;
  showClose?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.sheetWrap}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
          <View style={[s.sheet, { maxHeight, paddingBottom: Math.max(insets.bottom, 16) }]}>
            {title || showClose ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 12 }}>
                <Text style={[type.h3, { color: colors.grey900, flex: 1, fontFamily: fonts.medium }]}>{title}</Text>
                {showClose ? <IconButton icon="x" label="Close" onPress={onClose} /> : null}
              </View>
            ) : null}
            <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 8 }}>
              {children}
            </ScrollView>
            {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>{footer}</View> : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export type SheetOption = { id: string; title: string; subtitle?: string };
export function OptionSheet({
  visible,
  onClose,
  title = 'Select an option',
  options,
  value,
  onChange,
  multi,
  searchable,
  heading,
  saveLabel,
  maxHeight,
}: {
  maxHeight?: `${number}%` | number;
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: SheetOption[];
  value: string | string[] | undefined;
  onChange: (v: any) => void;
  multi?: boolean;
  searchable?: boolean;
  heading?: string;
  saveLabel?: string;
}) {
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<string[]>([]);
  // Reset the search and draft each time the sheet opens.
  const [wasVisible, setWasVisible] = useState(false);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setQ('');
      setDraft(Array.isArray(value) ? value : value ? [value] : []);
    }
  }
  const list = options.filter((o) => o.title.toLowerCase().includes(q.toLowerCase()));
  const pick = (id: string) => {
    if (multi) setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
    else if (saveLabel) setDraft([id]);
    else {
      onChange(id);
      onClose();
    }
  };
  const needsSave = multi || !!saveLabel;
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={title}
      maxHeight={maxHeight}
      footer={needsSave ? <Button title={saveLabel || 'Done'} onPress={() => { onChange(multi ? draft : draft[0] ?? ''); onClose(); }} /> : undefined}
    >
      {heading ? <Text style={[type.b1, { color: colors.grey700, paddingHorizontal: 20, paddingBottom: 8 }]}>{heading}</Text> : null}
      {searchable ? (
        <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
          <SearchBar value={q} onChangeText={setQ} placeholder="Search" />
        </View>
      ) : null}
      {list.map((o) => {
        const on = draft.includes(o.id);
        return (
          <Pressable key={o.id} accessibilityRole={multi ? 'checkbox' : 'radio'} accessibilityState={{ checked: on }} onPress={() => pick(o.id)} style={[s.sheetRow, on && { backgroundColor: colors.selected }]}>
            <View style={{ flex: 1 }}>
              <Text style={[type.b1, { color: colors.grey900 }]}>{o.title}</Text>
              {o.subtitle ? <Text style={[type.b3, { color: colors.grey600 }]}>{o.subtitle}</Text> : null}
            </View>
            {multi ? <Checkbox on={on} /> : <Radio on={on} />}
          </Pressable>
        );
      })}
      {list.length === 0 ? <Text style={[type.b2, { color: colors.grey500, padding: 20 }]}>No results</Text> : null}
    </Sheet>
  );
}

export function Dialog({
  visible,
  title,
  body,
  actions,
  onClose,
  icon,
}: {
  visible: boolean;
  title: string;
  body?: string;
  actions: { label: string; onPress: () => void; variant?: 'primary' | 'outline' | 'danger' | 'link' }[];
  onClose?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.dialogWrap}>
        <View style={s.dialog}>
          {onClose ? (
            <View style={{ position: 'absolute', right: 10, top: 10 }}>
              <IconButton icon="x" label="Close" onPress={onClose} size={18} />
            </View>
          ) : null}
          {icon}
          <Text style={[type.h4, { color: colors.grey900, textAlign: icon ? 'center' : 'left', paddingRight: onClose ? 24 : 0 }]}>{title}</Text>
          {body ? <Text style={[type.b3, { color: colors.grey600, marginTop: 8, textAlign: icon ? 'center' : 'left' }]}>{body}</Text> : null}
          <View style={{ flexDirection: actions.length > 1 && actions.every((a) => a.variant !== 'link') ? 'row' : 'column', gap: 10, marginTop: 18 }}>
            {actions.map((a) =>
              a.variant === 'link' ? (
                <Pressable key={a.label} onPress={a.onPress} style={{ paddingVertical: 10, borderTopWidth: 1, borderColor: colors.borderLight, alignItems: 'center' }}>
                  <Text style={[type.l2, { color: colors.brand }]}>{a.label}</Text>
                </Pressable>
              ) : (
                <Button key={a.label} small title={a.label} variant={a.variant ?? 'primary'} onPress={a.onPress} style={{ flex: actions.length > 1 ? 1 : undefined }} />
              ),
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Toast — "Email verified successfully!", "Changes saved Successfully."
let toastListener: ((m: { text: string; tone: 'success' | 'error' }) => void) | null = null;
export const toast = (text: string, tone: 'success' | 'error' = 'success') => toastListener?.({ text, tone });

export function ToastHost() {
  const [msg, setMsg] = useState<{ text: string; tone: 'success' | 'error' } | null>(null);
  const [op] = useState(() => new Animated.Value(0));
  const insets = useSafeAreaInsets();
  useEffect(() => {
    toastListener = (m) => {
      setMsg(m);
      Animated.sequence([
        Animated.timing(op, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web' }),
        Animated.delay(2200),
        Animated.timing(op, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }),
      ]).start(() => setMsg(null));
    };
    return () => {
      toastListener = null;
    };
  }, [op]);
  if (!msg) return null;
  return (
    <Animated.View pointerEvents="none" style={[s.toast, { opacity: op, bottom: insets.bottom + 90, backgroundColor: msg.tone === 'success' ? colors.successToast : colors.error }]}>
      <Feather name={msg.tone === 'success' ? 'check-circle' : 'alert-circle'} size={16} color={colors.white} />
      <Text style={[type.l2, { color: colors.white }]} testID="toast">
        {msg.text}
      </Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  back: { width: 42, height: 42, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  btn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius.pill, borderWidth: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  check: { width: 18, height: 18, borderRadius: 3, borderWidth: 1.5, borderColor: colors.grey400, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm, borderWidth: 0.8, alignSelf: 'flex-start' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  option: { padding: 20, borderRadius: radius.card, borderWidth: 1, borderColor: colors.borderMedium, backgroundColor: colors.white },
  optionOn: { backgroundColor: colors.selected, borderColor: colors.brand, ...shadow.card },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 30, borderWidth: 1, borderColor: colors.borderMedium, backgroundColor: colors.white },
  chipOn: { backgroundColor: colors.roseWash, borderColor: colors.brand },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderMedium, backgroundColor: colors.bgDefault },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 14, borderRadius: 30, backgroundColor: colors.bgDefault, borderWidth: 1, borderColor: colors.borderLight },
  progress: { height: 4, borderRadius: 2, backgroundColor: colors.borderMedium, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: colors.brand },
  card: { backgroundColor: colors.bgDefault, borderRadius: radius.card, padding: 16, borderWidth: 1, borderColor: colors.borderLight },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 30, borderWidth: 1, borderColor: colors.borderMedium },
  sheetWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, ...shadow.sheet, width: '100%', maxWidth: 480, alignSelf: 'center' },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderColor: colors.borderLight },
  dialogWrap: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 24 },
  dialog: { backgroundColor: colors.white, borderRadius: 16, padding: 20, width: '100%', maxWidth: 380 },
  toast: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 6, maxWidth: 380 },
});

// Placeholder shown while content loads (Figma: Lazy Loading, Match-Loading).
export function Skeleton({ h = 16, w = '100%', r = 8, style }: { h?: number; w?: number | `${number}%`; r?: number; style?: StyleProp<ViewStyle> }) {
  const [a] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(a, { toValue: 0.5, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a]);
  return <Animated.View style={[{ height: h, width: w, borderRadius: r, backgroundColor: colors.grey200, opacity: a }, style]} />;
}

const seen = new Set<string>();
/** True for a short moment the first time a screen opens in a session, so it can show its skeleton. */
export function useFirstLoad(key: string, ms = 700) {
  const [loading, setLoading] = useState(() => !seen.has(key));
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      seen.add(key);
      setLoading(false);
    }, ms);
    return () => clearTimeout(t);
  }, [loading, key, ms]);
  return loading;
}

/** "Restore purchase • Terms of Use • Privacy Policy" row under subscription buttons. */
export function LegalFooter() {
  return (
    <Text style={[type.b4, { color: colors.grey600, textAlign: 'center' }]}>
      <Text accessibilityRole="button" onPress={() => toast('No previous purchases found for this account')}>
        Restore purchase
      </Text>
      {' • '}
      <LinkText style={[type.b4, { color: colors.grey600 }]}>Terms of Use</LinkText>
      {' • '}
      <LinkText style={[type.b4, { color: colors.grey600 }]}>Privacy Policy</LinkText>
    </Text>
  );
}
